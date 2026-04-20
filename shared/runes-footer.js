// <runes-footer> — shared footer used across the homepage and operator pages.
// Shadow DOM scopes the component's styles so it stays fully self-contained.
// Inherited `font-family` crosses the shadow boundary; colors are inlined here
// because the footer is brand-consistent and shouldn't drift with page theming.

class RunesFooter extends HTMLElement {
  connectedCallback() {
    const home = this.getAttribute("home") ?? "/runes/";
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        footer {
          margin-top: 4rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e6e1d7;
          color: #8a8578;
          text-align: center;
        }
        p {
          margin: 0;
        }
        .primary {
          font-size: 0.85rem;
        }
        .credit {
          font-size: 0.72rem;
          margin-top: 0.5rem;
          opacity: 0.75;
        }
        a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        a:hover {
          color: #2b2b2b;
        }
      </style>
      <footer>
        <p class="primary">
          <a href="${home}">Runes</a> is a visual field guide to JavaScript operators.
        </p>
        <p class="credit">
          Made by <a href="https://marcusmichaels.com">Marcus</a> and styled using <a href="https://modest-ui.com">modest-ui</a> with a themed :root.
        </p>
      </footer>
    `;
  }
}

customElements.define("runes-footer", RunesFooter);
