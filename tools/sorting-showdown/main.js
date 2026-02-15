const state = {
    values: [],
    raceValuesA: [],
    raceValuesB: [],
    delay: 30,
    isSorting: false,
    raceMode: false
};

const els = {
    algorithmSelect: document.getElementById('algorithmSelect'),
    sizeInput: document.getElementById('sizeInput'),
    speedInput: document.getElementById('speedInput'),
    raceBtn: document.getElementById('raceBtn'),
    resetBtn: document.getElementById('resetBtn'),
    startBtn: document.getElementById('startBtn'),
    currentAlgoLabel: document.getElementById('currentAlgoLabel'),
    singleView: document.getElementById('singleView'),
    raceView: document.getElementById('raceView'),
    barsMain: document.getElementById('barsMain'),
    barsRaceA: document.getElementById('barsRaceA'),
    barsRaceB: document.getElementById('barsRaceB')
};

const algoNames = {
    quick: 'Quick Sort',
    merge: 'Merge Sort',
    bubble: 'Bubble Sort'
};

function generateArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

function renderBars(container, arr, states = {}) {
    container.innerHTML = '';
    arr.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value}%`;
        const stateClass = states[index];
        if (stateClass) {
            bar.classList.add(stateClass);
        }
        container.appendChild(bar);
    });
}

function updateBar(container, index, value, className) {
    const bar = container.children[index];
    if (!bar) return;

    bar.style.height = `${value}%`;
    bar.className = 'bar';
    if (className) {
        bar.classList.add(className);
    }
}

function mark(container, indices, className) {
    for (const index of indices) {
        const bar = container.children[index];
        if (!bar) continue;
        bar.classList.add(className);
    }
}

function clear(container, indices) {
    for (const index of indices) {
        const bar = container.children[index];
        if (!bar) continue;
        bar.classList.remove('active', 'pivot', 'sorted');
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function syncUi() {
    els.currentAlgoLabel.textContent = algoNames[els.algorithmSelect.value];
    if (state.raceMode) {
        els.singleView.classList.add('hidden');
        els.raceView.classList.remove('hidden');
        els.raceBtn.classList.add('bg-rose-50', 'text-rose-600', 'dark:bg-rose-500/20', 'dark:text-rose-300');
    } else {
        els.raceView.classList.add('hidden');
        els.singleView.classList.remove('hidden');
        els.raceBtn.classList.remove('bg-rose-50', 'text-rose-600', 'dark:bg-rose-500/20', 'dark:text-rose-300');
    }
}

function reset() {
    if (state.isSorting) return;
    const size = Number(els.sizeInput.value);
    state.values = generateArray(size);
    state.raceValuesA = [...state.values];
    state.raceValuesB = [...state.values];
    renderBars(els.barsMain, state.values);
    renderBars(els.barsRaceA, state.raceValuesA);
    renderBars(els.barsRaceB, state.raceValuesB);
}

async function bubbleSort(arr, container) {
    for (let i = 0; i < arr.length - 1; i += 1) {
        for (let j = 0; j < arr.length - i - 1; j += 1) {
            mark(container, [j, j + 1], 'active');
            await sleep(state.delay);

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                updateBar(container, j, arr[j], 'active');
                updateBar(container, j + 1, arr[j + 1], 'active');
                await sleep(state.delay);
            }

            clear(container, [j, j + 1]);
        }
        updateBar(container, arr.length - i - 1, arr[arr.length - i - 1], 'sorted');
    }
    updateBar(container, 0, arr[0], 'sorted');
}

async function partition(arr, container, start, end) {
    const pivot = arr[end];
    let pivotIndex = start;
    updateBar(container, end, arr[end], 'pivot');

    for (let i = start; i < end; i += 1) {
        mark(container, [i], 'active');
        await sleep(state.delay);
        if (arr[i] < pivot) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            updateBar(container, i, arr[i]);
            updateBar(container, pivotIndex, arr[pivotIndex], 'active');
            pivotIndex += 1;
        }
        clear(container, [i]);
    }

    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    updateBar(container, pivotIndex, arr[pivotIndex], 'sorted');
    updateBar(container, end, arr[end]);

    return pivotIndex;
}

async function quickSort(arr, container, start = 0, end = arr.length - 1) {
    if (start >= end) {
        if (start === end) {
            updateBar(container, start, arr[start], 'sorted');
        }
        return;
    }
    const pivotIndex = await partition(arr, container, start, end);
    await Promise.all([
        quickSort(arr, container, start, pivotIndex - 1),
        quickSort(arr, container, pivotIndex + 1, end)
    ]);
    for (let i = start; i <= end; i += 1) {
        updateBar(container, i, arr[i], 'sorted');
    }
}

async function merge(arr, container, start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;

    for (let x = start; x <= end; x += 1) {
        updateBar(container, x, arr[x], 'pivot');
    }
    await sleep(state.delay);

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k] = left[i];
            i += 1;
        } else {
            arr[k] = right[j];
            j += 1;
        }
        updateBar(container, k, arr[k], 'active');
        k += 1;
        await sleep(state.delay);
    }

    while (i < left.length) {
        arr[k] = left[i];
        updateBar(container, k, arr[k], 'active');
        i += 1;
        k += 1;
        await sleep(state.delay);
    }

    while (j < right.length) {
        arr[k] = right[j];
        updateBar(container, k, arr[k], 'active');
        j += 1;
        k += 1;
        await sleep(state.delay);
    }

    for (let x = start; x <= end; x += 1) {
        updateBar(container, x, arr[x], 'sorted');
    }
}

async function mergeSort(arr, container, start = 0, end = arr.length - 1) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, container, start, mid);
    await mergeSort(arr, container, mid + 1, end);
    await merge(arr, container, start, mid, end);
}

async function startSort() {
    if (state.isSorting) return;
    state.isSorting = true;
    els.startBtn.disabled = true;
    els.startBtn.classList.add('opacity-60', 'cursor-not-allowed');

    try {
        if (state.raceMode) {
            await Promise.all([
                quickSort(state.raceValuesA, els.barsRaceA),
                bubbleSort(state.raceValuesB, els.barsRaceB)
            ]);
            return;
        }

        const algo = els.algorithmSelect.value;
        if (algo === 'bubble') {
            await bubbleSort(state.values, els.barsMain);
        } else if (algo === 'merge') {
            await mergeSort(state.values, els.barsMain);
        } else {
            await quickSort(state.values, els.barsMain);
        }
    } finally {
        state.isSorting = false;
        els.startBtn.disabled = false;
        els.startBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
}

function bindEvents() {
    els.algorithmSelect.addEventListener('change', () => {
        syncUi();
        reset();
    });

    els.sizeInput.addEventListener('input', reset);

    els.speedInput.addEventListener('input', (event) => {
        const val = Number(event.target.value);
        state.delay = Math.floor(5000 / (val * val + 1));
    });

    els.raceBtn.addEventListener('click', () => {
        if (state.isSorting) return;
        state.raceMode = !state.raceMode;
        syncUi();
        reset();
    });

    els.resetBtn.addEventListener('click', reset);
    els.startBtn.addEventListener('click', startSort);
}

bindEvents();
syncUi();
reset();
