import type { DateRange } from "@liwe3/webcomponents";
interface Props {
    rangeMode?: boolean;
    selectedDate?: string | null;
    selectedRange?: DateRange;
    ondateselected?: (date: string) => void;
    onrangeselected?: (range: DateRange) => void;
}
declare const DateSelector: import("svelte").Component<Props, {
    /**
       * Expose methods to parent component
       */ setDate: (dateStr: string) => void;
    setRange: (startDate: string, endDate: string) => void;
    getSelectedDate: () => any;
    getSelectedRange: () => any;
    clear: () => void;
}, "selectedDate" | "selectedRange">;
type DateSelector = ReturnType<typeof DateSelector>;
export default DateSelector;
//# sourceMappingURL=DateSelector.svelte.d.ts.map