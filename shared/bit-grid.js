// <bit-grid> — reusable web component for 8-bit binary visualisations.
// Shadow DOM with fully encapsulated styles. Picks up page theme via
// CSS custom properties (--color-accent, --font-mono, etc.) which
// naturally inherit across the shadow boundary.
//
// Usage:
//   <bit-grid id="demo" labels="a, b, a & b" separator="last"></bit-grid>
//   grid.setRows([173, 214, 132]);
//
// Interactive mode (component manages state, emits 'change' events):
//   <bit-grid id="demo" labels="A, B, A & B" operation="and" interactive></bit-grid>

class BitGrid extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._values = [];
    this._labels = [];
    this._separator = null;
    this._interactive = false;
    this._operation = null;
    this._highlightMask = null;
    this._dimRows = [];
  }

  connectedCallback() {
    // Parse attributes
    const labelsAttr = this.getAttribute("labels");
    if (labelsAttr) this._labels = labelsAttr.split(",").map((s) => s.trim());
    this._separator = this.getAttribute("separator");
    this._interactive = this.hasAttribute("interactive");
    this._operation = this.getAttribute("operation");

    // Initial values for interactive mode
    if (this._interactive && this.hasAttribute("values")) {
      this._values = this.getAttribute("values").split(",").map(Number);
    } else if (this._interactive) {
      // Default starting state: two interesting bytes
      this._values = [0b10101011, 0b01101110];
    }

    // Compute initial result for interactive mode
    if (this._interactive && this._operation) {
      this._computeResult();
    }

    this._injectStyles();
    this._render();

    // Event delegation for interactive cells
    this._shadow.addEventListener("click", (e) => {
      const cell = e.target.closest(".bit-cell[data-row]");
      if (!cell) return;
      const row = Number(cell.getAttribute("data-row"));
      const bit = Number(cell.getAttribute("data-bit"));
      if (isNaN(row) || isNaN(bit)) return;
      if (!this._interactive) return;
      // Toggle the bit via XOR
      this._values[row] ^= 1 << bit;
      this._computeResult();
      this._render();
      this._emitChange();
    });
  }

  // --- Public API ---

  /** Set row values (controlled mode). Triggers re-render. */
  setRows(values, { highlightMask = null, dimRows = [] } = {}) {
    this._values = values;
    this._highlightMask = highlightMask;
    this._dimRows = dimRows;
    this._render();
  }

  /** Get current values (useful in interactive mode). */
  get values() {
    return [...this._values];
  }

  // --- Private ---

  _computeResult() {
    if (!this._operation || this._values.length < 2) return;
    const [a, b] = this._values;
    let result;
    switch (this._operation) {
      case "and":
        result = a & b;
        break;
      case "or":
        result = a | b;
        break;
      case "xor":
        result = a ^ b;
        break;
      default:
        return;
    }
    // Replace or append result row
    if (this._values.length > 2) {
      this._values[2] = result;
    } else {
      this._values.push(result);
    }
  }

  _emitChange() {
    const sets = this._values.map((v) => {
      const members = [];
      for (let i = 0; i < 8; i++) {
        if ((v >> i) & 1) members.push(i);
      }
      return members;
    });
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { values: [...this._values], sets },
        bubbles: true,
      }),
    );
  }

  _render() {
    const container = this._shadow.querySelector(".bit-grid");
    if (!container) return;
    container.innerHTML = "";

    // Position headers (8 columns, no spacer)
    const posRow = document.createElement("div");
    posRow.className = "bit-positions";
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

    // Determine which rows are interactive (input rows, not result)
    const interactiveRows = this._interactive ? [0, 1].filter((i) => i < this._values.length - 1) : [];

    // Render rows
    this._values.forEach((value, rowIdx) => {
      const isLast = rowIdx === this._values.length - 1;

      // Separator before last row
      if (isLast && this._separator === "last" && this._values.length > 1) {
        const sep = document.createElement("div");
        sep.className = "bit-separator";
        container.appendChild(sep);
      }

      // Label above the row
      const labelText = this._labels[rowIdx] || "";
      if (labelText) {
        const label = document.createElement("div");
        label.className = "bit-row-label";
        label.textContent = labelText;
        container.appendChild(label);
      }

      // Bit cells row
      const rowEl = document.createElement("div");
      rowEl.className = "bit-row";

      const isResultRow = isLast && this._values.length > 1;
      const isInteractive = interactiveRows.includes(rowIdx);
      const isDimmed = this._dimRows.includes(rowIdx);

      for (let i = 7; i >= 0; i--) {
        const bit = (value >> i) & 1;
        const cell = document.createElement("div");
        cell.className = "bit-cell";

        if (bit === 1) {
          cell.classList.add(isResultRow ? "result-on" : "on");
        }

        // Highlight mask dimming
        if (this._highlightMask !== null && isDimmed) {
          const maskBit = (this._highlightMask >> i) & 1;
          if (maskBit === 0) cell.style.opacity = "0.35";
        }

        // Interactive attributes
        if (isInteractive) {
          cell.setAttribute("data-row", rowIdx);
          cell.setAttribute("data-bit", i);
        }

        cell.textContent = bit;
        rowEl.appendChild(cell);
      }

      container.appendChild(rowEl);
    });
  }

  _injectStyles() {
    this._shadow.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 520px;
          width: 100%;
          margin: 1.5rem auto;
        }
        .bit-grid {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(3px, 1vw, 6px);
        }
        .bit-row {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: clamp(2px, 1vw, 6px);
          align-items: center;
        }
        .bit-row-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.55rem;
          color: var(--color-muted, #8a8578);
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0;
          margin-top: 0.1rem;
          margin-bottom: -4px;
          margin-left: -4px;
          padding-left: 2px;
        }
        .bit-cell {
          aspect-ratio: 1;
          width: 100%;
          border: 1px solid var(--color-hairline, #e6e1d7);
          border-radius: clamp(4px, 1.5vw, 8px);
          display: grid;
          place-items: center;
          font-family: var(--font-mono, monospace);
          font-size: clamp(0.7rem, 2.5vw, 1rem);
          font-variant-numeric: tabular-nums;
          background: #fff;
          color: var(--color-muted, #8a8578);
          transition:
            background 200ms ease,
            border-color 200ms ease,
            color 200ms ease,
            transform 200ms ease;
        }
        .bit-cell.on {
          background: var(--color-accent-soft, #e6ede9);
          border-color: var(--color-accent, #6b8e8a);
          color: var(--color-ink, #2b2b2b);
        }
        .bit-cell.result-on {
          background: var(--color-highlight, #f3e8d3);
          border-color: var(--color-highlight-border, #b8935a);
          color: var(--color-ink, #2b2b2b);
          transform: scale(1.05);
        }
        .bit-cell[data-row] {
          cursor: pointer;
        }
        .bit-cell[data-row]:hover {
          transform: scale(1.1);
          border-color: var(--color-accent, #6b8e8a);
        }
        .bit-separator {
          height: 1px;
          background: var(--color-hairline, #e6e1d7);
          margin: 2px 0;
        }
        .bit-positions {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: clamp(2px, 1vw, 6px);
        }
        .bit-pos-label {
          text-align: center;
          font-family: var(--font-mono, monospace);
          font-size: clamp(0.55rem, 1.8vw, 0.7rem);
          color: var(--color-muted, #8a8578);
          line-height: 1.3;
        }
        .bit-pos-label .bit-value {
          display: block;
          font-size: clamp(0.6rem, 2vw, 0.75rem);
          color: var(--color-ink, #2b2b2b);
          opacity: 0.7;
        }
        .bit-pos-label .bit-index {
          display: block;
          font-size: clamp(0.5rem, 1.5vw, 0.6rem);
          opacity: 0.5;
        }
        @media (max-width: 400px) {
          .bit-pos-label .bit-index {
            display: none;
          }
        }
      </style>
      <div class="bit-grid"></div>
    `;
  }
}

customElements.define("bit-grid", BitGrid);
