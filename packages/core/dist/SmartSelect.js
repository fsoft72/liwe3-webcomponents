class g extends HTMLElement {
  constructor() {
    super(), this.isOpen = !1, this.selectedOptions = [], this.filteredOptions = [], this.focusedIndex = -1, this.searchValue = "", this.keyboardNavigating = !1, this.attachShadow({ mode: "open" }), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0"), this.render(), this.bindEvents();
  }
  static get observedAttributes() {
    return ["multiple", "searchable", "placeholder", "disabled", "value", "options"];
  }
  attributeChangedCallback(e, t, s) {
    t !== s && (e === "options" && (this.filteredOptions = [...this.options]), this.render());
  }
  get multiple() {
    return this.hasAttribute("multiple");
  }
  set multiple(e) {
    e ? this.setAttribute("multiple", "") : this.removeAttribute("multiple");
  }
  get searchable() {
    return this.hasAttribute("searchable");
  }
  set searchable(e) {
    e ? this.setAttribute("searchable", "") : this.removeAttribute("searchable");
  }
  get placeholder() {
    return this.getAttribute("placeholder") || "Select an option";
  }
  set placeholder(e) {
    this.setAttribute("placeholder", e);
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(e) {
    e ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  get value() {
    return this.multiple ? this.selectedOptions.map((e) => e.value) : this.selectedOptions.length > 0 ? this.selectedOptions[0].value : "";
  }
  set value(e) {
    if (this.multiple && Array.isArray(e))
      this.selectedOptions = this.options.filter((t) => e.includes(t.value));
    else {
      const t = this.options.find((s) => s.value === e);
      this.selectedOptions = t ? [t] : [];
    }
    this.render();
  }
  get options() {
    const e = this.getAttribute("options");
    if (e)
      try {
        return JSON.parse(e);
      } catch (t) {
        return console.error("Invalid options format:", t), [];
      }
    return [];
  }
  set options(e) {
    this.setAttribute("options", JSON.stringify(e));
  }
  /**
   * Opens the dropdown
   */
  open() {
    this.disabled || (this.isOpen = !0, this.focusedIndex = -1, this.options.length > 0 && (this.filteredOptions = [...this.options]), this.render(), this._updateDropdownPosition(), this.searchable && requestAnimationFrame(() => {
      const e = this.shadowRoot.querySelector(".search-input");
      e && e.focus();
    }), this.dispatchEvent(new CustomEvent("open")));
  }
  /**
   * Closes the dropdown
   */
  close() {
    this.isOpen = !1, this.focusedIndex = -1, this.searchValue = "", this.searchable && this.options.length > 0 && (this.filteredOptions = [...this.options]);
    const e = this.shadowRoot.querySelector(".dropdown");
    e && (e.style.top = "", e.style.left = "", e.style.width = "", e.style.maxHeight = ""), this.render(), this.dispatchEvent(new CustomEvent("close"));
  }
  /**
   * Toggles the dropdown open/closed state
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  /**
   * Selects an option by its value
   */
  selectOption(e) {
    const t = this.options.find((s) => s.value === e);
    t && (this.multiple ? this.selectedOptions.find((s) => s.value === e) || this.selectedOptions.push(t) : (this.selectedOptions = [t], this.close()), this.render(), this.dispatchEvent(new CustomEvent("change", { detail: { value: this.value } })));
  }
  /**
   * Deselects an option by its value
   */
  deselectOption(e) {
    this.selectedOptions = this.selectedOptions.filter((t) => t.value !== e), this.render(), this.dispatchEvent(new CustomEvent("change", { detail: { value: this.value } }));
  }
  /**
   * Returns an array of currently selected options
   */
  getSelectedOptions() {
    return [...this.selectedOptions];
  }
  /**
   * Sets the options for the select component
   */
  setOptions(e) {
    this.options = e, this.filteredOptions = [...e], this.selectedOptions = [], this.render();
  }
  /**
   * Handles search functionality
   */
  handleSearch(e) {
    this.searchValue = e, this.filteredOptions = this.options.filter(
      (t) => t.label.toLowerCase().includes(e.toLowerCase())
    ), this.focusedIndex = -1, this.render(), this.dispatchEvent(new CustomEvent("search", { detail: { query: e } }));
  }
  /**
   * Updates the visual focus state without full re-render
   */
  updateFocusedOption() {
    const e = this.shadowRoot.querySelectorAll(".option");
    e.forEach((t) => t.classList.remove("focused")), this.focusedIndex >= 0 && this.focusedIndex < e.length && e[this.focusedIndex].classList.add("focused"), this.scrollToFocusedOption();
  }
  /**
   * Scrolls the focused option into view
   */
  scrollToFocusedOption() {
    this.focusedIndex < 0 || requestAnimationFrame(() => {
      const e = this.shadowRoot.querySelector(".dropdown"), t = this.shadowRoot.querySelector(".option.focused");
      if (e && t) {
        const s = e.getBoundingClientRect(), o = t.getBoundingClientRect();
        o.top < s.top ? e.scrollTop -= s.top - o.top : o.bottom > s.bottom && (e.scrollTop += o.bottom - s.bottom);
      }
    });
  }
  /**
   * Calculates the optimal dropdown position based on viewport constraints
   */
  _calculateDropdownPosition() {
    const e = this.shadowRoot.querySelector(".select-trigger");
    if (!e) return null;
    const t = e.getBoundingClientRect(), s = window.innerHeight, o = window.innerWidth, i = 200, n = 10, r = 2, l = s - t.bottom, h = t.top, u = l < i + n && h > l, p = t.width, f = Math.max(0, Math.min(t.left, o - p));
    let c, a;
    return u ? (a = Math.min(i, h - n), c = t.top - a - r) : (a = Math.min(i, l - n), c = t.bottom + r), {
      top: Math.max(0, c),
      left: f,
      width: p,
      maxHeight: Math.max(100, a)
      // Ensure minimum height
    };
  }
  /**
   * Updates dropdown position using fixed positioning relative to viewport
   */
  _updateDropdownPosition() {
    requestAnimationFrame(() => {
      const e = this.shadowRoot.querySelector(".dropdown");
      if (!e) return;
      const t = this._calculateDropdownPosition();
      t && (e.style.top = `${t.top}px`, e.style.left = `${t.left}px`, e.style.width = `${t.width}px`, e.style.maxHeight = `${t.maxHeight}px`);
    });
  }
  /**
   * Handles keyboard navigation
   */
  handleKeydown(e) {
    if (!this.disabled && !e._smartSelectHandled)
      switch (e._smartSelectHandled = !0, e.key) {
        case "ArrowDown":
          if (e.preventDefault(), this.keyboardNavigating = !0, clearTimeout(this.keyboardTimer), this.keyboardTimer = window.setTimeout(() => {
            this.keyboardNavigating = !1;
          }, 100), !this.isOpen)
            this.open();
          else {
            const t = this.shadowRoot.querySelector(".search-input");
            if (this.searchable && t === this.shadowRoot.activeElement) {
              this.focusedIndex = 0, t.blur(), this.focus(), this.updateFocusedOption();
              return;
            }
            const o = Math.min(this.focusedIndex + 1, this.filteredOptions.length - 1);
            this.focusedIndex = o, this.updateFocusedOption();
          }
          break;
        case "ArrowUp":
          if (e.preventDefault(), this.keyboardNavigating = !0, clearTimeout(this.keyboardTimer), this.keyboardTimer = window.setTimeout(() => {
            this.keyboardNavigating = !1;
          }, 100), this.isOpen) {
            if (this.focusedIndex === 0 && this.searchable) {
              this.focusedIndex = -1, this.updateFocusedOption(), requestAnimationFrame(() => {
                const i = this.shadowRoot.querySelector(".search-input");
                i && (i.focus(), i.setSelectionRange(i.value.length, i.value.length));
              });
              return;
            }
            const t = this.shadowRoot.querySelector(".search-input");
            if (this.searchable && t === this.shadowRoot.activeElement)
              return;
            const o = Math.max(this.focusedIndex - 1, -1);
            this.focusedIndex = o, this.updateFocusedOption();
          }
          break;
        case "Enter":
          e.preventDefault(), this.isOpen && this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length ? this.selectOption(this.filteredOptions[this.focusedIndex].value) : this.isOpen || this.open();
          break;
        case "Escape":
          e.preventDefault(), this.close();
          break;
        case "Tab":
          this.close();
          break;
      }
  }
  /**
   * Binds all event listeners
   */
  bindEvents() {
    const e = this.handleKeydown.bind(this);
    this.addEventListener("keydown", e), this.shadowRoot.addEventListener("keydown", e), this.shadowRoot.addEventListener("click", (t) => {
      t.stopPropagation();
      const s = t.target;
      if (s.closest(".remove-tag")) {
        const o = s.closest(".remove-tag").dataset.value;
        o && this.deselectOption(o);
      } else if (s.closest(".option")) {
        const o = s.closest(".option").dataset.value;
        o && this.selectOption(o);
      } else s.closest(".select-trigger") && this.toggle();
    }), this.shadowRoot.addEventListener("mouseover", (t) => {
      if (this.keyboardNavigating) return;
      const s = t.target;
      if (s.closest(".option")) {
        const o = s.closest(".option"), n = Array.from(this.shadowRoot.querySelectorAll(".option")).indexOf(o);
        if (this.focusedIndex !== n) {
          const r = this.shadowRoot.querySelector(".option.focused");
          r && r.classList.remove("focused"), o.classList.add("focused"), this.focusedIndex = n;
        }
      }
    }), this.shadowRoot.addEventListener("mouseleave", (t) => {
      if (this.keyboardNavigating) return;
      if (t.target.closest(".dropdown")) {
        const o = this.shadowRoot.querySelector(".option.focused");
        o && o.classList.remove("focused"), this.focusedIndex = -1;
      }
    }), this.shadowRoot.addEventListener("input", (t) => {
      const s = t.target;
      s.classList.contains("search-input") && this.handleSearch(s.value);
    }), document.addEventListener("click", (t) => {
      this.contains(t.target) || this.close();
    }), window.addEventListener("resize", () => {
      this.isOpen && this._updateDropdownPosition();
    }), window.addEventListener("scroll", () => {
      this.isOpen && this._updateDropdownPosition();
    }, !0);
  }
  /**
   * Renders the component
   */
  render() {
    this.filteredOptions.length === 0 && this.options.length > 0 && (this.filteredOptions = [...this.options]);
    const e = this.shadowRoot.querySelector(".search-input") === this.shadowRoot.activeElement, t = this.selectedOptions.length > 0 ? this.multiple ? `${this.selectedOptions.length} selected` : this.selectedOptions[0].label : this.placeholder;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          min-width: 200px;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--font-size, 14px);
          outline: none;
        }

        :host(:focus) .select-trigger {
          border-color: var(--focus-color, #007bff);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        :host([disabled]) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .select-container {
          position: relative;
        }

        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--padding, 8px 12px);
          border: var(--border, 1px solid #ccc);
          border-radius: var(--border-radius, 4px);
          background: var(--background, white);
          cursor: pointer;
          min-height: 36px;
          box-sizing: border-box;
          color: #333;
          user-select: none;
        }

        .select-trigger:focus {
          outline: none;
          border-color: var(--focus-color, #007bff);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .select-trigger[disabled] {
          cursor: not-allowed;
        }

        .selected-content {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
          flex: 1;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: var(--tag-background, #e9ecef);
          border-radius: var(--tag-border-radius, 12px);
          font-size: 12px;
          color: var(--tag-color, #495057);
          user-select: none;
        }

        .remove-tag {
          cursor: pointer;
          color: var(--remove-color, #6c757d);
          font-weight: bold;
          font-size: 14px;
        }

        .remove-tag:hover {
          color: var(--remove-hover-color, #dc3545);
        }

        .arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid var(--arrow-color, #666);
          transition: transform 0.2s;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .dropdown {
          position: fixed;
          z-index: 99999;
          background: var(--dropdown-background, white);
          border: var(--dropdown-border, 1px solid #ccc);
          border-radius: var(--dropdown-border-radius, 4px);
          box-shadow: var(--dropdown-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
          max-height: 200px;
          overflow-y: auto;
          scroll-behavior: smooth;
          color: #333;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-bottom: 1px solid #eee;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .option {
          padding: 8px 12px;
          cursor: pointer;
          color: var(--option-color, #333);
          transition: background-color 0.2s;
          user-select: none;
        }

        .option:hover {
          background-color: var(--option-hover-background, #f8f9fa);
        }

        .option.focused {
          background-color: var(--option-focused-background, #007bff);
          color: var(--option-focused-color, white);
        }

        .option.selected {
          background-color: var(--option-selected-background, #e3f2fd);
          color: var(--option-selected-color, #1976d2);
        }

        .option-content {
          display: flex;
          align-items: center;
        }

        .option-image {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .tag-image {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 4px;
          flex-shrink: 0;
        }

        .single-value {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .single-value-image {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
        }

        .no-options {
          padding: 8px 12px;
          color: var(--no-options-color, #6c757d);
          font-style: italic;
        }
      </style>

      <div class="select-container">
        <div class="select-trigger" tabindex="-1">
          <div class="selected-content">
            ${this.multiple && this.selectedOptions.length > 0 ? this.selectedOptions.map((s) => `
                  <span class="tag">
                    ${s.image ? `<img src="${s.image}" class="tag-image" alt="">` : ""}
                    ${s.label}
                    <span class="remove-tag" data-value="${s.value}">×</span>
                  </span>
                `).join("") : this.selectedOptions.length > 0 ? `<div class="single-value">
               ${this.selectedOptions[0].image ? `<img src="${this.selectedOptions[0].image}" class="single-value-image" alt="">` : ""}
               <span>${this.selectedOptions[0].label}</span>
             </div>` : `<span>${t}</span>`}
          </div>
          <div class="arrow ${this.isOpen ? "open" : ""}"></div>
        </div>

        ${this.isOpen ? `
          <div class="dropdown">
            ${this.searchable ? `
              <input
                type="text"
                class="search-input"
                placeholder="Search options..."
                value="${this.searchValue}"
              >
            ` : ""}

            ${this.filteredOptions.length > 0 ? this.filteredOptions.map((s, o) => `
                  <div
                    class="option ${this.selectedOptions.find((i) => i.value === s.value) ? "selected" : ""} ${o === this.focusedIndex ? "focused" : ""}"
                    data-value="${s.value}"
                  >
                    <div class="option-content">
                      ${s.image ? `<img src="${s.image}" class="option-image" alt="">` : ""}
                      <span>${s.label}</span>
                    </div>
                  </div>
                `).join("") : '<div class="no-options">No options available</div>'}
          </div>
        ` : ""}
      </div>
    `, e && this.searchable && this.isOpen && requestAnimationFrame(() => {
      const s = this.shadowRoot.querySelector(".search-input");
      s && (s.focus(), s.setSelectionRange(s.value.length, s.value.length));
    });
  }
}
const b = (d = "liwe3-select") => {
  typeof window < "u" && !window.customElements.get(d) && customElements.define(d, g);
};
b();
export {
  g as SmartSelectElement,
  b as defineSmartSelect
};
//# sourceMappingURL=SmartSelect.js.map
