class l extends HTMLElement {
  constructor() {
    super(), this.config = {
      title: "",
      text: "",
      type: "info",
      closable: !0,
      duration: 5e3
    }, this.remainingTime = 0, this.pauseTime = 0, this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["title", "text", "type", "icon", "closable", "duration", "buttons"];
  }
  attributeChangedCallback(t, e, o) {
    e !== o && this.render();
  }
  connectedCallback() {
    this.render(), this.startAutoCloseTimer();
  }
  disconnectedCallback() {
    this.clearAutoCloseTimer();
  }
  get title() {
    const t = this.getAttribute("title"), e = this.config.title;
    if ((!t || t.trim() === "") && (!e || e.trim() === "")) {
      const o = this.type;
      return o.charAt(0).toUpperCase() + o.slice(1);
    }
    return t || e;
  }
  set title(t) {
    t && t.trim() !== "" ? (this.setAttribute("title", t), this.config.title = t) : (this.removeAttribute("title"), this.config.title = "");
  }
  get text() {
    return this.getAttribute("text") || this.config.text;
  }
  set text(t) {
    this.setAttribute("text", t), this.config.text = t;
  }
  get type() {
    return this.getAttribute("type") || this.config.type || "info";
  }
  set type(t) {
    this.setAttribute("type", t), this.config.type = t;
  }
  get icon() {
    return this.getAttribute("icon") || this.config.icon;
  }
  set icon(t) {
    t ? (this.setAttribute("icon", t), this.config.icon = t) : (this.removeAttribute("icon"), this.config.icon = void 0);
  }
  get closable() {
    return this.hasAttribute("closable") ? this.getAttribute("closable") !== "false" : this.config.closable !== !1;
  }
  set closable(t) {
    t ? this.setAttribute("closable", "true") : this.setAttribute("closable", "false"), this.config.closable = t;
  }
  get duration() {
    const t = this.getAttribute("duration");
    return t ? parseInt(t, 10) : this.config.duration ?? 5e3;
  }
  set duration(t) {
    this.setAttribute("duration", t.toString()), this.config.duration = t;
  }
  get buttons() {
    const t = this.getAttribute("buttons");
    if (t)
      try {
        return JSON.parse(t);
      } catch (e) {
        return console.error("Invalid buttons format:", e), [];
      }
    return this.config.buttons || [];
  }
  set buttons(t) {
    this.setAttribute("buttons", JSON.stringify(t)), this.config.buttons = t;
  }
  /**
   * Shows the toast with the given configuration
   */
  show(t) {
    this.config = { ...this.config, ...t }, t.buttons && t.buttons.length > 0 && (this.config.duration = 0), t.title && t.title.trim() !== "" ? this.title = t.title : (this.removeAttribute("title"), this.config.title = ""), this.text = t.text, t.type && (this.type = t.type), t.icon !== void 0 && (this.icon = t.icon), t.closable !== void 0 && (this.closable = t.closable), t.buttons && t.buttons.length > 0 ? this.duration = 0 : t.duration !== void 0 && (this.duration = t.duration), t.buttons && (this.buttons = t.buttons), this.render(), this.startAutoCloseTimer();
  }
  /**
   * Closes the toast
   */
  close() {
    this.clearAutoCloseTimer();
    const t = this.shadowRoot.querySelector(".toast-container");
    if (t) {
      requestAnimationFrame(() => {
        t.classList.add("closing");
      });
      const e = () => {
        t.removeEventListener("animationend", e);
        const o = this, i = o.offsetHeight;
        o.style.height = `${i}px`, o.style.marginBottom = "12px", o.offsetHeight, o.style.height = "0px", o.style.marginBottom = "0px", o.style.opacity = "0", setTimeout(() => {
          this.dispatchEvent(new CustomEvent("close")), this.config.onClose && this.config.onClose(), this.remove();
        }, 300);
      };
      t.addEventListener("animationend", e), setTimeout(() => {
        this.isConnected && e();
      }, 350);
    } else
      this.dispatchEvent(new CustomEvent("close")), this.config.onClose && this.config.onClose(), this.remove();
  }
  /**
   * Starts the auto-close timer if duration is set
   */
  startAutoCloseTimer() {
    this.clearAutoCloseTimer(), this.duration > 0 && (this.remainingTime = this.duration, this.pauseTime = Date.now(), this.autoCloseTimer = window.setTimeout(() => {
      this.close();
    }, this.duration), this.startProgressBarAnimation());
  }
  /**
   * Pauses the auto-close timer
   */
  pauseAutoCloseTimer() {
    this.autoCloseTimer && this.duration > 0 && (clearTimeout(this.autoCloseTimer), this.autoCloseTimer = void 0, this.remainingTime -= Date.now() - this.pauseTime, this.pauseProgressBarAnimation());
  }
  /**
   * Resumes the auto-close timer
   */
  resumeAutoCloseTimer() {
    !this.autoCloseTimer && this.remainingTime > 0 && (this.pauseTime = Date.now(), this.autoCloseTimer = window.setTimeout(() => {
      this.close();
    }, this.remainingTime), this.resumeProgressBarAnimation());
  }
  /**
   * Clears the auto-close timer
   */
  clearAutoCloseTimer() {
    this.autoCloseTimer && (clearTimeout(this.autoCloseTimer), this.autoCloseTimer = void 0);
  }
  /**
   * Starts the progress bar animation
   */
  startProgressBarAnimation() {
    !this.progressBar || this.duration <= 0 || (this.progressBar.style.animation = "none", this.progressBar.offsetWidth, this.progressBar.style.animation = `shrinkProgress ${this.duration}ms linear forwards`);
  }
  /**
   * Pauses the progress bar animation
   */
  pauseProgressBarAnimation() {
    if (!this.progressBar) return;
    const e = window.getComputedStyle(this.progressBar).width, o = this.progressBar.parentElement?.offsetWidth || 1, i = parseFloat(e) / o * 100;
    this.progressBar.style.animation = "none", this.progressBar.style.width = `${i}%`;
  }
  /**
   * Resumes the progress bar animation
   */
  resumeProgressBarAnimation() {
    if (!this.progressBar || this.remainingTime <= 0) return;
    const e = window.getComputedStyle(this.progressBar).width, o = this.progressBar.parentElement?.offsetWidth || 1, i = parseFloat(e) / o * 100, r = this.remainingTime, a = `shrinkProgress-${Date.now()}`, n = this.shadowRoot.styleSheets[0], c = `
      @keyframes ${a} {
        from {
          width: ${i}%;
        }
        to {
          width: 0%;
        }
      }
    `;
    n && n.insertRule(c, n.cssRules.length), this.progressBar.style.animation = `${a} ${r}ms linear forwards`;
  }
  /**
   * Gets the color scheme for the toast type
   */
  getTypeColors() {
    switch (this.type) {
      case "success":
        return {
          background: "var(--toast-success-background, #d4edda)",
          border: "var(--toast-success-border, #c3e6cb)",
          icon: "var(--toast-success-icon, #155724)"
        };
      case "error":
        return {
          background: "var(--toast-error-background, #f8d7da)",
          border: "var(--toast-error-border, #f5c6cb)",
          icon: "var(--toast-error-icon, #721c24)"
        };
      case "warning":
        return {
          background: "var(--toast-warning-background, #fff3cd)",
          border: "var(--toast-warning-border, #ffeaa7)",
          icon: "var(--toast-warning-icon, #856404)"
        };
      case "info":
      default:
        return {
          background: "var(--toast-info-background, #d1ecf1)",
          border: "var(--toast-info-border, #bee5eb)",
          icon: "var(--toast-info-icon, #0c5460)"
        };
    }
  }
  /**
   * Gets the default icon for the toast type
   */
  getDefaultIcon() {
    switch (this.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  }
  /**
   * Binds all event listeners
   */
  bindEvents() {
    this.shadowRoot.addEventListener("click", (e) => {
      const o = e.target;
      if (o.closest(".close-button"))
        this.close();
      else if (o.closest(".toast-button")) {
        const i = o.closest(".toast-button").dataset.index;
        if (i !== void 0) {
          const r = this.buttons[parseInt(i, 10)];
          r && r.onClick && r.onClick();
        }
      }
    });
    const t = this.shadowRoot.querySelector(".toast-container");
    t && (t.addEventListener("mouseenter", () => {
      this.pauseAutoCloseTimer();
    }), t.addEventListener("mouseleave", () => {
      this.resumeAutoCloseTimer();
    }));
  }
  /**
   * Renders the component
   */
  render() {
    const t = this.getTypeColors(), e = this.icon ? `<img src="${this.icon}" alt="Toast icon" class="toast-icon-img" />` : `<span class="toast-icon-default">${this.getDefaultIcon()}</span>`;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--font-size, 14px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toast-container {
          display: flex;
          flex-direction: column;
          min-width: 300px;
          max-width: 500px;
          padding: 16px;
          background: ${t.background};
          border: 1px solid ${t.border};
          border-radius: var(--toast-border-radius, 8px);
          box-shadow: var(--toast-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          will-change: transform, opacity;
        }

        .toast-container.closing {
          animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        .toast-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .toast-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${t.icon};
        }

        .toast-icon-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .toast-icon-default {
          font-size: 20px;
          font-weight: bold;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-weight: 600;
          font-size: 16px;
          margin: 0 0 4px 0;
          color: var(--toast-title-color, #333);
        }

        .toast-text {
          margin: 0;
          color: var(--toast-text-color, #555);
          line-height: 1.5;
          word-wrap: break-word;
        }

        .close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: var(--toast-close-color, #666);
          border-radius: 4px;
          transition: background-color 0.2s, color 0.2s;
          padding: 0;
        }

        .close-button:hover {
          background-color: var(--toast-close-hover-background, rgba(0, 0, 0, 0.1));
          color: var(--toast-close-hover-color, #333);
        }

        .toast-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--toast-button-border, rgba(0, 0, 0, 0.1));
        }

        .toast-button {
          padding: 6px 16px;
          border: 1px solid var(--toast-button-border-color, #ccc);
          border-radius: var(--toast-button-border-radius, 4px);
          background: var(--toast-button-background, white);
          color: var(--toast-button-color, #333);
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
          font-family: inherit;
        }

        .toast-button:hover {
          background-color: var(--toast-button-hover-background, #f8f9fa);
          border-color: var(--toast-button-hover-border-color, #999);
        }

        .toast-button:active {
          background-color: var(--toast-button-active-background, #e9ecef);
        }

        .toast-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 100%;
          background: var(--toast-progress-bar-color, rgba(0, 0, 0, 0.3));
          border-bottom-left-radius: var(--toast-border-radius, 8px);
          border-bottom-right-radius: var(--toast-border-radius, 8px);
          transform-origin: left;
        }

        @keyframes shrinkProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      </style>

      <div class="toast-container">
        ${this.closable ? '<button class="close-button" aria-label="Close">×</button>' : ""}

        <div class="toast-header">
          <div class="toast-icon">
            ${e}
          </div>
          <div class="toast-content">
            <h4 class="toast-title">${this.title}</h4>
            <p class="toast-text">${this.text}</p>
          </div>
        </div>

        ${this.buttons.length > 0 ? `
          <div class="toast-buttons">
            ${this.buttons.map((o, i) => `
              <button class="toast-button" data-index="${i}">
                ${o.label}
              </button>
            `).join("")}
          </div>
        ` : ""}

        ${this.duration > 0 ? '<div class="toast-progress-bar"></div>' : ""}
      </div>
    `, this.progressBar = this.shadowRoot.querySelector(".toast-progress-bar"), this.bindEvents();
  }
}
const d = (s = "liwe3-toast") => {
  typeof window < "u" && !window.customElements.get(s) && customElements.define(s, l);
};
d();
const h = "liwe3-toast-container", u = (s) => {
  switch (s) {
    case "TL":
      return { top: "20px", left: "20px", alignItems: "flex-start" };
    case "T":
      return { top: "20px", left: "50%", alignItems: "center" };
    case "TR":
      return { top: "20px", right: "20px", alignItems: "flex-end" };
    case "BL":
      return { bottom: "20px", left: "20px", alignItems: "flex-start" };
    case "B":
      return { bottom: "20px", left: "50%", alignItems: "center" };
    case "BR":
      return { bottom: "20px", right: "20px", alignItems: "flex-end" };
    default:
      return { top: "20px", right: "20px", alignItems: "flex-end" };
  }
}, m = (s = "TR") => {
  const t = `${h}-${s.toLowerCase()}`;
  let e = document.getElementById(t);
  if (!e) {
    e = document.createElement("div"), e.id = t, e.style.position = "fixed", e.style.zIndex = "99999", e.style.display = "flex", e.style.flexDirection = "column", e.style.maxWidth = "400px", e.style.pointerEvents = "none";
    const o = u(s);
    o.top && (e.style.top = o.top), o.bottom && (e.style.bottom = o.bottom), o.left && (e.style.left = o.left), o.right && (e.style.right = o.right), e.style.alignItems = o.alignItems, (s === "T" || s === "B") && (e.style.transform = "translateX(-50%)");
    const i = `${t}-styles`;
    if (!document.getElementById(i)) {
      const r = document.createElement("style");
      r.id = i, r.textContent = `
        #${t} > * {
          margin-bottom: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        #${t} > *:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          #${t} {
            left: 20px !important;
            right: 20px !important;
            max-width: none !important;
            transform: none !important;
          }
        }
      `, document.head.appendChild(r);
    }
    document.body.appendChild(e);
  }
  return e;
}, p = (s) => {
  const t = s.position || "TR", e = m(t), o = document.createElement("liwe3-toast");
  return o.style.pointerEvents = "auto", o.show(s), e.appendChild(o), o;
};
export {
  l as ToastElement,
  d as defineToast,
  p as toastAdd
};
//# sourceMappingURL=Toast.js.map
