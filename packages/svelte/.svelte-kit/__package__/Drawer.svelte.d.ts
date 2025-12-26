import type { Snippet } from "svelte";
type DrawerDirection = "horizontal" | "vertical";
type DrawerState = "expanded" | "shrunk" | "closed";
interface Props {
    direction?: DrawerDirection;
    duration?: number;
    showTitleWhenShrunk?: boolean;
    closable?: boolean;
    title?: string;
    icon?: string;
    state?: DrawerState;
    showToggleButton?: boolean;
    contentPadding?: string;
    onstatechange?: (event: CustomEvent<{
        oldState: DrawerState;
        newState: DrawerState;
    }>) => void;
    onexpanded?: (event: CustomEvent) => void;
    onshrunk?: (event: CustomEvent) => void;
    onclosed?: (event: CustomEvent) => void;
    children?: Snippet;
}
declare const Drawer: import("svelte").Component<Props, {
    /** Expand the drawer programmatically. */ expand: () => void;
    /** Shrink the drawer to its collapsed size. */ shrink: () => void;
    /** Close the drawer and remove it from the DOM. */ close: () => void;
    /** Toggle between expanded and shrunk states. */ toggle: () => void;
    /** Return the current drawer state. */ getState: () => DrawerState;
    /** Imperatively set the drawer state. */ setState: (nextState: DrawerState) => void;
}, "state">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
//# sourceMappingURL=Drawer.svelte.d.ts.map