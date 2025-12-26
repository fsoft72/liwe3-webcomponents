class w extends HTMLElement {
  constructor() {
    super(), this.currentDate = /* @__PURE__ */ new Date(), this.selectedDate = null, this.selectedRange = { start: null, end: null }, this.MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ], this.DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], this.attachShadow({ mode: "open" }), this.render(), this.attachEventListeners();
  }
  static get observedAttributes() {
    return ["range-mode", "selected-date", "selected-range"];
  }
  attributeChangedCallback(e) {
    e === "range-mode" && (this.selectedDate = null, this.selectedRange = { start: null, end: null }, this.render());
  }
  get rangeMode() {
    return this.hasAttribute("range-mode");
  }
  set rangeMode(e) {
    e ? this.setAttribute("range-mode", "") : this.removeAttribute("range-mode");
  }
  /**
   * Renders the date selector component
   */
  render() {
    const e = this.currentDate.getFullYear(), t = this.currentDate.getMonth();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          width: 320px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .month-year {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          padding-left: 4px;
        }

        .nav-buttons {
          display: flex;
          gap: 8px;
        }

        .nav-btn {
          background: #f5f5f5;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .nav-btn:hover {
          background: #e0e0e0;
        }

        .year-selector {
          background: transparent;
          border: none;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .year-selector:hover {
          background: #f5f5f5;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .day-header {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          padding: 8px 4px;
        }

        .day-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          position: relative;
        }

        .day-cell:hover {
          background: #f0f0f0;
        }

        .day-cell.other-month {
          color: #ccc;
        }

        .day-cell.today {
          background: #e3f2fd;
          font-weight: 600;
        }

        .day-cell.selected {
          background: #2196f3;
          color: white;
        }

        .day-cell.range-start {
          background: #2196f3;
          color: white;
        }

        .day-cell.range-end {
          background: #2196f3;
          color: white;
        }

        .day-cell.in-range {
          background: #bbdefb;
          color: #1976d2;
        }

        .day-cell.range-hover {
          background: #e3f2fd;
        }

        .mode-indicator {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          text-align: center;
        }
      </style>

      <div class="mode-indicator">
        ${this.rangeMode ? "Select date range" : "Select a date"}
      </div>

      <div class="header">
        <div class="month-year">
          ${this.MONTH_NAMES[t]}
          <select class="year-selector" id="yearSelector">
            ${this.generateYearOptions(e)}
          </select>
        </div>
        <div class="nav-buttons">
          <button class="nav-btn" id="prevMonth">‹</button>
          <button class="nav-btn" id="nextMonth">›</button>
        </div>
      </div>

      <div class="calendar-grid">
        ${this.generateCalendarGrid(e, t)}
      </div>
    `, this.attachEventListenersToShadowRoot();
  }
  /**
   * Generates year options for the dropdown (current year ±10 years)
   */
  generateYearOptions(e) {
    const t = e - 10, a = e + 10;
    let s = "";
    for (let r = t; r <= a; r++)
      s += `<option value="${r}" ${r === e ? "selected" : ""}>${r}</option>`;
    return s;
  }
  /**
   * Generates the calendar grid with day headers and day cells
   */
  generateCalendarGrid(e, t) {
    let a = "";
    this.DAY_NAMES.forEach((n) => {
      a += `<div class="day-header">${n}</div>`;
    });
    const s = new Date(e, t, 1), r = new Date(e, t + 1, 0), i = s.getDay(), d = r.getDate(), g = t === 0 ? 11 : t - 1, u = t === 0 ? e - 1 : e, f = new Date(u, g + 1, 0).getDate();
    for (let n = i - 1; n >= 0; n--) {
      const o = f - n;
      a += `<div class="day-cell other-month" data-date="${u}-${(g + 1).toString().padStart(2, "0")}-${o.toString().padStart(2, "0")}">${o}</div>`;
    }
    const h = /* @__PURE__ */ new Date(), p = h.getFullYear() === e && h.getMonth() === t;
    for (let n = 1; n <= d; n++) {
      const o = `${e}-${(t + 1).toString().padStart(2, "0")}-${n.toString().padStart(2, "0")}`, y = p && h.getDate() === n;
      let l = "day-cell";
      y && (l += " today"), this.rangeMode ? this.selectedRange.start && this.dateMatches(o, this.selectedRange.start) ? l += " range-start" : this.selectedRange.end && this.dateMatches(o, this.selectedRange.end) ? l += " range-end" : this.isDateInRange(o) && (l += " in-range") : this.selectedDate && this.dateMatches(o, this.selectedDate) && (l += " selected"), a += `<div class="${l}" data-date="${o}">${n}</div>`;
    }
    const v = Math.ceil((i + d) / 7) * 7 - (i + d), D = t === 11 ? 0 : t + 1, b = t === 11 ? e + 1 : e;
    for (let n = 1; n <= v; n++)
      a += `<div class="day-cell other-month" data-date="${b}-${(D + 1).toString().padStart(2, "0")}-${n.toString().padStart(2, "0")}">${n}</div>`;
    return a;
  }
  /**
   * Checks if two date strings match
   */
  dateMatches(e, t) {
    return e === t;
  }
  /**
   * Checks if a date is within the selected range
   */
  isDateInRange(e) {
    if (!this.selectedRange.start || !this.selectedRange.end) return !1;
    const t = new Date(e), a = new Date(this.selectedRange.start), s = new Date(this.selectedRange.end);
    return t > a && t < s;
  }
  /**
   * Attaches main event listeners (called once during construction)
   */
  attachEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      const t = e.target;
      t.id === "prevMonth" ? this.navigateMonth(-1) : t.id === "nextMonth" ? this.navigateMonth(1) : t.classList.contains("day-cell") && this.handleDayClick(t);
    }), this.shadowRoot.addEventListener("change", (e) => {
      const t = e.target;
      t.id === "yearSelector" && this.navigateToYear(parseInt(t.value));
    }), this.rangeMode && (this.shadowRoot.addEventListener("mouseover", (e) => {
      const t = e.target;
      t.classList.contains("day-cell") && this.selectedRange.start && !this.selectedRange.end && this.updateRangeHover(t.dataset.date);
    }), this.shadowRoot.addEventListener("mouseleave", () => {
      this.clearRangeHover();
    }));
  }
  /**
   * Called after each render to setup any post-render event listeners
   */
  attachEventListenersToShadowRoot() {
  }
  /**
   * Navigates to the previous or next month
   */
  navigateMonth(e) {
    const t = this.currentDate.getFullYear(), s = this.currentDate.getMonth() + e;
    s < 0 ? this.currentDate = new Date(t - 1, 11, 1) : s > 11 ? this.currentDate = new Date(t + 1, 0, 1) : this.currentDate = new Date(t, s, 1), this.render();
  }
  /**
   * Navigates to a specific year
   */
  navigateToYear(e) {
    this.currentDate = new Date(e, this.currentDate.getMonth(), 1), this.render();
  }
  /**
   * Handles click on a day cell
   */
  handleDayClick(e) {
    const t = e.dataset.date;
    this.rangeMode ? this.handleRangeSelection(t) : this.handleSingleSelection(t), this.render();
  }
  /**
   * Handles single date selection
   */
  handleSingleSelection(e) {
    this.selectedDate = e, this.dispatchEvent(new CustomEvent("dateSelected", {
      detail: { date: e },
      bubbles: !0
    }));
  }
  /**
   * Handles range selection
   */
  handleRangeSelection(e) {
    if (!this.selectedRange.start || this.selectedRange.start && this.selectedRange.end)
      this.selectedRange = { start: e, end: null };
    else {
      const t = new Date(this.selectedRange.start);
      new Date(e) < t ? this.selectedRange = { start: e, end: this.selectedRange.start } : this.selectedRange.end = e, this.dispatchEvent(new CustomEvent("rangeSelected", {
        detail: {
          start: this.selectedRange.start,
          end: this.selectedRange.end
        },
        bubbles: !0
      }));
    }
  }
  /**
   * Updates hover effect when selecting a range
   */
  updateRangeHover(e) {
    const t = this.shadowRoot.querySelectorAll(".day-cell:not(.other-month)"), a = new Date(this.selectedRange.start), s = new Date(e);
    t.forEach((r) => {
      const i = r, d = new Date(i.dataset.date);
      i.classList.remove("range-hover"), d > a && d <= s && i.classList.add("range-hover");
    });
  }
  /**
   * Clears the hover effect for range selection
   */
  clearRangeHover() {
    this.shadowRoot.querySelectorAll(".day-cell").forEach((t) => {
      t.classList.remove("range-hover");
    });
  }
  /**
   * Sets the selected date programmatically (single date mode only)
   */
  setDate(e) {
    if (this.rangeMode) return;
    this.selectedDate = e;
    const t = new Date(e);
    this.currentDate = new Date(t.getFullYear(), t.getMonth(), 1), this.render();
  }
  /**
   * Sets the selected range programmatically (range mode only)
   */
  setRange(e, t) {
    if (!this.rangeMode) return;
    this.selectedRange = { start: e, end: t };
    const a = new Date(e);
    this.currentDate = new Date(a.getFullYear(), a.getMonth(), 1), this.render();
  }
  /**
   * Gets the currently selected date
   */
  getSelectedDate() {
    return this.selectedDate;
  }
  /**
   * Gets the currently selected range
   */
  getSelectedRange() {
    return this.selectedRange;
  }
  /**
   * Clears the current selection
   */
  clear() {
    this.selectedDate = null, this.selectedRange = { start: null, end: null }, this.render();
  }
}
const R = (c = "liwe3-date-selector") => {
  typeof window < "u" && !window.customElements.get(c) && customElements.define(c, w);
};
R();
export {
  w as DateSelectorElement,
  R as defineDateSelector
};
//# sourceMappingURL=DateSelector.js.map
