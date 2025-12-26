class d extends HTMLElement {
  constructor() {
    super(), this.config = {
      title: "Confirmation Dialog",
      body: "",
      modal: !0,
      escToClose: !0,
      clickToClose: !0
    }, this.eventsBound = !1, this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render(), this.setupKeyboardListeners();
  }
  disconnectedCallback() {
    this.removeKeyboardListeners(), this.backdrop && this.backdrop.remove();
  }
  /**
   * Shows the dialog with the given configuration
   */
  show(e) {
    this.config = { ...this.config, ...e }, this.render(), this.setupKeyboardListeners(), this.config.modal && this.createBackdrop(), requestAnimationFrame(() => {
      const o = this.shadowRoot.querySelector(".dialog-container");
      o && o.classList.add("show"), this.backdrop && (this.backdrop.style.opacity = "1");
    });
  }
  /**
   * Closes the dialog
   */
  close() {
    const e = this.shadowRoot.querySelector(".dialog-container");
    e && e.classList.add("closing"), this.backdrop && (this.backdrop.style.opacity = "0"), setTimeout(() => {
      this.removeKeyboardListeners(), this.backdrop && (this.backdrop.remove(), this.backdrop = void 0), this.dispatchEvent(new CustomEvent("close")), this.config.onClose && this.config.onClose(), this.remove();
    }, 300);
  }
  /**
   * Creates the modal backdrop
   */
  createBackdrop() {
    this.backdrop || (this.backdrop = document.createElement("div"), this.backdrop.className = "confirmation-dialog-backdrop", this.backdrop.style.position = "fixed", this.backdrop.style.top = "0", this.backdrop.style.left = "0", this.backdrop.style.width = "100%", this.backdrop.style.height = "100%", this.backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.6)", this.backdrop.style.backdropFilter = "blur(4px)", this.backdrop.style.webkitBackdropFilter = "blur(4px)", this.backdrop.style.zIndex = "99998", this.backdrop.style.opacity = "0", this.backdrop.style.transition = "opacity 0.3s ease", this.config.clickToClose && this.backdrop.addEventListener("click", () => {
      this.close();
    }), document.body.appendChild(this.backdrop));
  }
  /**
   * Sets up keyboard event listeners
   */
  setupKeyboardListeners() {
    this.config.escToClose && (this.escKeyHandler = (e) => {
      e.key === "Escape" && this.close();
    }, document.addEventListener("keydown", this.escKeyHandler));
  }
  /**
   * Removes keyboard event listeners
   */
  removeKeyboardListeners() {
    this.escKeyHandler && (document.removeEventListener("keydown", this.escKeyHandler), this.escKeyHandler = void 0);
  }
  /**
   * Binds all event listeners
   */
  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = !0, this.shadowRoot.addEventListener("click", (o) => {
      const i = o.target;
      if (i.closest(".close-button"))
        this.close();
      else if (i.closest(".dialog-button")) {
        const r = i.closest(".dialog-button").dataset.index;
        if (r !== void 0) {
          const a = this.config.buttons?.[parseInt(r, 10)];
          a && a.onClick && a.onClick();
        }
      }
    });
    const e = this.shadowRoot.querySelector(".dialog-container");
    e && e.addEventListener("wheel", (o) => {
      o.stopPropagation();
    }, { passive: !0 });
  }
  /**
   * Renders the component
   */
  render() {
    const e = this.config.title || "Confirmation Dialog", o = this.config.buttons || [], i = o.length > 1 ? o[0] : null, r = o.length === 1 ? o : o.slice(1);
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--font-size, 14px);
        }

        .dialog-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          min-width: 400px;
          max-width: 600px;
          max-height: 80vh;
          background: var(--dialog-background, white);
          border-radius: var(--dialog-border-radius, 8px);
          box-shadow: var(--dialog-shadow, 0 10px 40px rgba(0, 0, 0, 0.2));
          z-index: 99999;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dialog-container.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .dialog-container.closing {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }

        .dialog-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--dialog-border-color, #e0e0e0);
          flex-shrink: 0;
        }

        .dialog-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--dialog-title-color, #333);
        }

        .dialog-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          color: var(--dialog-text-color, #555);
          line-height: 1.6;
        }

        .dialog-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--dialog-border-color, #e0e0e0);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          background: var(--dialog-background, white);
        }

        .footer-left {
          display: flex;
          gap: 12px;
        }

        .footer-right {
          display: flex;
          gap: 12px;
          margin-left: auto;
        }

        .dialog-button {
          padding: 8px 20px;
          border: 1px solid var(--dialog-button-border-color, #ccc);
          border-radius: var(--dialog-button-border-radius, 4px);
          background: var(--dialog-button-background, white);
          color: var(--dialog-button-color, #333);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-weight: 500;
        }

        .dialog-button:hover {
          background-color: var(--dialog-button-hover-background, #f8f9fa);
          border-color: var(--dialog-button-hover-border-color, #999);
        }

        .dialog-button:active {
          background-color: var(--dialog-button-active-background, #e9ecef);
        }

        .close-button {
          padding: 8px 20px;
          border: 1px solid var(--dialog-close-border-color, #ccc);
          border-radius: var(--dialog-button-border-radius, 4px);
          background: var(--dialog-close-background, white);
          color: var(--dialog-close-color, #333);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-weight: 500;
        }

        .close-button:hover {
          background-color: var(--dialog-close-hover-background, #f8f9fa);
          border-color: var(--dialog-close-hover-border-color, #999);
        }

        @media (max-width: 768px) {
          .dialog-container {
            min-width: 90vw;
            max-width: 90vw;
          }
        }
      </style>

      <div class="dialog-container">
        <div class="dialog-header">
          <h2 class="dialog-title">${e}</h2>
        </div>

        <div class="dialog-body">
          ${this.config.body}
        </div>

        <div class="dialog-footer">
          ${i ? `
            <div class="footer-left">
              <button
                class="dialog-button"
                data-index="0"
                style="${i.backgroundColor ? `background-color: ${i.backgroundColor}; color: white; border-color: ${i.backgroundColor};` : ""}"
              >
                ${i.label}
              </button>
            </div>
          ` : ""}

          <div class="footer-right">
            ${r.map((a, s) => `
              <button
                class="dialog-button"
                data-index="${i ? s + 1 : s}"
                style="${a.backgroundColor ? `background-color: ${a.backgroundColor}; color: white; border-color: ${a.backgroundColor};` : ""}"
              >
                ${a.label}
              </button>
            `).join("")}
            ${o.length === 0 ? '<button class="close-button">Close</button>' : ""}
          </div>
        </div>
      </div>
    `, this.bindEvents();
  }
}
const l = (t = "liwe3-confirmation-dialog") => {
  typeof window < "u" && !window.customElements.get(t) && customElements.define(t, d);
};
l();
const n = "liwe3-confirmation-dialog-container", c = () => {
  let t = document.getElementById(n);
  return t || (t = document.createElement("div"), t.id = n, t.style.position = "fixed", t.style.zIndex = "99999", t.style.pointerEvents = "none", document.body.appendChild(t)), t;
}, b = (t) => {
  const e = c(), o = document.createElement("liwe3-confirmation-dialog");
  return o.style.pointerEvents = "auto", o.show(t), e.appendChild(o), o;
};
export {
  d as ConfirmationDialogElement,
  b as confirmationDialogAdd,
  l as defineConfirmationDialog
};
//# sourceMappingURL=ConfirmationDialog.js.map
