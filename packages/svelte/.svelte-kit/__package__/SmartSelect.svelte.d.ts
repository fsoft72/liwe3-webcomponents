import type { SelectOption } from "@liwe3/webcomponents";
interface Props {
    multiple?: boolean;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    value?: string | string[];
    options?: SelectOption[];
    onchange?: (value: string | string[] | undefined) => void;
    onsearch?: (value: string) => void;
    onopen?: (event: CustomEvent) => void;
    onclose?: (event: CustomEvent) => void;
}
declare const SmartSelect: import("svelte").Component<Props, {
    /**
       * Expose methods to parent component
       */ open: () => void;
    close: () => void;
    toggle: () => void;
    selectOption: (optionValue: string) => void;
    deselectOption: (optionValue: string) => void;
    getSelectedOptions: () => any;
    setOptions: (newOptions: SelectOption[]) => void;
}, "value">;
type SmartSelect = ReturnType<typeof SmartSelect>;
export default SmartSelect;
//# sourceMappingURL=SmartSelect.svelte.d.ts.map