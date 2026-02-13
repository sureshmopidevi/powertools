/**
 * Algorithm Visualizer - main.js
 * Vanilla JavaScript implementation of Search Algorithm Visualization
 */

// --- State ---
let state = {
    array: [],
    target: null,
    isSearching: false,
    arraySize: 15,
    speedMultiplier: 1,
    searchId: 0,
    linear: {
        currentIndex: null,
        foundIndex: null,
        steps: 0,
        log: 'READY'
    },
    binary: {
        left: null,
        right: null,
        mid: null,
        foundIndex: null,
        steps: 0,
        log: 'READY'
    }
};

// --- DOM Elements ---
const elements = {
    sizeRange: document.getElementById('sizeRange'),
    sizeValue: document.getElementById('sizeValue'),
    speedRange: document.getElementById('speedRange'),
    speedValue: document.getElementById('speedValue'),
    targetInput: document.getElementById('targetInput'),
    runBtn: document.getElementById('runBtn'),
    resetBtn: document.getElementById('resetBtn'),
    linearVisualizer: document.getElementById('linearVisualizer'),
    binaryVisualizer: document.getElementById('binaryVisualizer'),
    linearSteps: document.getElementById('linearSteps'),
    binarySteps: document.getElementById('binarySteps'),
    linearLog: document.getElementById('linearLog'),
    binaryLog: document.getElementById('binaryLog'),
    modalOverlay: document.getElementById('modalOverlay'),
    closeModal: document.getElementById('closeModal'),
    finalLinearSteps: document.getElementById('finalLinearSteps'),
    finalBinarySteps: document.getElementById('finalBinarySteps'),
    efficiencyValue: document.getElementById('efficiencyValue')
};

// --- Initialization ---
function init() {
    setupEventListeners();
    handleReset();
}

function setupEventListeners() {
    elements.sizeRange.addEventListener('input', (e) => {
        state.arraySize = parseInt(e.target.value);
        elements.sizeValue.textContent = state.arraySize;
        handleReset();
    });

    elements.speedRange.addEventListener('input', (e) => {
        state.speedMultiplier = parseFloat(e.target.value);
        elements.speedValue.textContent = state.speedMultiplier + 'x';
    });

    elements.runBtn.addEventListener('click', handleExecute);
    elements.resetBtn.addEventListener('click', handleReset);
    elements.closeModal.addEventListener('click', () => {
        elements.modalOverlay.classList.add('opacity-0', 'pointer-events-none');
        elements.modalOverlay.querySelector('div').classList.add('scale-95');
    });

    // Handle Enter key on target input
    elements.targetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleExecute();
    });
}

// --- Logic Functions ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms / state.speedMultiplier));

function generateSortedArray(size) {
    const arr = new Set();
    const maxVal = size * 5;
    while (arr.size < size) {
        arr.add(Math.floor(Math.random() * maxVal) + 10);
    }
    return Array.from(arr).sort((a, b) => a - b);
}

function handleReset() {
    state.searchId++;
    state.isSearching = false;
    state.array = generateSortedArray(state.arraySize);
    state.target = state.array[Math.floor(Math.random() * state.array.length)];
    elements.targetInput.value = state.target;

    resetSearchStates();
    renderArray();
    updateUI();
}

function resetSearchStates() {
    state.linear = { currentIndex: null, foundIndex: null, steps: 0, log: 'AWAITING EXECUTION...' };
    state.binary = { left: null, right: null, mid: null, foundIndex: null, steps: 0, log: 'AWAITING EXECUTION...' };
}

function renderArray() {
    // Render Linear
    elements.linearVisualizer.innerHTML = '';
    state.array.forEach((num, i) => {
        const block = document.createElement('div');
        block.id = `linear-block-${i}`;
        block.className = getBlockClasses('linear', i);
        block.textContent = num;
        elements.linearVisualizer.appendChild(block);
    });

    // Render Binary
    elements.binaryVisualizer.innerHTML = '';
    state.array.forEach((num, i) => {
        const container = document.createElement('div');
        // Removed flex-1 and min-w to let grid handle sizing
        container.className = 'flex flex-col items-center w-full';

        const block = document.createElement('div');
        block.id = `binary-block-${i}`;
        block.className = getBlockClasses('binary', i);
        block.textContent = num;

        const pointer = document.createElement('div');
        pointer.id = `binary-pointer-${i}`;
        pointer.className = 'mt-2 h-4 text-[10px] font-black tracking-widest flex gap-0.5 justify-center';

        container.appendChild(block);
        container.appendChild(pointer);
        elements.binaryVisualizer.appendChild(container);
    });
}

function getBlockClasses(type, index) {
    // Removed flex-1, min-w, added w-full to fill grid cell
    const base = 'visualizer-block flex items-center justify-center rounded-xl font-bold border w-full aspect-square text-xs md:text-sm shadow-sm';

    if (type === 'linear') {
        if (state.linear.foundIndex === index)
            return `${base} bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/40 z-10 scale-110`;
        if (state.linear.currentIndex === index)
            return `${base} bg-violet-500 border-violet-600 text-white shadow-lg shadow-violet-500/40 z-10 scale-110`;
        return `${base} bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500`;
    } else {
        if (state.binary.foundIndex === index)
            return `${base} bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/40 z-10 scale-110`;

        // Dim out-of-bounds
        if (state.isSearching && state.binary.left !== null) {
            if (index < state.binary.left || index > state.binary.right) {
                return `${base} bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 opacity-30 scale-90`;
            }
        }

        if (state.binary.mid === index)
            return `${base} bg-fuchsia-500 border-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/40 z-10 scale-110`;

        return `${base} bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500`;
    }
}

function updateUI() {
    elements.linearSteps.textContent = state.linear.steps;
    elements.binarySteps.textContent = state.binary.steps;
    elements.linearLog.textContent = state.linear.log;
    elements.binaryLog.textContent = state.binary.log;

    // Update individual blocks rather than full re-render for performance
    state.array.forEach((_, i) => {
        const lBlock = document.getElementById(`linear-block-${i}`);
        if (lBlock) lBlock.className = getBlockClasses('linear', i);

        const bBlock = document.getElementById(`binary-block-${i}`);
        const bPointer = document.getElementById(`binary-pointer-${i}`);
        if (bBlock) bBlock.className = getBlockClasses('binary', i);

        if (bPointer) {
            bPointer.innerHTML = '';
            if (state.isSearching) {
                if (state.binary.left === i) bPointer.innerHTML += '<span class="text-violet-500">L</span>';
                if (state.binary.mid === i) bPointer.innerHTML += '<span class="text-fuchsia-500">M</span>';
                if (state.binary.right === i) bPointer.innerHTML += '<span class="text-violet-500">R</span>';
            }
        }
    });

    elements.runBtn.disabled = state.isSearching;
    elements.sizeRange.disabled = state.isSearching;
    elements.targetInput.disabled = state.isSearching;
}

async function handleExecute() {
    const val = parseInt(elements.targetInput.value);
    if (isNaN(val)) return;

    state.target = val;
    state.isSearching = true;
    resetSearchStates();
    updateUI();

    const currentId = state.searchId;

    await Promise.all([
        runLinearSearch(val, currentId),
        runBinarySearch(val, currentId)
    ]);

    if (state.searchId === currentId) {
        state.isSearching = false;
        showAnalytics();
        updateUI();
    }
}

async function runLinearSearch(target, id) {
    state.linear.log = 'INITIALIZING SEQUENTIAL SCAN...';
    await sleep(400);

    for (let i = 0; i < state.array.length; i++) {
        if (state.searchId !== id) return;

        state.linear.steps++;
        state.linear.currentIndex = i;
        state.linear.log = `CHECKING INDEX ${i} (VALUE: ${state.array[i]})`;
        updateUI();
        await sleep(600);

        if (state.array[i] === target) {
            state.linear.foundIndex = i;
            state.linear.log = `SUCCESS: TARGET FOUND AT INDEX ${i}`;
            return;
        }

        state.linear.log = `MISMATCH: ${state.array[i]} != ${target}`;
        await sleep(200);
    }

    state.linear.currentIndex = null;
    state.linear.log = `NOT FOUND: TARGET ${target} NOT IN ARRAY`;
}

async function runBinarySearch(target, id) {
    state.binary.log = 'INITIALIZING BINARY SPLIT...';
    await sleep(400);

    let left = 0;
    let right = state.array.length - 1;

    while (left <= right) {
        if (state.searchId !== id) return;

        state.binary.steps++;
        state.binary.left = left;
        state.binary.right = right;
        let mid = Math.floor((left + right) / 2);
        state.binary.mid = mid;

        state.binary.log = `RANGE [${left}, ${right}] | MID POINT: ${mid}`;
        updateUI();
        await sleep(800);

        state.binary.log = `CHECKING VALUE AT INDEX ${mid}: ${state.array[mid]}`;
        updateUI();
        await sleep(600);

        if (state.array[mid] === target) {
            state.binary.foundIndex = mid;
            state.binary.log = `SUCCESS: TARGET FOUND AT INDEX ${mid}`;
            return;
        }

        if (state.array[mid] < target) {
            state.binary.log = `${state.array[mid]} < ${target} | SEARCHING RIGHT HALF`;
            left = mid + 1;
        } else {
            state.binary.log = `${state.array[mid]} > ${target} | SEARCHING LEFT HALF`;
            right = mid - 1;
        }

        updateUI();
        await sleep(600);
    }

    state.binary.mid = null;
    state.binary.log = `NOT FOUND: RANGE COLLAPSED`;
}

function showAnalytics() {
    elements.finalLinearSteps.textContent = state.linear.steps;
    elements.finalBinarySteps.textContent = state.binary.steps;

    const efficiency = state.binary.steps === 0 ? 0 : (state.linear.steps / state.binary.steps).toFixed(1);
    elements.efficiencyValue.textContent = efficiency + 'x';

    elements.modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        elements.modalOverlay.querySelector('div').classList.remove('scale-95');
    }, 10);
}

// Start app
init();
