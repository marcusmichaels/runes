const $ = (id) => document.getElementById(id);

// ---------- Section 1: Bit by bit ----------

const s1Grid = $("s1-grid");
const s1A = $("s1-a");
const s1B = $("s1-b");
const s1AVal = $("s1-a-val");
const s1BVal = $("s1-b-val");
const s1Formula = $("s1-formula");

function renderSection1() {
  const a = Number(s1A.value);
  const b = Number(s1B.value);
  const result = a | b;

  s1AVal.textContent = a;
  s1BVal.textContent = b;
  s1Grid.setRows([a, b, result]);
  s1Formula.textContent = `${a} | ${b} = ${result}`;
}

s1A.addEventListener("input", renderSection1);
s1B.addEventListener("input", renderSection1);
renderSection1();

// ---------- Section 2: Combining flags ----------

const FLAGS = { READ: 4, WRITE: 2, EXEC: 1 };

const s2Read = $("s2-read");
const s2Write = $("s2-write");
const s2Exec = $("s2-exec");
const s2Grid = $("s2-grid");
const s2Formula = $("s2-formula");

function renderSection2() {
  const r = s2Read.checked ? FLAGS.READ : 0;
  const w = s2Write.checked ? FLAGS.WRITE : 0;
  const e = s2Exec.checked ? FLAGS.EXEC : 0;
  const combined = r | w | e;

  s2Grid.setRows([r, w, e, combined]);

  const flagNames = [];
  if (s2Read.checked) flagNames.push("READ");
  if (s2Write.checked) flagNames.push("WRITE");
  if (s2Exec.checked) flagNames.push("EXEC");

  if (flagNames.length === 0) {
    s2Formula.textContent = "(none) = 0";
  } else {
    s2Formula.textContent = `${flagNames.join(" | ")} = ${combined}`;
  }
}

[s2Read, s2Write, s2Exec].forEach((cb) => {
  cb.addEventListener("change", renderSection2);
});

renderSection2();

// ---------- Section 3: Masks & hex notation ----------

const s3Val = $("s3-val");
const s3ValDisplay = $("s3-val-display");
const s3Grid = $("s3-grid");
const s3Formula = $("s3-formula");
const s3Note = $("s3-note");

const masks = [
  { id: "s3-m01", value: 0x01, label: "0x01" },
  { id: "s3-m02", value: 0x02, label: "0x02" },
  { id: "s3-m04", value: 0x04, label: "0x04" },
  { id: "s3-m08", value: 0x08, label: "0x08" },
  { id: "s3-m80", value: 0x80, label: "0x80" },
];

let currentMask = masks[0];

function renderSection3() {
  const val = Number(s3Val.value);
  const mask = currentMask.value;
  const result = val | mask;

  s3ValDisplay.textContent = val;
  s3Grid.setRows([val, mask, result]);
  s3Formula.textContent = `${val} | ${currentMask.label} = ${result}`;

  const added = result - val;
  if (added === 0) {
    s3Note.textContent = "That bit was already on \u2014 OR keeps it, nothing changes.";
  } else {
    s3Note.textContent = "OR never turns bits OFF \u2014 it only adds.";
  }
}

masks.forEach((m) => {
  const btn = $(m.id);
  btn.addEventListener("click", () => {
    currentMask = m;
    masks.forEach((mk) => $(mk.id).classList.remove("active"));
    btn.classList.add("active");
    renderSection3();
  });
});

s3Val.addEventListener("input", renderSection3);
$("s3-m01").classList.add("active");
renderSection3();

// ---------- Section 4: Defaults and fallbacks ----------

const s4Grid = $("s4-grid");
const s4Formula = $("s4-formula");
const s4Note = $("s4-note");

const presets = [
  { id: "s4-p1", user: 4, defaults: 7, label: "User has READ only" },
  { id: "s4-p2", user: 7, defaults: 7, label: "User has all" },
  { id: "s4-p3", user: 0, defaults: 7, label: "User has none" },
];

let currentPreset = presets[0];

function renderSection4() {
  const user = currentPreset.user;
  const defaults = currentPreset.defaults;
  const result = user | defaults;

  s4Grid.setRows([user, defaults, result]);
  s4Formula.textContent = `${user} | ${defaults} = ${result}`;

  if (user === result) {
    s4Note.textContent = "User already has every flag \u2014 defaults add nothing.";
  } else if (user === 0) {
    s4Note.textContent = "User had nothing \u2014 all defaults fill in.";
  } else {
    s4Note.textContent = "Bits the user already has stay set. Bits they\u2019re missing get filled in from defaults.";
  }
}

presets.forEach((p) => {
  const btn = $(p.id);
  btn.addEventListener("click", () => {
    currentPreset = p;
    presets.forEach((pr) => $(pr.id).classList.remove("active"));
    btn.classList.add("active");
    renderSection4();
  });
});

$("s4-p1").classList.add("active");
renderSection4();

// ---------- Section 5: It's just union ----------

const s5Grid = $("s5-grid");
const s5Formula = $("s5-formula");
const s5Note = $("s5-note");

function updateS5Display(values) {
  const sets = values.map((v) => {
    const m = [];
    for (let i = 0; i < 8; i++) if ((v >> i) & 1) m.push(i);
    return m;
  });
  s5Formula.textContent = `{${sets[0].join(",")}} \u222A {${sets[1].join(",")}} = {${sets[2].join(",")}}`;

  if (sets[2].length === 8) {
    s5Note.textContent = "Full coverage \u2014 every item is in at least one set.";
  } else if (sets[2].length === 0) {
    s5Note.textContent = "Both sets empty \u2014 nothing to combine.";
  } else {
    s5Note.textContent = `${sets[2].length} item${sets[2].length > 1 ? "s" : ""} combined \u2014 everything from either set.`;
  }
}

s5Grid.addEventListener("change", (e) => updateS5Display(e.detail.values));
updateS5Display(s5Grid.values);
