// ---------- Helpers ----------

const $ = (id) => document.getElementById(id);

/**
 * Render an 8-bit grid with labelled rows.
 * Each row: { label, value, className }
 *   - label: string shown to the left
 *   - value: integer (0–255) whose bits to display
 *   - className: 'on' | 'result-on' applied to lit (1) cells
 *   - maskDim (optional): if true, cells where highlightMask bit is 0 get dimmed
 */
function renderBitGrid(container, rows, { showPositions = true, highlightMask = null } = {}) {
  container.innerHTML = "";

  if (showPositions) {
    const posRow = document.createElement("div");
    posRow.className = "bit-positions";
    // Empty spacer for the label column
    const spacer = document.createElement("span");
    posRow.appendChild(spacer);
    for (let i = 7; i >= 0; i--) {
      const lbl = document.createElement("span");
      lbl.className = "bit-pos-label";
      const val = document.createElement("span");
      val.className = "bit-value";
      val.textContent = 1 << i;
      const idx = document.createElement("span");
      idx.className = "bit-index";
      idx.textContent = `bit ${i}`;
      lbl.appendChild(val);
      lbl.appendChild(idx);
      posRow.appendChild(lbl);
    }
    container.appendChild(posRow);
  }

  rows.forEach((row, rowIdx) => {
    if (rowIdx === rows.length - 1 && rows.length > 1) {
      const sep = document.createElement("div");
      sep.className = "bit-separator";
      container.appendChild(sep);
    }

    const rowEl = document.createElement("div");
    rowEl.className = "bit-row";

    const label = document.createElement("span");
    label.className = "bit-row-label";
    label.textContent = row.label;
    rowEl.appendChild(label);

    for (let i = 7; i >= 0; i--) {
      const bit = (row.value >> i) & 1;
      const cell = document.createElement("div");
      cell.className = "bit-cell";

      if (bit === 1) cell.classList.add(row.className);

      if (highlightMask !== null && row.maskDim) {
        const maskBit = (highlightMask >> i) & 1;
        if (maskBit === 0) cell.style.opacity = "0.35";
      }

      cell.textContent = bit;
      rowEl.appendChild(cell);
    }

    container.appendChild(rowEl);
  });
}

// ---------- Section 1: Bit by bit ----------

const s1A = $("s1-a");
const s1B = $("s1-b");
const s1AVal = $("s1-a-val");
const s1BVal = $("s1-b-val");
const s1Grid = $("s1-grid");
const s1Formula = $("s1-formula");

function renderSection1() {
  const a = Number(s1A.value);
  const b = Number(s1B.value);
  const result = a & b;

  s1AVal.textContent = a;
  s1BVal.textContent = b;

  renderBitGrid(s1Grid, [
    { label: "a", value: a, className: "on" },
    { label: "b", value: b, className: "on" },
    { label: "a & b", value: result, className: "result-on" },
  ]);

  s1Formula.textContent = `${a} & ${b} = ${result}`;
}

s1A.addEventListener("input", renderSection1);
s1B.addEventListener("input", renderSection1);
renderSection1();

// ---------- Section 2: Masking (colour extraction) ----------

const s2Color = $("s2-color");
const s2Hex = $("s2-hex");
const s2Grid = $("s2-grid");
const s2Formula = $("s2-formula");
const s2Note = $("s2-note");
const s2SwatchFull = $("s2-swatch-full");
const s2SwatchChannel = $("s2-swatch-channel");

const channels = [
  { id: "s2-ch-r", name: "Red", shift: 16, note: "Bits 23–16: the red byte." },
  { id: "s2-ch-g", name: "Green", shift: 8, note: "Bits 15–8: the green byte." },
  { id: "s2-ch-b", name: "Blue", shift: 0, note: "Bits 7–0: the blue byte." },
];

let currentChannel = channels[0];

function hexToInt(hex) {
  return parseInt(hex.replace("#", ""), 16);
}

function renderSection2() {
  const hex = s2Color.value;
  const rgb = hexToInt(hex);
  const channelValue = (rgb >> currentChannel.shift) & 0xff;

  s2Hex.textContent = hex.toUpperCase();
  s2SwatchFull.style.backgroundColor = hex;

  // Show the isolated channel as a colour
  if (currentChannel.shift === 16) {
    s2SwatchChannel.style.backgroundColor = `rgb(${channelValue}, 0, 0)`;
  } else if (currentChannel.shift === 8) {
    s2SwatchChannel.style.backgroundColor = `rgb(0, ${channelValue}, 0)`;
  } else {
    s2SwatchChannel.style.backgroundColor = `rgb(0, 0, ${channelValue})`;
  }

  // Show the byte being extracted with the bit grid (8-bit view of the shifted value)
  const shifted = (rgb >> currentChannel.shift) & 0xff;
  renderBitGrid(
    s2Grid,
    [
      { label: "shifted", value: shifted, className: "on", maskDim: true },
      { label: "0xFF", value: 0xff, className: "on", maskDim: false },
      { label: "result", value: channelValue, className: "result-on", maskDim: false },
    ],
    { highlightMask: 0xff },
  );

  const shiftStr =
    currentChannel.shift > 0
      ? `(0x${rgb.toString(16).toUpperCase()} >> ${currentChannel.shift}) & 0xFF`
      : `0x${rgb.toString(16).toUpperCase()} & 0xFF`;
  s2Formula.textContent = `${shiftStr} = ${channelValue}`;
  s2Note.textContent = currentChannel.note;
}

channels.forEach((ch) => {
  const btn = $(ch.id);
  btn.addEventListener("click", () => {
    currentChannel = ch;
    channels.forEach((c) => $(c.id).classList.remove("active"));
    btn.classList.add("active");
    renderSection2();
  });
});

s2Color.addEventListener("input", renderSection2);

$("s2-ch-r").classList.add("active");
renderSection2();

// ---------- Section 3: The modulo shortcut ----------

const s3N = $("s3-n");
const s3NVal = $("s3-n-val");
const s3Grid = $("s3-grid");
const s3Formula = $("s3-formula");
const s3Note = $("s3-note");

const divisors = [
  { id: "s3-d2", d: 2, note: "d = 2 → keeps 1 bit. This is the even/odd check: n & 1." },
  { id: "s3-d4", d: 4, note: "d = 4 → keeps 2 bits. Same as n % 4." },
  { id: "s3-d8", d: 8, note: "d = 8 → keeps 3 bits. Used in byte-aligned indexing." },
  { id: "s3-d16", d: 16, note: "d = 16 → keeps 4 bits (one nibble). Hash table bucket sizing." },
  { id: "s3-d256", d: 256, note: "d = 256 → keeps 8 bits. Clamps to a single byte." },
];

let currentDivisor = divisors[1]; // d = 4

function renderSection3() {
  const n = Number(s3N.value);
  const d = currentDivisor.d;
  const mask = d - 1;
  const resultAnd = n & mask;
  const resultMod = n % d;

  s3NVal.textContent = n;

  renderBitGrid(
    s3Grid,
    [
      { label: "n", value: n, className: "on", maskDim: true },
      { label: `d-1 (${mask})`, value: mask, className: "on", maskDim: false },
      { label: "n & (d-1)", value: resultAnd, className: "result-on", maskDim: false },
    ],
    { highlightMask: mask },
  );

  s3Formula.textContent = `${n} & ${mask} = ${resultAnd}   ≡   ${n} % ${d} = ${resultMod}`;
  s3Note.textContent = currentDivisor.note;
}

divisors.forEach((dv) => {
  const btn = $(dv.id);
  btn.addEventListener("click", () => {
    currentDivisor = dv;
    divisors.forEach((d) => $(d.id).classList.remove("active"));
    btn.classList.add("active");
    renderSection3();
  });
});

s3N.addEventListener("input", renderSection3);

$("s3-d4").classList.add("active");
renderSection3();

// ---------- Section 4: Checking flags ----------

const FLAGS = { READ: 4, WRITE: 2, EXEC: 1 };

const s4Read = $("s4-read");
const s4Write = $("s4-write");
const s4Exec = $("s4-exec");
const s4Grid = $("s4-grid");
const s4Formula = $("s4-formula");

let currentCheck = "READ";

function getPerms() {
  let p = 0;
  if (s4Read.checked) p |= FLAGS.READ;
  if (s4Write.checked) p |= FLAGS.WRITE;
  if (s4Exec.checked) p |= FLAGS.EXEC;
  return p;
}

function renderSection4() {
  const perms = getPerms();
  const flag = FLAGS[currentCheck];
  const result = perms & flag;
  const truthy = result !== 0;

  renderBitGrid(
    s4Grid,
    [
      { label: "perms", value: perms, className: "on", maskDim: false },
      { label: currentCheck, value: flag, className: "on", maskDim: false },
      { label: "result", value: result, className: "result-on", maskDim: false },
    ],
    { highlightMask: flag },
  );

  const symbol = truthy ? "✓ truthy" : "✗ falsy";
  s4Formula.textContent = `${perms} & ${currentCheck} = ${result}  →  ${symbol}`;
}

[s4Read, s4Write, s4Exec].forEach((cb) => {
  cb.addEventListener("change", renderSection4);
});

const checkBtns = [
  { id: "s4-chk-read", flag: "READ" },
  { id: "s4-chk-write", flag: "WRITE" },
  { id: "s4-chk-exec", flag: "EXEC" },
];

checkBtns.forEach((item) => {
  const btn = $(item.id);
  btn.addEventListener("click", () => {
    currentCheck = item.flag;
    checkBtns.forEach((b) => $(b.id).classList.remove("active"));
    btn.classList.add("active");
    renderSection4();
  });
});

$("s4-chk-read").classList.add("active");
renderSection4();

// ---------- Section 5: It's just intersection ----------

const s5Grid = $("s5-grid");
const s5Formula = $("s5-formula");
const s5Note = $("s5-note");

// Read set state from button active classes
function getSetValue(prefix) {
  let val = 0;
  for (let i = 0; i < 8; i++) {
    const btn = $(`${prefix}${i}`);
    if (btn.classList.contains("active")) val |= 1 << i;
  }
  return val;
}

function renderSection5() {
  const a = getSetValue("s5-a");
  const b = getSetValue("s5-b");
  const result = a & b;

  // Collect set members for display
  const setA = [];
  const setB = [];
  const setR = [];
  for (let i = 0; i < 8; i++) {
    if ((a >> i) & 1) setA.push(i);
    if ((b >> i) & 1) setB.push(i);
    if ((result >> i) & 1) setR.push(i);
  }

  renderBitGrid(s5Grid, [
    { label: "A", value: a, className: "on" },
    { label: "B", value: b, className: "on" },
    { label: "A & B", value: result, className: "result-on" },
  ]);

  s5Formula.textContent = `{${setA.join(",")}} ∩ {${setB.join(",")}} = {${setR.join(",")}}`;
  s5Note.textContent = setR.length
    ? `${setR.length} item${setR.length > 1 ? "s" : ""} in common — exactly what & keeps.`
    : "No overlap — & gives 0.";
}

// Wire up toggle buttons for both sets
for (let i = 0; i < 8; i++) {
  ["s5-a", "s5-b"].forEach((prefix) => {
    const btn = $(`${prefix}${i}`);
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      renderSection5();
    });
  });
}

renderSection5();
