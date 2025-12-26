import type { PopoverMenuConfig } from "@liwe3/webcomponents";
interface Props {
    items?: PopoverMenuConfig[];
}
declare const PopoverMenu: import("svelte").Component<Props, {
    /**
       * Expose methods to parent component
       */ setItems: (newItems: PopoverMenuConfig[]) => void;
    getItems: () => PopoverMenuConfig[];
    addMenuItem: (item: PopoverMenuConfig, index?: number | null) => void;
    removeMenuItem: (index: number) => void;
    updateMenuItem: (index: number, item: PopoverMenuConfig) => void;
}, "">;
type PopoverMenu = ReturnType<typeof PopoverMenu>;
export default PopoverMenu;
//# sourceMappingURL=PopoverMenu.svelte.d.ts.map