/**
 * DateSelector Web Component
 * A customizable date picker with single date and range selection modes
 */
export type DateRange = {
    start: string | null;
    end: string | null;
};
export declare class DateSelectorElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private currentDate;
    private selectedDate;
    private selectedRange;
    private readonly MONTH_NAMES;
    private readonly DAY_NAMES;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string): void;
    get rangeMode(): boolean;
    set rangeMode(value: boolean);
    /**
     * Renders the date selector component
     */
    private render;
    /**
     * Generates year options for the dropdown (current year ±10 years)
     */
    private generateYearOptions;
    /**
     * Generates the calendar grid with day headers and day cells
     */
    private generateCalendarGrid;
    /**
     * Checks if two date strings match
     */
    private dateMatches;
    /**
     * Checks if a date is within the selected range
     */
    private isDateInRange;
    /**
     * Attaches main event listeners (called once during construction)
     */
    private attachEventListeners;
    /**
     * Called after each render to setup any post-render event listeners
     */
    private attachEventListenersToShadowRoot;
    /**
     * Navigates to the previous or next month
     */
    private navigateMonth;
    /**
     * Navigates to a specific year
     */
    private navigateToYear;
    /**
     * Handles click on a day cell
     */
    private handleDayClick;
    /**
     * Handles single date selection
     */
    private handleSingleSelection;
    /**
     * Handles range selection
     */
    private handleRangeSelection;
    /**
     * Updates hover effect when selecting a range
     */
    private updateRangeHover;
    /**
     * Clears the hover effect for range selection
     */
    private clearRangeHover;
    /**
     * Sets the selected date programmatically (single date mode only)
     */
    setDate(dateStr: string): void;
    /**
     * Sets the selected range programmatically (range mode only)
     */
    setRange(startDate: string, endDate: string): void;
    /**
     * Gets the currently selected date
     */
    getSelectedDate(): string | null;
    /**
     * Gets the currently selected range
     */
    getSelectedRange(): DateRange;
    /**
     * Clears the current selection
     */
    clear(): void;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const defineDateSelector: (tagName?: string) => void;
export { defineDateSelector };
//# sourceMappingURL=DateSelector.d.ts.map