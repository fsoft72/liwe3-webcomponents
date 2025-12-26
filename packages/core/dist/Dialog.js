class g extends HTMLElement {
  constructor() {
    super(), this.config = {
      title: "Dialog",
      body: "",
      modal: !0,
      escToClose: !0,
      clickToClose: !0,
      fxAppear: "none",
      fxSpeed: 1e3
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
  show(t) {
    this.config = { ...this.config, ...t }, this.render(), this.setupKeyboardListeners(), this.config.modal && this.createBackdrop(), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const o = this.shadowRoot.querySelector(".dialog-container");
        o && o.classList.add("show"), this.backdrop && (this.backdrop.style.opacity = "1");
      });
    });
  }
  /**
   * Closes the dialog
   */
  close() {
    const t = this.shadowRoot.querySelector(".dialog-container");
    t && t.classList.add("closing"), this.backdrop && (this.backdrop.remove(), this.backdrop = void 0);
    const o = this.config.fxAppear === "none" ? 0 : this.config.fxSpeed || 1e3;
    setTimeout(() => {
      this.removeKeyboardListeners(), this.dispatchEvent(new CustomEvent("close")), this.config.onclose && this.config.onclose(), this.remove();
    }, o);
  }
  /**
   * Creates the modal backdrop
   */
  createBackdrop() {
    this.backdrop || (this.backdrop = document.createElement("div"), this.backdrop.className = "dialog-backdrop", this.backdrop.style.position = "fixed", this.backdrop.style.top = "0", this.backdrop.style.left = "0", this.backdrop.style.width = "100%", this.backdrop.style.height = "100%", this.backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.6)", this.backdrop.style.backdropFilter = "blur(4px)", this.backdrop.style.webkitBackdropFilter = "blur(4px)", this.backdrop.style.zIndex = "99998", this.backdrop.style.opacity = "0", this.backdrop.style.transition = "opacity 0.3s ease", this.config.clickToClose && this.backdrop.addEventListener("click", () => {
      this.close();
    }), document.body.appendChild(this.backdrop));
  }
  /**
   * Sets up keyboard event listeners
   */
  setupKeyboardListeners() {
    this.config.escToClose && (this.escKeyHandler = (t) => {
      t.key === "Escape" && this.close();
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
      const n = o.target;
      if (n.closest(".close-button"))
        this.close();
      else if (n.closest(".dialog-button")) {
        const i = n.closest(".dialog-button").dataset.index;
        if (i !== void 0) {
          const r = this.config.buttons?.[parseInt(i, 10)];
          r && r.onclick && r.onclick(this);
        }
      }
    });
    const t = this.shadowRoot.querySelector(".dialog-container");
    t && t.addEventListener("wheel", (o) => {
      o.stopPropagation();
    }, { passive: !0 });
  }
  /**
   * Renders the component
   */
  render() {
    const t = this.config.title || "Dialog", o = this.config.buttons || [], i = `${this.config.fxSpeed || 1e3}ms`, r = this.config.fxAppear === "fade" ? "fx-fade" : this.config.fxAppear === "slide" ? "fx-slide" : "", a = o.length > 1 ? o[0] : null, c = o.length === 1 ? o : o.slice(1);
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, var(--liwe3-font-family, Ubuntu, sans-serif));
          font-size: var(--font-size, 14px);
        }

        .dialog-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 400px;
          max-width: 600px;
          max-height: 80vh;
          background: var(--dialog-background, var(--liwe3-surface-raised, white));
          border-radius: var(--dialog-border-radius, var(--liwe3-border-radius, 8px));
          box-shadow: var(--dialog-shadow, 0 10px 40px rgba(0, 0, 0, 0.2));
          z-index: 99999;
          display: flex;
          flex-direction: column;
          opacity: 1;
          font-family: var(--font-family, var(--liwe3-font-family, Ubuntu, sans-serif));
        }

        /* Fade animation */
        .dialog-container.fx-fade {
          opacity: 0;
          transition: opacity ${i} ease;
        }

        .dialog-container.fx-fade.show {
          opacity: 1;
        }

        .dialog-container.fx-fade.closing {
          opacity: 0;
        }

        /* Slide animation */
        .dialog-container.fx-slide {
          transform: translate(-50%, -100%);
          opacity: 0;
          transition: transform ${i} cubic-bezier(0.16, 1, 0.3, 1), opacity ${i} ease;
        }

        .dialog-container.fx-slide.show {
          transform: translate(-50%, -50%);
          opacity: 1;
        }

        .dialog-container.fx-slide.closing {
          transform: translate(-50%, -100%);
          opacity: 0;
        }

        .dialog-header {
          padding: 0;
          border-bottom: none;
          flex-shrink: 0;
        }

        .dialog-title {
          margin: 0;
          padding: 20px 24px;
          font-size: 20px;
          font-weight: 600;
          color: var(--dialog-title-color, var(--liwe3-text-inverse, white));
          background: var(--dialog-title-background, linear-gradient(135deg,
            var(--liwe3-mode1-500, #667eea),
            var(--liwe3-mode4-500, #9f7aea)
          ));
          border-bottom: 1px solid var(--dialog-border-color, var(--liwe3-border-default, #e0e0e0));
        }

        .dialog-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          color: var(--dialog-text-color, var(--liwe3-text-mode2, #555));
          line-height: 1.6;
        }

        .dialog-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--dialog-border-color, var(--liwe3-border-default, #e0e0e0));
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          background: var(--dialog-background, var(--liwe3-surface-raised, white));
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
          border: 1px solid var(--dialog-button-border-color, var(--liwe3-border-default, #ccc));
          border-radius: var(--dialog-button-border-radius, var(--liwe3-border-radius, 4px));
          background: var(--dialog-button-background, var(--liwe3-surface-raised, white));
          color: var(--dialog-button-color, var(--liwe3-text-mode1, #333));
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-weight: 500;
        }

        .dialog-button:hover {
          background-color: var(--dialog-button-hover-background, var(--liwe3-hover-overlay, #f8f9fa));
          border-color: var(--dialog-button-hover-border-color, var(--liwe3-border-strong, #999));
        }

        .dialog-button:active {
          background-color: var(--dialog-button-active-background, var(--liwe3-active-overlay, #e9ecef));
        }

        .close-button {
          padding: 8px 20px;
          border: 1px solid var(--dialog-close-border-color, var(--liwe3-border-default, #ccc));
          border-radius: var(--dialog-button-border-radius, var(--liwe3-border-radius, 4px));
          background: var(--dialog-close-background, var(--liwe3-surface-raised, white));
          color: var(--dialog-close-color, var(--liwe3-text-mode1, #333));
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-weight: 500;
        }

        .close-button:hover {
          background-color: var(--dialog-close-hover-background, var(--liwe3-hover-overlay, #f8f9fa));
          border-color: var(--dialog-close-hover-border-color, var(--liwe3-border-strong, #999));
        }

        @media (max-width: 768px) {
          .dialog-container {
            min-width: 90vw;
            max-width: 90vw;
          }
        }
      </style>

      <div class="dialog-container ${r}">
        <div class="dialog-header">
          <h2 class="dialog-title">${t}</h2>
        </div>

        <div class="dialog-body">
          ${this.config.body}
        </div>

        <div class="dialog-footer">
          ${a ? `
            <div class="footer-left">
              <button
                class="dialog-button"
                data-index="0"
                style="${a.backgroundColor ? `background-color: ${a.backgroundColor}; color: white; border-color: ${a.backgroundColor};` : ""}"
              >
                ${a.label}
              </button>
            </div>
          ` : ""}

          <div class="footer-right">
            ${c.map((d, s) => `
              <button
                class="dialog-button"
                data-index="${a ? s + 1 : s}"
                style="${d.backgroundColor ? `background-color: ${d.backgroundColor}; color: white; border-color: ${d.backgroundColor};` : ""}"
              >
                ${d.label}
              </button>
            `).join("")}
            ${o.length === 0 ? '<button class="close-button">Close</button>' : ""}
          </div>
        </div>
      </div>
    `, this.bindEvents();
  }
}
const b = (e = "liwe3-dialog") => {
  typeof window < "u" && !window.customElements.get(e) && customElements.define(e, g);
};
b();
const l = "liwe3-dialog-container", f = () => {
  let e = document.getElementById(l);
  return e || (e = document.createElement("div"), e.id = l, e.style.position = "fixed", e.style.zIndex = "99999", e.style.pointerEvents = "none", document.body.appendChild(e)), e;
}, h = (e) => {
  const t = f(), o = document.createElement("liwe3-dialog");
  return o.style.pointerEvents = "auto", o.show(e), t.appendChild(o), o;
};
export {
  g as DialogElement,
  b as defineDialog,
  h as dialogAdd
};
//# sourceMappingURL=Dialog.js.map
