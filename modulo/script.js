// ---------- Shared helpers ----------

const $ = (id) => document.getElementById(id);

function createDotGroup(count, isRemainder) {
  const group = document.createElement("div");
  group.className = isRemainder ? "group group--remainder" : "group";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = isRemainder ? "dot dot--remainder" : "dot";
    group.appendChild(dot);
  }
  return group;
}

// Wires up a step / auto-play / reset trio around a counter that drives `render`.
// Returns `rerender()` so external controls (e.g. sliders) can trigger a redraw
// using the current counter value.
function createPlayer({
  stepBtn,
  playBtn,
  resetBtn,
  render,
  intervalMs = 600,
}) {
  let n = 0;
  let timer = null;

  const update = (next) => {
    n = next;
    render(n);
  };
  const tick = () => update(n + 1);
  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    playBtn.textContent = "Auto-play";
  };

  stepBtn.addEventListener("click", tick);
  resetBtn.addEventListener("click", () => {
    stop();
    update(0);
  });
  playBtn.addEventListener("click", () => {
    if (timer) return stop();
    timer = setInterval(tick, intervalMs);
    playBtn.textContent = "Pause";
  });

  render(n);
  return { rerender: () => render(n) };
}

// ---------- 1. Remainder ----------

const rA = $("r-a");
const rB = $("r-b");
const rAVal = $("r-a-val");
const rBVal = $("r-b-val");
const rDots = $("r-dots");
const rFormula = $("r-formula");

function renderRemainder() {
  const a = Number(rA.value);
  const b = Number(rB.value);
  const quotient = Math.floor(a / b);
  const remainder = a % b;

  rAVal.textContent = a;
  rBVal.textContent = b;

  rDots.innerHTML = "";
  for (let g = 0; g < quotient; g++) {
    rDots.appendChild(createDotGroup(b, false));
  }
  if (remainder > 0) {
    rDots.appendChild(createDotGroup(remainder, true));
  }

  rFormula.textContent =
    `${a} = ${quotient} × ${b} + ${remainder}   →   ` +
    `${a} % ${b} = ${remainder}`;
}

rA.addEventListener("input", renderRemainder);
rB.addEventListener("input", renderRemainder);
renderRemainder();

// ---------- 2. Cycle ----------

const cB = $("c-b");
const cBVal = $("c-b-val");
const cSlots = $("c-slots");
const cFormula = $("c-formula");

let cyclePrevPos = 0;

function renderCycle(n) {
  const b = Number(cB.value);
  const pos = n % b;
  const justWrapped = cyclePrevPos > pos && pos === 0;
  cyclePrevPos = pos;

  cBVal.textContent = b;
  cSlots.innerHTML = "";

  for (let i = 0; i < b; i++) {
    const slot = document.createElement("div");
    slot.className = "slot" + (i === pos ? " active" : "");
    if (justWrapped && i === 0) slot.classList.add("wrapped");
    slot.textContent = String(i);
    cSlots.appendChild(slot);
  }

  cFormula.textContent = `n = ${n}   →   n % ${b} = ${pos}`;
}

const cyclePlayer = createPlayer({
  stepBtn: $("c-step"),
  playBtn: $("c-play"),
  resetBtn: $("c-reset"),
  render: renderCycle,
});
cB.addEventListener("input", cyclePlayer.rerender);

// ---------- 3. Array cycling ----------

const aItemsEl = $("a-items");
const aFormula = $("a-formula");

const arr = [
  { label: "A", color: "#b86a52" },
  { label: "B", color: "#c99a3a" },
  { label: "C", color: "#6b8e8a" },
  { label: "D", color: "#607a97" },
  { label: "E", color: "#8a6a8a" },
];

function renderArray(i) {
  const pos = i % arr.length;

  aItemsEl.innerHTML = "";
  arr.forEach((entry, idx) => {
    const item = document.createElement("div");
    item.className = "array-item" + (idx === pos ? " active" : "");
    item.style.backgroundColor = entry.color;
    item.textContent = entry.label;
    aItemsEl.appendChild(item);
  });

  aFormula.textContent =
    `i = ${i}   →   arr[${i} % ${arr.length}] = ` +
    `arr[${pos}] = ${arr[pos].label}`;
}

createPlayer({
  stepBtn: $("a-step"),
  playBtn: $("a-play"),
  resetBtn: $("a-reset"),
  render: renderArray,
  intervalMs: 700,
});
