import type { ButtonToolbarGroup, ButtonToolbarItem } from "@liwe3/webcomponents";
interface Props {
    orientation?: 'horizontal' | 'vertical';
    groups?: ButtonToolbarGroup[];
    onbuttonclick?: (detail: {
        id: string;
        action: string;
        originalEvent: Event;
        item: ButtonToolbarItem;
    }) => void;
}
declare const ButtonToolbar: import("svelte").Component<Props, {}, "">;
type ButtonToolbar = ReturnType<typeof ButtonToolbar>;
export default ButtonToolbar;
//# sourceMappingURL=ButtonToolbar.svelte.d.ts.map