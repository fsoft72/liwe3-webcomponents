import type { PopoverMenuItem, MenuPosition } from "@liwe3/webcomponents";
interface Props {
    menuPosition?: MenuPosition;
    menuItems?: PopoverMenuItem[];
    alwaysShowMenu?: boolean;
    children?: import("svelte").Snippet;
}
declare const ContainerBox: import("svelte").Component<Props, {}, "">;
type ContainerBox = ReturnType<typeof ContainerBox>;
export default ContainerBox;
//# sourceMappingURL=ContainerBox.svelte.d.ts.map