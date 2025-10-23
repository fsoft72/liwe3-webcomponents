/**
 * DateSelector Web Component
 * A customizable date picker with single date and range selection modes
 */

export type DateRange = {
  start: string | null;
  end: string | null;
};

export class DateSelectorElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private currentDate: Date = new Date();
  private selectedDate: string | null = null;
  private selectedRange: DateRange = { start: null, end: null };

  // Month and day names for localization
  private readonly MONTH_NAMES: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  private readonly DAY_NAMES: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.attachEventListeners();
  }

  static get observedAttributes(): string[] {
    return ['range-mode', 'selected-date', 'selected-range'];
  }

  attributeChangedCallback(name: string): void {
    if (name === 'range-mode') {
      this.selectedDate = null;
      this.selectedRange = { start: null, end: null };
      this.render();
    }
  }

  get rangeMode(): boolean {
    return this.hasAttribute('range-mode');
  }

  set rangeMode(value: boolean) {
    if (value) {
      this.setAttribute('range-mode', '');
    } else {
      this.removeAttribute('range-mode');
    }
  }

  /**
   * Renders the date selector component
   */
  private render(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

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
        ${this.rangeMode ? 'Select date range' : 'Select a date'}
      </div>

      <div class="header">
        <div class="month-year">
          ${this.MONTH_NAMES[month]}
          <select class="year-selector" id="yearSelector">
            ${this.generateYearOptions(year)}
          </select>
        </div>
        <div class="nav-buttons">
          <button class="nav-btn" id="prevMonth">‹</button>
          <button class="nav-btn" id="nextMonth">›</button>
        </div>
      </div>

      <div class="calendar-grid">
        ${this.generateCalendarGrid(year, month)}
      </div>
    `;

    // Reattach event listeners after rendering
    this.attachEventListenersToShadowRoot();
  }

  /**
   * Generates year options for the dropdown (current year ±10 years)
   */
  private generateYearOptions(currentYear: number): string {
    const START_YEAR = currentYear - 10;
    const END_YEAR = currentYear + 10;
    let options = '';

    for (let year = START_YEAR; year <= END_YEAR; year++) {
      const selected = year === currentYear ? 'selected' : '';
      options += `<option value="${year}" ${selected}>${year}</option>`;
    }

    return options;
  }

  /**
   * Generates the calendar grid with day headers and day cells
   */
  private generateCalendarGrid(year: number, month: number): string {
    let grid = '';

    // Add day headers
    this.DAY_NAMES.forEach(day => {
      grid += `<div class="day-header">${day}</div>`;
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Add previous month's trailing days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      grid += `<div class="day-cell other-month" data-date="${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}">${day}</div>`;
    }

    // Add current month days
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isToday = isCurrentMonth && today.getDate() === day;

      let classes = 'day-cell';
      if (isToday) classes += ' today';

      // Add selection classes
      if (this.rangeMode) {
        if (this.selectedRange.start && this.dateMatches(dateStr, this.selectedRange.start)) {
          classes += ' range-start';
        } else if (this.selectedRange.end && this.dateMatches(dateStr, this.selectedRange.end)) {
          classes += ' range-end';
        } else if (this.isDateInRange(dateStr)) {
          classes += ' in-range';
        }
      } else {
        if (this.selectedDate && this.dateMatches(dateStr, this.selectedDate)) {
          classes += ' selected';
        }
      }

      grid += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
    }

    // Add next month's leading days
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingCells; day++) {
      grid += `<div class="day-cell other-month" data-date="${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}">${day}</div>`;
    }

    return grid;
  }

  /**
   * Checks if two date strings match
   */
  private dateMatches(dateStr1: string, dateStr2: string): boolean {
    return dateStr1 === dateStr2;
  }

  /**
   * Checks if a date is within the selected range
   */
  private isDateInRange(dateStr: string): boolean {
    if (!this.selectedRange.start || !this.selectedRange.end) return false;

    const date = new Date(dateStr);
    const start = new Date(this.selectedRange.start);
    const end = new Date(this.selectedRange.end);

    return date > start && date < end;
  }

  /**
   * Attaches main event listeners (called once during construction)
   */
  private attachEventListeners(): void {
    // Main event delegation - only attach once
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.id === 'prevMonth') {
        this.navigateMonth(-1);
      } else if (target.id === 'nextMonth') {
        this.navigateMonth(1);
      } else if (target.classList.contains('day-cell')) {
        this.handleDayClick(target);
      }
    });

    this.shadowRoot.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.id === 'yearSelector') {
        this.navigateToYear(parseInt(target.value));
      }
    });

    // Add hover effects for range selection
    if (this.rangeMode) {
      this.shadowRoot.addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('day-cell') && this.selectedRange.start && !this.selectedRange.end) {
          this.updateRangeHover(target.dataset.date!);
        }
      });

      this.shadowRoot.addEventListener('mouseleave', () => {
        this.clearRangeHover();
      });
    }
  }

  /**
   * Called after each render to setup any post-render event listeners
   */
  private attachEventListenersToShadowRoot(): void {
    // This method is for any post-render setup if needed
    // Currently empty as we use event delegation
  }

  /**
   * Navigates to the previous or next month
   */
  private navigateMonth(direction: number): void {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    const newMonth = currentMonth + direction;

    // Handle year transitions properly
    if (newMonth < 0) {
      this.currentDate = new Date(currentYear - 1, 11, 1);
    } else if (newMonth > 11) {
      this.currentDate = new Date(currentYear + 1, 0, 1);
    } else {
      this.currentDate = new Date(currentYear, newMonth, 1);
    }

    this.render();
  }

  /**
   * Navigates to a specific year
   */
  private navigateToYear(year: number): void {
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
    this.render();
  }

  /**
   * Handles click on a day cell
   */
  private handleDayClick(dayElement: HTMLElement): void {
    const dateStr = dayElement.dataset.date!;

    if (this.rangeMode) {
      this.handleRangeSelection(dateStr);
    } else {
      this.handleSingleSelection(dateStr);
    }

    this.render();
  }

  /**
   * Handles single date selection
   */
  private handleSingleSelection(dateStr: string): void {
    this.selectedDate = dateStr;

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('dateSelected', {
      detail: { date: dateStr },
      bubbles: true
    }));
  }

  /**
   * Handles range selection
   */
  private handleRangeSelection(dateStr: string): void {
    if (!this.selectedRange.start || (this.selectedRange.start && this.selectedRange.end)) {
      // Start new selection
      this.selectedRange = { start: dateStr, end: null };
    } else {
      // Complete the range
      const startDate = new Date(this.selectedRange.start);
      const endDate = new Date(dateStr);

      if (endDate < startDate) {
        // Swap if end is before start
        this.selectedRange = { start: dateStr, end: this.selectedRange.start };
      } else {
        this.selectedRange.end = dateStr;
      }

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('rangeSelected', {
        detail: {
          start: this.selectedRange.start,
          end: this.selectedRange.end
        },
        bubbles: true
      }));
    }
  }

  /**
   * Updates hover effect when selecting a range
   */
  private updateRangeHover(hoverDate: string): void {
    const dayCells = this.shadowRoot.querySelectorAll('.day-cell:not(.other-month)');
    const startDate = new Date(this.selectedRange.start!);
    const hoverDateObj = new Date(hoverDate);

    dayCells.forEach(cell => {
      const cellElement = cell as HTMLElement;
      const cellDate = new Date(cellElement.dataset.date!);
      cellElement.classList.remove('range-hover');

      if (cellDate > startDate && cellDate <= hoverDateObj) {
        cellElement.classList.add('range-hover');
      }
    });
  }

  /**
   * Clears the hover effect for range selection
   */
  private clearRangeHover(): void {
    const dayCells = this.shadowRoot.querySelectorAll('.day-cell');
    dayCells.forEach(cell => {
      cell.classList.remove('range-hover');
    });
  }

  /**
   * Sets the selected date programmatically (single date mode only)
   */
  public setDate(dateStr: string): void {
    if (this.rangeMode) return;
    this.selectedDate = dateStr;
    const date = new Date(dateStr);
    this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.render();
  }

  /**
   * Sets the selected range programmatically (range mode only)
   */
  public setRange(startDate: string, endDate: string): void {
    if (!this.rangeMode) return;
    this.selectedRange = { start: startDate, end: endDate };
    const date = new Date(startDate);
    this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.render();
  }

  /**
   * Gets the currently selected date
   */
  public getSelectedDate(): string | null {
    return this.selectedDate;
  }

  /**
   * Gets the currently selected range
   */
  public getSelectedRange(): DateRange {
    return this.selectedRange;
  }

  /**
   * Clears the current selection
   */
  public clear(): void {
    this.selectedDate = null;
    this.selectedRange = { start: null, end: null };
    this.render();
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineDateSelector = (tagName: string = 'liwe3-date-selector'): void => {
  if (typeof window !== 'undefined' && !window.customElements.get(tagName)) {
    customElements.define(tagName, DateSelectorElement);
  }
};

// Auto-register with default tag name
defineDateSelector();

export { defineDateSelector };
