import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Crosshair, Terminal, Zap, Settings2, BarChart3, X } from 'lucide-react';

// --- Utility Functions ---
const generateSortedArray = (size) => {
  const arr = new Set();
  const maxVal = size * 5; // Ensure spread
  while (arr.size < size) {
    arr.add(Math.floor(Math.random() * maxVal) + 10);
  }
  return Array.from(arr).sort((a, b) => a - b);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  // --- Configuration State ---
  const [arraySize, setArraySize] = useState(15);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const speedRef = useRef(800); // Default base speed: 800ms
  
  // --- Core State Management ---
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const [linearState, setLinearState] = useState({
    currentIndex: null, foundIndex: null, steps: 0, status: 'idle', log: 'READY.'
  });

  const [binaryState, setBinaryState] = useState({
    left: null, right: null, mid: null, foundIndex: null, steps: 0, status: 'idle', log: 'READY.'
  });

  const searchIdRef = useRef(0);

  // --- Initialization & Hooks ---
  useEffect(() => {
    handleResetArray();
  }, [arraySize]);

  useEffect(() => {
    // Update the ref so in-flight loops instantly adopt the new speed
    speedRef.current = 800 / speedMultiplier;
  }, [speedMultiplier]);

  const handleResetArray = () => {
    const newArr = generateSortedArray(arraySize);
    setArray(newArr);
    setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
    resetSearchStates();
    setShowMetrics(false);
  };

  const resetSearchStates = () => {
    setLinearState({ currentIndex: null, foundIndex: null, steps: 0, status: 'idle', log: 'AWAITING EXECUTION...' });
    setBinaryState({ left: null, right: null, mid: null, foundIndex: null, steps: 0, status: 'idle', log: 'AWAITING EXECUTION...' });
    setShowMetrics(false);
  };

  // --- Core Algorithms with Educational Logs ---
  const runLinearSearch = async (targetValue, currentSearchId) => {
    setLinearState((s) => ({ ...s, status: 'searching', steps: 0, log: 'INITIALIZING O(n) SEQUENTIAL SCAN...' }));
    await sleep(speedRef.current / 2);
    let steps = 0;

    for (let i = 0; i < array.length; i++) {
      if (searchIdRef.current !== currentSearchId) return;

      steps++;
      setLinearState((s) => ({ 
        ...s, 
        currentIndex: i, 
        steps,
        log: `STEP ${steps}: CHECKING INDEX [${i}]. VALUE = ${array[i]}`
      }));
      await sleep(speedRef.current);

      if (array[i] === targetValue) {
        if (searchIdRef.current !== currentSearchId) return;
        setLinearState((s) => ({ 
          ...s, 
          foundIndex: i, 
          status: 'found',
          log: `SUCCESS: TARGET ${targetValue} MATCHES array[${i}]. EXITING.`
        }));
        return;
      } else {
        setLinearState((s) => ({ 
          ...s, 
          log: `FAILED: ${array[i]} != ${targetValue}. MOVING TO NEXT INDEX.`
        }));
        await sleep(speedRef.current / 2);
      }
    }

    if (searchIdRef.current === currentSearchId) {
      setLinearState((s) => ({ ...s, currentIndex: null, status: 'not_found', log: `END OF ARRAY. TARGET ${targetValue} NOT FOUND.` }));
    }
  };

  const runBinarySearch = async (targetValue, currentSearchId) => {
    setBinaryState((s) => ({ ...s, status: 'searching', steps: 0, left: 0, right: array.length - 1, log: 'INITIALIZING O(log n) BINARY SPLIT...' }));
    await sleep(speedRef.current / 2);
    let steps = 0;
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      if (searchIdRef.current !== currentSearchId) return;

      steps++;
      let mid = Math.floor((left + right) / 2);
      
      setBinaryState((s) => ({ 
        ...s, left, right, mid, steps,
        log: `STEP ${steps}: RANGE [${left}, ${right}]. CALCULATING MID = FLOOR((${left} + ${right}) / 2) = ${mid}`
      }));
      await sleep(speedRef.current);

      setBinaryState((s) => ({ ...s, log: `CHECKING MID INDEX [${mid}]. VALUE = ${array[mid]}` }));
      await sleep(speedRef.current);

      if (array[mid] === targetValue) {
        if (searchIdRef.current !== currentSearchId) return;
        setBinaryState((s) => ({ 
          ...s, foundIndex: mid, status: 'found',
          log: `SUCCESS: TARGET ${targetValue} MATCHES array[${mid}]. EXITING.`
        }));
        return;
      }

      if (array[mid] < targetValue) {
        setBinaryState((s) => ({ ...s, log: `${array[mid]} < ${targetValue}. TARGET MUST BE IN RIGHT HALF. SETTING LEFT = ${mid + 1}` }));
        left = mid + 1;
      } else {
        setBinaryState((s) => ({ ...s, log: `${array[mid]} > ${targetValue}. TARGET MUST BE IN LEFT HALF. SETTING RIGHT = ${mid - 1}` }));
        right = mid - 1;
      }
      
      await sleep(speedRef.current); 
    }

    if (searchIdRef.current === currentSearchId) {
      setBinaryState((s) => ({ ...s, left: null, right: null, mid: null, status: 'not_found', log: `RANGE INVALID (LEFT > RIGHT). TARGET ${targetValue} NOT FOUND.` }));
    }
  };

  const handleStartSearch = async () => {
    const numTarget = parseInt(target, 10);
    if (isNaN(numTarget)) return;

    setIsSearching(true);
    resetSearchStates();
    searchIdRef.current += 1;
    const currentSearchId = searchIdRef.current;

    await Promise.all([
      runLinearSearch(numTarget, currentSearchId),
      runBinarySearch(numTarget, currentSearchId)
    ]);

    if (searchIdRef.current === currentSearchId) {
      setIsSearching(false);
      setShowMetrics(true);
    }
  };

  // --- Futuristic 3D Rendering Helpers ---
  const getLinearBlockClasses = (index) => {
    const base = 'transition-all duration-300 transform-gpu flex items-center justify-center rounded-md font-bold border border-transparent flex-1 min-w-[1.5rem]';
    if (linearState.foundIndex === index) 
      return `${base} bg-green-900/80 border-green-400 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.6)] [transform:translateZ(30px)_scale(1.1)] z-20`;
    if (linearState.currentIndex === index) 
      return `${base} bg-cyan-900/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)] [transform:translateZ(20px)_scale(1.05)] z-10`;
    return `${base} bg-gray-900/50 border-gray-700 text-gray-500 shadow-inner [transform:translateZ(0px)] z-0`;
  };

  const getBinaryBlockClasses = (index) => {
    const { left, right, mid, foundIndex, status } = binaryState;
    const base = 'transition-all duration-500 transform-gpu flex items-center justify-center rounded-md font-bold border border-transparent w-full aspect-square';
    
    if (foundIndex === index) 
      return `${base} bg-green-900/80 border-green-400 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.6)] [transform:translateZ(30px)_scale(1.1)] z-20`;
    
    const isOutOfBounds = (left !== null && index < left) || (right !== null && index > right);
    if (isOutOfBounds && status === 'searching') 
      return `${base} bg-gray-950/40 border-gray-800 text-gray-700 opacity-20 [transform:translateZ(-40px)_rotateX(60deg)_scale(0.85)] z-0`;
    
    if (mid === index) 
      return `${base} bg-fuchsia-900/80 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_15px_rgba(232,121,249,0.6)] [transform:translateZ(20px)_scale(1.05)] z-10`;
    
    return `${base} bg-gray-900/50 border-gray-700 text-gray-400 shadow-inner [transform:translateZ(0px)] z-0`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-950 text-gray-200 font-mono flex flex-col relative selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)',
             backgroundSize: '30px 30px',
             transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)'
           }}>
      </div>

      {/* Top Header & Educational Controls Area */}
      <div className="z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 p-3 shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 text-cyan-400">
          <Terminal size={20} className="animate-pulse" />
          <h1 className="text-lg md:text-xl font-black tracking-widest uppercase">
            SYS.<span className="text-fuchsia-400">SEARCH</span>_VIS
          </h1>
        </div>

        {/* Educational Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 border border-gray-800 rounded">
            <Settings2 size={14} className="text-gray-400" />
            <label className="text-gray-400 tracking-widest">DATA_SIZE:</label>
            <input 
              type="range" min="7" max="31" step="2" value={arraySize} 
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isSearching}
              className="w-24 accent-cyan-500 cursor-pointer disabled:opacity-50"
            />
            <span className="text-cyan-300 w-4">{arraySize}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 border border-gray-800 rounded">
            <Settings2 size={14} className="text-gray-400" />
            <label className="text-gray-400 tracking-widest">THROTTLE:</label>
            <input 
              type="range" min="0.5" max="3" step="0.5" value={speedMultiplier} 
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              className="w-24 accent-fuchsia-500 cursor-pointer"
            />
            <span className="text-fuchsia-300 w-6">{speedMultiplier}x</span>
          </div>
        </div>

        {/* Execution Controls */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Crosshair className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
            <input 
              type="number" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isSearching}
              className="w-24 bg-gray-950/50 border border-gray-700 rounded pl-8 pr-2 py-1 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50 text-cyan-300 text-sm"
              placeholder="TARGET"
            />
          </div>
          
          <button 
            onClick={handleStartSearch}
            disabled={isSearching || target === ''}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/50 border border-cyan-700 text-cyan-400 rounded hover:bg-cyan-900/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <Play size={14} />
            <span className="text-xs font-bold tracking-wider">EXECUTE</span>
          </button>
          
          <button 
            onClick={handleResetArray}
            disabled={isSearching}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-800/50 border border-gray-700 text-gray-400 rounded hover:bg-gray-700/50 hover:text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <RotateCcw size={14} />
            <span className="text-xs tracking-wider">REBOOT</span>
          </button>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="z-10 flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        
        {/* Linear Search Section */}
        <div className="flex-1 bg-gray-900/40 backdrop-blur border border-gray-800/50 rounded-xl relative overflow-hidden flex flex-col shadow-lg shadow-black/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <div className="p-3 flex justify-between items-center shrink-0 border-b border-gray-800/50 bg-gray-900/30">
            <div>
              <h2 className="text-cyan-400 font-bold tracking-widest text-xs flex items-center gap-2">
                <Zap size={14} /> O(n) SEQUENTIAL SCAN
              </h2>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="text-[10px] text-gray-500 tracking-widest">CYCLES COMPLETED</div>
              <div className="text-xl font-black text-cyan-300 w-6 text-right font-mono">{linearState.steps}</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center p-4">
            <div className="flex gap-1 w-full justify-center max-w-5xl mx-auto" style={{ perspective: '800px' }}>
              {array.map((num, idx) => (
                <div key={`linear-${idx}`} className={`aspect-square text-xs sm:text-sm ${getLinearBlockClasses(idx)}`}>
                  {num}
                </div>
              ))}
            </div>
          </div>
          
          {/* Linear Logic Terminal */}
          <div className="shrink-0 bg-black/60 border-t border-gray-800 p-2 px-4 h-12 flex flex-col justify-center">
             <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Runtime Logic Log:</div>
             <div className="text-xs text-cyan-400 font-bold animate-pulse">{'>'} {linearState.log}</div>
          </div>
        </div>

        {/* Binary Search Section */}
        <div className="flex-1 bg-gray-900/40 backdrop-blur border border-gray-800/50 rounded-xl relative overflow-hidden flex flex-col shadow-lg shadow-black/50">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>
           
           <div className="p-3 flex justify-between items-center shrink-0 border-b border-gray-800/50 bg-gray-900/30">
            <div>
              <h2 className="text-fuchsia-400 font-bold tracking-widest text-xs flex items-center gap-2">
                <Zap size={14} /> O(log n) BINARY SPLIT
              </h2>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="text-[10px] text-gray-500 tracking-widest">CYCLES COMPLETED</div>
              <div className="text-xl font-black text-fuchsia-300 w-6 text-right font-mono">{binaryState.steps}</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center p-4">
             <div className="flex gap-1 w-full justify-center max-w-5xl mx-auto" style={{ perspective: '1000px' }}>
                {array.map((num, idx) => (
                  <div key={`binary-${idx}`} className="flex flex-col items-center flex-1 min-w-[1.5rem]">
                    <div className={`text-xs sm:text-sm ${getBinaryBlockClasses(idx)}`}>
                      {num}
                    </div>
                    {/* Dynamic Pointers Map */}
                    <div className="mt-1 h-3 text-[9px] sm:text-[10px] font-black tracking-widest transition-opacity duration-300 flex gap-0.5">
                      {binaryState.status === 'searching' && binaryState.left === idx && <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">L</span>}
                      {binaryState.status === 'searching' && binaryState.mid === idx && <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]">M</span>}
                      {binaryState.status === 'searching' && binaryState.right === idx && <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">R</span>}
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* Binary Logic Terminal */}
          <div className="shrink-0 bg-black/60 border-t border-gray-800 p-2 px-4 h-12 flex flex-col justify-center">
             <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Runtime Logic Log:</div>
             <div className="text-xs text-fuchsia-400 font-bold animate-pulse">{'>'} {binaryState.log}</div>
          </div>
        </div>
      </div>

      {/* Analytics Modal Overlay */}
      {showMetrics && (linearState.status !== 'idle' && binaryState.status !== 'idle') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-gray-950 border border-gray-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-2xl w-full p-6 relative flex flex-col max-h-[90vh]">
            <button onClick={() => setShowMetrics(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 text-white mb-6 shrink-0 border-b border-gray-800 pb-4">
              <BarChart3 className="text-fuchsia-400" size={28} />
              <h3 className="text-xl md:text-2xl font-black tracking-widest uppercase">Execution Analytics</h3>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto pr-2 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              {/* Core Metrics */}
              <div className="space-y-4 font-mono shrink-0">
                 <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                    <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Sequential O(n)</div>
                    <div className="text-xl text-white font-black">{linearState.steps} <span className="text-xs text-gray-500">CYCLES</span></div>
                 </div>
                 
                 <div className="bg-gray-900/50 p-4 rounded-lg border border-fuchsia-900/30 flex justify-between items-center">
                    <div className="text-fuchsia-400 text-sm font-bold tracking-widest uppercase">Binary O(log n)</div>
                    <div className="text-xl text-white font-black">{binaryState.steps} <span className="text-xs text-gray-500">CYCLES</span></div>
                 </div>

                 <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-lg text-center">
                    <div className="text-green-400 text-sm mb-1 uppercase tracking-widest">Efficiency Multiplier</div>
                    <div className="text-3xl font-black text-green-300">
                      {linearState.steps === 0 ? 'N/A' : (linearState.steps / Math.max(1, binaryState.steps)).toFixed(1)}x
                    </div>
                 </div>
              </div>

              {/* Educational Diagnostic Report */}
              <div className="space-y-4 text-sm leading-relaxed text-gray-300 border-t border-gray-800 pt-6">
                 <h4 className="text-white font-bold tracking-widest uppercase flex items-center gap-2">
                   <Terminal size={16} className="text-gray-500"/> System Diagnostic Report
                 </h4>
                 
                 <div className="space-y-4 pb-4">
                    <p>
                      <span className="text-cyan-400 font-bold tracking-wider">LINEAR SEARCH [O(n)]</span> operates via brute force. 
                      It inspected elements sequentially starting from index 0. While simple and guaranteed to work on any dataset (sorted or unsorted), 
                      its processing time scales linearly with the data size. If our array had 1,000,000 elements, it could theoretically take up to 1,000,000 cycles to find the target.
                    </p>

                    <p>
                      <span className="text-fuchsia-400 font-bold tracking-wider">BINARY SEARCH [O(log n)]</span> utilizes a "divide-and-conquer" algorithm. 
                      Because the dataset is pre-sorted, it calculates the precise midpoint first. By comparing the target to the midpoint, it instantly knows which half is entirely invalid. 
                      <span className="text-white font-semibold"> It successfully prunes 50% of the remaining search space every single cycle.</span>
                    </p>

                    <div className="bg-gray-900/80 p-4 rounded border-l-4 border-fuchsia-500">
                      <strong className="text-white block mb-2 tracking-widest uppercase text-xs">The Power of Logarithmic Scaling:</strong>
                      <p className="text-xs text-gray-400">
                        Notice how Binary Search completed in just <strong>{binaryState.steps} cycles</strong>. 
                        Even if we expanded this array to 4,000,000,000 items, Binary Search would only take a maximum of <strong>32 cycles</strong> to find the target. 
                        In modern software engineering, choosing O(log n) over O(n) is the difference between a query resolving instantly versus crashing a server.
                      </p>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}