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

const pos = (v) => ((v - NL_MIN) / NL_RANGE) * 100;

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
  const diff = a - b;

  nlAVal.textContent = a;
  nlBVal.textContent = b;

  const p0 = pos(0);
  const pA = pos(a);
  const pDiff = pos(diff);

  // Vector a: zero → a (above axis). Vector b: a → a-b (below axis).
  // The second vector reverses direction relative to addition: instead of
  // extending further along a's direction, it pulls back.
  nlVectorA.style.left = `${Math.min(p0, pA)}%`;
  nlVectorA.style.width = `${Math.abs(pA - p0)}%`;
  nlVectorB.style.left = `${Math.min(pA, pDiff)}%`;
  nlVectorB.style.width = `${Math.abs(pDiff - pA)}%`;

  nlMarker.style.left = `${pDiff}%`;
  nlMarkerLabel.style.left = `${pDiff}%`;
  nlMarkerLabel.textContent = String(diff);

  nlFormula.textContent = `${a} − ${b} = ${diff}`;
}

nlA.addEventListener("input", renderNumberLine);
nlB.addEventListener("input", renderNumberLine);
renderNumberLine();

// ---------- 2. Always numeric ----------

const anPresets = $("an-presets");
const anFormula = $("an-formula");
const anNote = $("an-note");

const coerceExamples = [
  {
    label: "5 − 2",
    expression: "5 - 2",
    compute: () => 5 - 2,
    note: "Straight arithmetic. Both sides are numbers.",
  },
  {
    label: `"5" − 2`,
    expression: `"5" - 2`,
    compute: () => "5" - 2,
    note: `The string "5" is coerced to the number 5. Contrast with "5" + 2, which concatenates to "52".`,
  },
  {
    label: `5 − "2"`,
    expression: `5 - "2"`,
    compute: () => 5 - "2",
    note: "Same rule, other side. The string is coerced to a number.",
  },
  {
    label: `"a" − 2`,
    expression: `"a" - 2`,
    compute: () => "a" - 2,
    note: '"a" can\'t be coerced to a number, so the result is NaN — Not a Number.',
  },
  {
    label: "true − false",
    expression: "true - false",
    compute: () => true - false,
    note: "Booleans become numbers: true → 1, false → 0. So this is 1 − 0.",
  },
  {
    label: "null − 1",
    expression: "null - 1",
    compute: () => null - 1,
    note: "null coerces to 0 in numeric contexts. undefined, by contrast, would give NaN.",
  },
];

function formatValue(value) {
  if (typeof value === "string") return `"${value}"`;
  if (Number.isNaN(value)) return "NaN";
  return String(value);
}

function renderCoerce(example) {
  const result = formatValue(example.compute());
  anFormula.textContent = `${example.expression}   →   ${result}`;
  anNote.textContent = example.note;

  for (const btn of anPresets.querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.label === example.label);
  }
}

for (const example of coerceExamples) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = example.label;
  btn.dataset.label = example.label;
  btn.addEventListener("click", () => renderCoerce(example));
  anPresets.appendChild(btn);
}

renderCoerce(coerceExamples[0]);
