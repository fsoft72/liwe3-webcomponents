class c extends HTMLElement {
  constructor() {
    super(), this._items = [], this._title = "Checklist", this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["title", "items"];
  }
  attributeChangedCallback(t, e, i) {
    if (e !== i) {
      if (t === "title")
        this._title = i || "Checklist";
      else if (t === "items" && i)
        try {
          this._items = JSON.parse(i);
        } catch (r) {
          console.error("Invalid items JSON:", r);
        }
      this.render();
    }
  }
  get title() {
    return this._title;
  }
  set title(t) {
    this._title = t, this.setAttribute("title", t), this.render();
  }
  get items() {
    return [...this._items];
  }
  set items(t) {
    this._items = [...t], this.render(), this.dispatchEvent(new CustomEvent("change", { detail: { items: this._items } }));
  }
  get percentage() {
    if (this._items.length === 0) return 0;
    const t = this._items.filter((e) => e.checked).length;
    return Math.round(t / this._items.length * 100);
  }
  loadJSON(t) {
    try {
      const e = JSON.parse(t);
      e.title && (this.title = e.title), e.items && Array.isArray(e.items) && (this.items = e.items);
    } catch (e) {
      console.error("Error loading JSON:", e);
    }
  }
  toJSON() {
    return JSON.stringify({
      title: this.title,
      items: this.items
    }, null, 2);
  }
  addItem(t) {
    t.trim() && (this._items.push({ label: t, checked: !1 }), this.render(), this.dispatchEvent(new CustomEvent("change", { detail: { items: this._items } })), requestAnimationFrame(() => {
      const e = this.shadowRoot.querySelector(".add-item-input");
      e && e.focus();
    }));
  }
  removeItem(t) {
    this._items.splice(t, 1), this.render(), this.dispatchEvent(new CustomEvent("change", { detail: { items: this._items } }));
  }
  toggleItem(t) {
    this._items[t].checked = !this._items[t].checked, this.render(), this.dispatchEvent(new CustomEvent("change", { detail: { items: this._items } }));
  }
  updateItemLabel(t, e) {
    this._items[t].label = e, this.dispatchEvent(new CustomEvent("change", { detail: { items: this._items } }));
  }
  render() {
    const t = this.percentage, e = this._items.filter((n) => n.checked).length, i = this._items.length;
    this.shadowRoot.querySelector(".list") || (this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            background: var(--background, #fff);
            border-radius: var(--border-radius, 8px);
            padding: var(--padding, 16px);
            box-shadow: var(--box-shadow, 0 2px 4px rgba(0,0,0,0.1));
            max-width: var(--max-width, 100%);
          }
  
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }
  
          .title {
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-color, #333);
          }
  
          .title-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }
  
          .progress-container {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }
  
          .progress-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-color, #333);
            min-width: 40px;
          }
  
          .progress-bar-bg {
            flex: 1;
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
          }
  
          .progress-bar-fill {
            height: 100%;
            background: var(--primary-color, #1976d2);
            width: 0%;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
  
          .list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
  
          .list-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 4px 0;
          }
  
          .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #757575;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
          }
  
          .checkbox.checked {
            background: var(--primary-color, #1976d2);
            border-color: var(--primary-color, #1976d2);
          }
  
          .checkbox svg {
            width: 14px;
            height: 14px;
            fill: white;
            display: none;
          }
  
          .checkbox.checked svg {
            display: block;
          }
  
          .item-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
            color: var(--text-color, #333);
          }
  
          .item-input:focus {
            border-color: var(--primary-color, #1976d2);
          }
  
          .item-input.add-item-input {
            color: #666;
          }
          
          .item-input.add-item-input::placeholder {
            color: #999;
          }
  
          .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: #9e9e9e;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
  
          .delete-btn:hover {
            color: #f44336;
          }
  
          .delete-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
          }
  
          .add-btn {
            background: #f5f5f5;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #757575;
            transition: background 0.2s;
          }
  
          .add-btn:hover {
            background: #e0e0e0;
          }
        </style>
  
        <div class="header">
          <div class="title">
            <svg class="title-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="title-text">${this._title}</span>
          </div>
          <slot name="menu"></slot>
        </div>
  
        <div class="progress-container">
          <div class="progress-text"></div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill"></div>
          </div>
        </div>
  
        <div class="list"></div>
      `);
    const r = this.shadowRoot.querySelector(".title-text");
    r && (r.textContent = this._title);
    const s = this.shadowRoot.querySelector(".progress-text");
    s && (s.textContent = `${e} / ${i}`);
    const o = this.shadowRoot.querySelector(".progress-bar-fill");
    o && (o.style.width = `${t}%`);
    const l = this.shadowRoot.querySelector(".list");
    l && (l.innerHTML = `
        ${this._items.map((n, a) => `
          <div class="list-item">
            <div class="checkbox ${n.checked ? "checked" : ""}" data-index="${a}">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <input 
              type="text" 
              class="item-input" 
              value="${n.label}" 
              data-index="${a}"
            >
            <button class="delete-btn" data-index="${a}" title="Delete item">
              <svg viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        `).join("")}

        <div class="list-item">
          <div class="checkbox" style="border-color: transparent; cursor: default;"></div>
          <input 
            type="text" 
            class="item-input add-item-input" 
            placeholder="Add an item"
          >
          <div class="add-btn" title="Add item">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
        </div>
      `), this.bindEvents();
  }
  bindEvents() {
    this.shadowRoot.querySelectorAll(".checkbox").forEach((i) => {
      i.addEventListener("click", (r) => {
        const s = r.currentTarget.dataset.index;
        s !== void 0 && this.toggleItem(parseInt(s));
      });
    }), this.shadowRoot.querySelectorAll(".delete-btn").forEach((i) => {
      i.addEventListener("click", (r) => {
        const s = r.currentTarget.dataset.index;
        s !== void 0 && this.removeItem(parseInt(s));
      });
    }), this.shadowRoot.querySelectorAll(".item-input:not(.add-item-input)").forEach((i) => {
      i.addEventListener("input", (r) => {
        const s = r.target, o = s.dataset.index;
        o !== void 0 && this.updateItemLabel(parseInt(o), s.value);
      });
    });
    const t = this.shadowRoot.querySelector(".add-item-input");
    t && (t.addEventListener("keydown", (i) => {
      i.key === "Enter" && (this.addItem(t.value), t.value = "");
    }), t.addEventListener("blur", () => {
      t.value.trim() && (this.addItem(t.value), t.value = "");
    }));
    const e = this.shadowRoot.querySelector(".add-btn");
    e && t && e.addEventListener("click", () => {
      t.value.trim() ? (this.addItem(t.value), t.value = "") : t.focus();
    });
  }
}
const h = (d = "liwe3-checklist") => {
  typeof window < "u" && !window.customElements.get(d) && customElements.define(d, c);
};
h();
export {
  c as CheckListElement,
  h as defineCheckList
};
//# sourceMappingURL=CheckList.js.map
