const $ = (id) => document.getElementById(id);

// ---------- 1. Number line ----------

const nlA = $("nl-a");
const nlB = $("nl-b");
const nlAVal = $("nl-a-val");
const nlBVal = $("nl-b-val");
const nlViz = $("nl-viz");
const nlFormula = $("nl-formula");

const NL_MIN = -10;
const NL_MAX = 10;
const NL_RANGE = NL_MAX - NL_MIN;

// Value → percentage position along the number line.
const pos = (v) => ((v - NL_MIN) / NL_RANGE) * 100;

// Static scaffolding: axis, ticks, and the two vectors + marker.
(function buildNumberLine() {
  nlViz.innerHTML = `
    <div class="axis"></div>
    <div class="vector vector--a"></div>
    <div class="vector vector--b"></div>
    <div class="marker"></div>
    <div class="marker-label"></div>
  `;
  const ticks = [-10, -5, 0, 5, 10];
  for (const v of ticks) {
    const mark = document.createElement("div");
    mark.className = "tick";
    mark.style.left = `${pos(v)}%`;
    nlViz.appendChild(mark);

    const label = document.createElement("div");
    label.className = "tick-label";
    label.style.left = `${pos(v)}%`;
    label.textContent = String(v);
    nlViz.appendChild(label);
  }
})();

const nlVectorA = nlViz.querySelector(".vector--a");
const nlVectorB = nlViz.querySelector(".vector--b");
const nlMarker = nlViz.querySelector(".marker");
const nlMarkerLabel = nlViz.querySelector(".marker-label");

function renderNumberLine() {
  const a = Number(nlA.value);
  const b = Number(nlB.value);
  const sum = a + b;

  nlAVal.textContent = a;
  nlBVal.textContent = b;

  const p0 = pos(0);
  const pA = pos(a);
  const pSum = pos(sum);

  // Vector a: zero → a (above axis). Vector b: a → a+b (below axis).
  nlVectorA.style.left = `${Math.min(p0, pA)}%`;
  nlVectorA.style.width = `${Math.abs(pA - p0)}%`;
  nlVectorB.style.left = `${Math.min(pA, pSum)}%`;
  nlVectorB.style.width = `${Math.abs(pSum - pA)}%`;

  nlMarker.style.left = `${pSum}%`;
  nlMarkerLabel.style.left = `${pSum}%`;
  nlMarkerLabel.textContent = String(sum);

  nlFormula.textContent = `${a} + ${b} = ${sum}`;
}

nlA.addEventListener("input", renderNumberLine);
nlB.addEventListener("input", renderNumberLine);
renderNumberLine();

// ---------- 2. Type coercion presets ----------

const tcPresets = $("tc-presets");
const tcFormula = $("tc-formula");
const tcNote = $("tc-note");

// Each example renders a literal JS expression, its actual JS result, and a
// one-line explanation of what the rule was.
const coerceExamples = [
  {
    label: "1 + 2",
    expression: "1 + 2",
    compute: () => 1 + 2,
    note: "Both are numbers. Arithmetic addition.",
  },
  {
    label: `"1" + 2`,
    expression: `"1" + 2`,
    compute: () => "1" + 2,
    note: "Left is a string. The right gets coerced to a string, then joined.",
  },
  {
    label: `1 + "2"`,
    expression: `1 + "2"`,
    compute: () => 1 + "2",
    note: "Right is a string. The left gets coerced to a string, then joined.",
  },
  {
    label: `"a" + "b"`,
    expression: `"a" + "b"`,
    compute: () => "a" + "b",
    note: "Both are strings. Straight concatenation.",
  },
  {
    label: "true + 1",
    expression: "true + 1",
    compute: () => true + 1,
    note: "No string anywhere. true becomes the number 1, then it's arithmetic.",
  },
  {
    label: "[] + []",
    expression: "[] + []",
    compute: () => [] + [],
    note: "Arrays aren't numbers; both become strings (empty ones), concatenated into nothing.",
    display: '""',
  },
];

// Format a value as it would appear in JS source code.
function formatValue(value) {
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function renderCoerce(example) {
  const result = example.display ?? formatValue(example.compute());
  tcFormula.textContent = `${example.expression}   →   ${result}`;
  tcNote.textContent = example.note;

  for (const btn of tcPresets.querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.label === example.label);
  }
}

for (const example of coerceExamples) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = example.label;
  btn.dataset.label = example.label;
  btn.addEventListener("click", () => renderCoerce(example));
  tcPresets.appendChild(btn);
}

renderCoerce(coerceExamples[0]);
