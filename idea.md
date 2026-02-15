<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sorting Algorithm Showdown</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background-color: #0f172a;
            color: #e2e8f0;
            overflow: hidden;
        }

        /* 3D Bar Effect */
        .bar-container {
            perspective: 1000px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            height: 100%;
            width: 100%;
            padding: 0 20px;
            gap: 2px;
        }

        .bar {
            position: relative;
            transform-style: preserve-3d;
            transition: height 0.1s ease;
            /* Base color - Blue/Purple gradient */
            background: linear-gradient(to top, #3b82f6, #6366f1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
            border-radius: 4px 4px 0 0;
            opacity: 0.9;
        }

        /* Side face for 3D effect */
        .bar::after {
            content: '';
            position: absolute;
            top: 0;
            right: -4px;
            width: 4px;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            transform: skewY(-45deg);
            transform-origin: left;
            border-radius: 0 2px 0 0;
        }

        /* Top face for 3D effect */
        .bar::before {
            content: '';
            position: absolute;
            top: -4px;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            transform: skewX(-45deg);
            transform-origin: bottom;
            border-radius: 2px 2px 0 0;
        }

        .bar.active {
            background: linear-gradient(to top, #ef4444, #f87171) !important; /* Red */
        }

        .bar.pivot {
            background: linear-gradient(to top, #eab308, #facc15) !important; /* Yellow */
        }

        .bar.sorted {
            background: linear-gradient(to top, #22c55e, #4ade80) !important; /* Green */
            box-shadow: 0 0 10px #22c55e;
        }

        /* Range Input Styling */
        input[type=range] {
            -webkit-appearance: none; 
            background: transparent; 
        }
        
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #6366f1;
            margin-top: -6px; 
            cursor: pointer;
        }

        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #334155;
            border-radius: 2px;
        }

        /* Modal Animation */
        .modal-enter {
            opacity: 0;
            transform: scale(0.9);
        }
        .modal-enter-active {
            opacity: 1;
            transform: scale(1);
            transition: opacity 300ms, transform 300ms;
        }
        .modal-exit {
            opacity: 1;
        }
        .modal-exit-active {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 300ms, transform 300ms;
        }
    </style>
</head>
<body class="h-screen flex flex-col">

    <!-- Header -->
    <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">S</div>
            <h1 class="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">SortVisualizer</h1>
        </div>

        <div class="flex items-center gap-6">
            <div class="flex flex-col">
                <label class="text-xs text-slate-400 font-semibold mb-1">Speed</label>
                <input type="range" id="speedInput" min="1" max="100" value="60" class="w-32">
            </div>
            <div class="flex flex-col">
                <label class="text-xs text-slate-400 font-semibold mb-1">Array Size</label>
                <input type="range" id="sizeInput" min="10" max="100" value="50" class="w-32">
            </div>
        </div>

        <div class="flex items-center gap-2">
            <button onclick="resetArray()" class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Generate New</button>
            <button id="startBtn" onclick="startSort()" class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">Start Sorting</button>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden relative">
        
        <!-- Sidebar Controls -->
        <aside class="w-64 border-r border-slate-800 bg-slate-900 p-6 flex flex-col gap-6 z-10">
            <div>
                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Algorithms</h3>
                <div class="space-y-2">
                    <button onclick="selectAlgo('quick')" class="algo-btn w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all bg-indigo-600/20 text-indigo-300 border border-indigo-500/50" data-algo="quick">
                        <div class="flex justify-between items-center">
                            <span>Quick Sort</span>
                            <span class="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded">O(n log n)</span>
                        </div>
                    </button>
                    <button onclick="selectAlgo('merge')" class="algo-btn w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 text-slate-400 border border-transparent" data-algo="merge">
                        <div class="flex justify-between items-center">
                            <span>Merge Sort</span>
                            <span class="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded">O(n log n)</span>
                        </div>
                    </button>
                    <button onclick="selectAlgo('bubble')" class="algo-btn w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 text-slate-400 border border-transparent" data-algo="bubble">
                        <div class="flex justify-between items-center">
                            <span>Bubble Sort</span>
                            <span class="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded">O(n²)</span>
                        </div>
                    </button>
                </div>
            </div>

            <div>
                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Modes</h3>
                <button onclick="toggleRaceMode()" id="raceBtn" class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all bg-slate-800 hover:bg-rose-900/20 border border-slate-700 hover:border-rose-500/50 text-slate-300 group">
                    <div class="flex items-center gap-2">
                        <span class="text-lg group-hover:scale-110 transition-transform">🏎️</span>
                        <div>
                            <span class="block text-white group-hover:text-rose-400">Race Mode</span>
                            <span class="text-xs text-slate-500">Efficient vs Traditional</span>
                        </div>
                    </div>
                </button>
            </div>

            <div class="mt-auto">
                <div class="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
                    <p class="mb-2"><span class="w-2 h-2 inline-block rounded-full bg-indigo-500 mr-2"></span>Default</p>
                    <p class="mb-2"><span class="w-2 h-2 inline-block rounded-full bg-red-500 mr-2"></span>Comparing</p>
                    <p class="mb-2"><span class="w-2 h-2 inline-block rounded-full bg-yellow-400 mr-2"></span>Pivot / Aux</p>
                    <p><span class="w-2 h-2 inline-block rounded-full bg-green-500 mr-2"></span>Sorted</p>
                </div>
            </div>
        </aside>

        <!-- Visualization Area -->
        <div id="visualizer-container" class="flex-1 bg-slate-950 relative flex flex-col">
            
            <!-- Comparison View (Hidden by default) -->
            <div id="race-view" class="hidden flex-col h-full w-full">
                <div class="flex-1 border-b border-slate-800 relative flex flex-col">
                    <div class="absolute top-4 left-4 z-10 bg-indigo-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Quick Sort (O(n log n))</div>
                    <div id="bars-container-1" class="bar-container pt-12 pb-2"></div>
                </div>
                <div class="flex-1 relative flex flex-col">
                    <div class="absolute top-4 left-4 z-10 bg-rose-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Bubble Sort (O(n²))</div>
                    <div id="bars-container-2" class="bar-container pt-12 pb-2"></div>
                </div>
            </div>

            <!-- Single View -->
            <div id="single-view" class="h-full w-full flex flex-col">
                <div class="flex justify-center mt-4 mb-2">
                    <span id="current-algo-label" class="text-2xl font-black text-slate-700 uppercase tracking-widest opacity-50 select-none">Quick Sort</span>
                </div>
                <div id="bars-container-main" class="bar-container pb-10 px-10"></div>
            </div>

        </div>

    </main>

    <!-- Analysis Modal -->
    <div id="analysis-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
        <div class="bg-slate-900 border border-slate-700 w-full max-w-2xl p-8 rounded-2xl shadow-2xl transform scale-95 transition-transform duration-300" id="modal-content">
            <div class="flex items-start justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-white mb-1">Performance Analysis</h2>
                    <p class="text-indigo-400 text-sm font-medium">Why the winner won</p>
                </div>
                <button onclick="closeModal()" class="text-slate-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-8">
                <div class="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 class="font-bold text-rose-400 mb-2 flex items-center gap-2">
                        <span>Traditional (Bubble)</span>
                        <span class="text-xs bg-rose-900/30 px-2 py-0.5 rounded border border-rose-800 text-rose-300">O(n²)</span>
                    </h3>
                    <p class="text-slate-300 text-sm leading-relaxed">
                        Like checking every person in a line against the person behind them, over and over.
                        <br><br>
                        <span class="text-slate-500">For 100 items: ~10,000 operations.</span>
                    </p>
                </div>
                <div class="p-5 rounded-xl bg-indigo-900/20 border border-indigo-500/30">
                    <h3 class="font-bold text-indigo-400 mb-2 flex items-center gap-2">
                        <span>Efficient (Quick/Merge)</span>
                        <span class="text-xs bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-800 text-indigo-300">O(n log n)</span>
                    </h3>
                    <p class="text-slate-300 text-sm leading-relaxed">
                        Uses <strong>Divide & Conquer</strong>. Breaks the line into smaller groups, sorts them instantly, and recombines.
                        <br><br>
                        <span class="text-slate-500">For 100 items: ~660 operations.</span>
                    </p>
                </div>
            </div>

            <div class="bg-green-900/10 border border-green-900/30 rounded-lg p-4 flex gap-4 items-center">
                <div class="bg-green-500/20 p-2 rounded-full text-green-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                    <h4 class="font-bold text-green-400 text-sm">The Efficiency Gap</h4>
                    <p class="text-slate-400 text-xs mt-1">
                        As data grows, the gap widens exponentially. For 1 million items, Quick Sort might take <span class="text-white">seconds</span> while Bubble Sort could take <span class="text-white">days</span>.
                    </p>
                </div>
            </div>

            <div class="mt-8 flex justify-end">
                <button onclick="closeModal()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all">Understood</button>
            </div>
        </div>
    </div>

    <script>
        // --- Configuration & State ---
        let array = [];
        let arrayCopy = []; // For race mode
        let delay = 30;
        let isSorting = false;
        let currentAlgo = 'quick';
        let isRaceMode = false;
        let abortController = null; // To stop running sorts

        // Elements
        const barsContainerMain = document.getElementById('bars-container-main');
        const barsContainer1 = document.getElementById('bars-container-1');
        const barsContainer2 = document.getElementById('bars-container-2');
        const speedInput = document.getElementById('speedInput');
        const sizeInput = document.getElementById('sizeInput');
        const singleView = document.getElementById('single-view');
        const raceView = document.getElementById('race-view');
        const algoLabel = document.getElementById('current-algo-label');

        // --- Initialization ---
        function init() {
            resetArray();
            setupEventListeners();
        }

        function setupEventListeners() {
            speedInput.addEventListener('input', (e) => {
                // Invert logic: Higher value = lower delay (faster)
                // Range 1-100. 
                // 100 -> 1ms
                // 1 -> 500ms
                const val = parseInt(e.target.value);
                delay = Math.floor(5000 / (val * val + 1)); // Non-linear curve for better control
            });

            sizeInput.addEventListener('input', () => {
                resetArray();
            });
        }

        // --- Core Visual Logic ---

        function generateArray(size) {
            const arr = [];
            for (let i = 0; i < size; i++) {
                // Generate random height between 5 and 100
                arr.push(Math.floor(Math.random() * 95) + 5);
            }
            return arr;
        }

        function drawBars(container, arr, colorStates = {}) {
            container.innerHTML = '';
            const width = 100 / arr.length;
            
            arr.forEach((height, i) => {
                const bar = document.createElement('div');
                bar.classList.add('bar');
                bar.style.height = `${height}%`;
                bar.style.width = `${width}%`; // Leave small gap handled by container gap
                
                // Max width clamp for aesthetics on small arrays
                bar.style.maxWidth = '40px';

                if (colorStates[i]) {
                    bar.classList.add(colorStates[i]);
                }

                container.appendChild(bar);
            });
        }

        async function updateBar(container, index, height, colorClass) {
            const bars = container.children;
            if (bars[index]) {
                bars[index].style.height = `${height}%`;
                bars[index].className = 'bar'; // reset
                if (colorClass) bars[index].classList.add(colorClass);
            }
        }

        async function highlightBars(container, indices, colorClass) {
            const bars = container.children;
            for (let i of indices) {
                if (bars[i]) {
                    bars[i].classList.add(colorClass);
                }
            }
        }

        async function clearHighlights(container, indices) {
            const bars = container.children;
            for (let i of indices) {
                if (bars[i]) {
                    bars[i].classList.remove('active', 'pivot', 'sorted');
                }
            }
        }

        function resetArray() {
            if (isSorting) return; // Prevent reset while sorting
            const size = parseInt(sizeInput.value);
            array = generateArray(size);
            arrayCopy = [...array];
            
            drawBars(barsContainerMain, array);
            drawBars(barsContainer1, array);
            drawBars(barsContainer2, arrayCopy);
            
            // Clean UI
            document.querySelectorAll('.bar').forEach(b => b.classList.remove('sorted', 'active', 'pivot'));
        }

        function selectAlgo(algo) {
            if (isSorting) return;
            currentAlgo = algo;
            
            // Update UI buttons
            document.querySelectorAll('.algo-btn').forEach(btn => {
                btn.classList.remove('bg-indigo-600/20', 'text-indigo-300', 'border-indigo-500/50');
                btn.classList.add('text-slate-400', 'border-transparent');
                
                if (btn.dataset.algo === algo) {
                    btn.classList.add('bg-indigo-600/20', 'text-indigo-300', 'border-indigo-500/50');
                    btn.classList.remove('text-slate-400', 'border-transparent');
                }
            });

            // If in race mode, switch back to single
            if (isRaceMode) toggleRaceMode();

            // Update label
            const names = { 'quick': 'Quick Sort', 'merge': 'Merge Sort', 'bubble': 'Bubble Sort' };
            algoLabel.innerText = names[algo];
        }

        function toggleRaceMode() {
            if (isSorting) return;
            isRaceMode = !isRaceMode;
            
            const raceBtn = document.getElementById('raceBtn');
            const singleView = document.getElementById('single-view');
            const raceView = document.getElementById('race-view');

            if (isRaceMode) {
                raceBtn.classList.add('bg-rose-900/20', 'border-rose-500/50');
                raceBtn.querySelector('span.block').classList.add('text-rose-400');
                singleView.classList.add('hidden');
                raceView.classList.remove('hidden');
                raceView.classList.add('flex');
            } else {
                raceBtn.classList.remove('bg-rose-900/20', 'border-rose-500/50');
                raceBtn.querySelector('span.block').classList.remove('text-rose-400');
                singleView.classList.remove('hidden');
                raceView.classList.remove('hidden'); // Fix flex toggle
                raceView.classList.add('hidden');
                raceView.classList.remove('flex');
            }
            resetArray();
        }

        // --- Helper for waiting ---
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // --- Sorting Algorithms ---

        // 1. Bubble Sort
        async function bubbleSort(arr, container, signal) {
            const n = arr.length;
            for (let i = 0; i < n - 1; i++) {
                if (signal.aborted) return;
                for (let j = 0; j < n - i - 1; j++) {
                    if (signal.aborted) return;
                    
                    // Highlight comparison
                    await highlightBars(container, [j, j + 1], 'active');
                    await sleep(delay);

                    if (arr[j] > arr[j + 1]) {
                        // Swap data
                        let temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        
                        // Swap visuals
                        updateBar(container, j, arr[j], 'active');
                        updateBar(container, j + 1, arr[j + 1], 'active');
                        await sleep(delay);
                    }
                    
                    await clearHighlights(container, [j, j + 1]);
                }
                // Mark as sorted
                updateBar(container, n - i - 1, arr[n - i - 1], 'sorted');
            }
            updateBar(container, 0, arr[0], 'sorted'); // Last one
        }

        // 2. Quick Sort
        async function quickSort(arr, container, signal, start = 0, end = arr.length - 1) {
            if (start >= end || signal.aborted) {
                if(start === end) updateBar(container, start, arr[start], 'sorted');
                return;
            }

            let index = await partition(arr, container, signal, start, end);
            
            // Parallel execution is tricky visually, sequential is better for comprehension
            await Promise.all([
                quickSort(arr, container, signal, start, index - 1),
                quickSort(arr, container, signal, index + 1, end)
            ]);
            
            // After returning, range is sorted
            for(let i=start; i<=end; i++) {
                 updateBar(container, i, arr[i], 'sorted');
            }
        }

        async function partition(arr, container, signal, start, end) {
            if (signal.aborted) return;
            let pivotIndex = start;
            let pivotValue = arr[end];
            
            // Visualize Pivot
            updateBar(container, end, arr[end], 'pivot');
            
            for (let i = start; i < end; i++) {
                if (signal.aborted) return;
                
                highlightBars(container, [i], 'active');
                await sleep(delay);

                if (arr[i] < pivotValue) {
                    // Swap
                    [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
                    updateBar(container, i, arr[i]);
                    updateBar(container, pivotIndex, arr[pivotIndex], 'active');
                    pivotIndex++;
                }
                
                clearHighlights(container, [i]);
            }
            
            // Swap pivot to correct place
            [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
            updateBar(container, pivotIndex, arr[pivotIndex], 'sorted'); // Pivot is now sorted
            updateBar(container, end, arr[end]);
            
            return pivotIndex;
        }

        // 3. Merge Sort
        async function mergeSort(arr, container, signal, start = 0, end = arr.length - 1) {
            if (start >= end || signal.aborted) return;

            const mid = Math.floor((start + end) / 2);

            await mergeSort(arr, container, signal, start, mid);
            await mergeSort(arr, container, signal, mid + 1, end);

            await merge(arr, container, signal, start, mid, end);
        }

        async function merge(arr, container, signal, start, mid, end) {
            if (signal.aborted) return;
            
            // Create a copy for easy merging logic
            let left = arr.slice(start, mid + 1);
            let right = arr.slice(mid + 1, end + 1);
            
            let i = 0, j = 0, k = start;
            
            // Highlight the range being merged
            for(let x = start; x <= end; x++) {
                updateBar(container, x, arr[x], 'pivot');
            }
            await sleep(delay);

            while (i < left.length && j < right.length) {
                if (signal.aborted) return;
                
                // Visual comparison (not strictly accurate to algorithm steps but good for visuals)
                await sleep(delay);
                
                if (left[i] <= right[j]) {
                    arr[k] = left[i];
                    updateBar(container, k, arr[k], 'active');
                    i++;
                } else {
                    arr[k] = right[j];
                    updateBar(container, k, arr[k], 'active');
                    j++;
                }
                k++;
            }

            while (i < left.length) {
                if (signal.aborted) return;
                arr[k] = left[i];
                updateBar(container, k, arr[k], 'active');
                i++;
                k++;
                await sleep(delay);
            }

            while (j < right.length) {
                if (signal.aborted) return;
                arr[k] = right[j];
                updateBar(container, k, arr[k], 'active');
                j++;
                k++;
                await sleep(delay);
            }
            
            // Mark section as semi-sorted (green)
            for(let x = start; x <= end; x++) {
                 updateBar(container, x, arr[x], 'sorted');
            }
        }


        // --- Execution Control ---

        async function startSort() {
            if (isSorting) return;
            isSorting = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('startBtn').classList.add('opacity-50', 'cursor-not-allowed');
            
            // Controller for cancelling
            abortController = new AbortController();
            const signal = abortController.signal;

            try {
                if (isRaceMode) {
                    // RACE MODE: Quick vs Bubble
                    // We run them in parallel
                    // Note: JS is single threaded, but await sleep() yields control allowing UI updates interleaved
                    
                    const p1 = quickSort(array, barsContainer1, signal);
                    const p2 = bubbleSort(arrayCopy, barsContainer2, signal);
                    
                    await Promise.all([p1, p2]);
                    if (!signal.aborted) showModal();

                } else {
                    // SINGLE MODE
                    if (currentAlgo === 'bubble') await bubbleSort(array, barsContainerMain, signal);
                    else if (currentAlgo === 'quick') await quickSort(array, barsContainerMain, signal);
                    else if (currentAlgo === 'merge') await mergeSort(array, barsContainerMain, signal);
                }
            } catch (e) {
                console.log("Sort aborted or failed", e);
            } finally {
                isSorting = false;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('startBtn').classList.remove('opacity-50', 'cursor-not-allowed');
                abortController = null;
            }
        }

        // --- Modal Logic ---
        function showModal() {
            const modal = document.getElementById('analysis-modal');
            modal.classList.remove('hidden');
            // Trigger reflow
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            modal.querySelector('#modal-content').classList.remove('scale-95');
            modal.querySelector('#modal-content').classList.add('scale-100');
        }

        function closeModal() {
            const modal = document.getElementById('analysis-modal');
            modal.classList.add('opacity-0');
            modal.querySelector('#modal-content').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        // Run Init
        init();

    </script>
</body>
</html>