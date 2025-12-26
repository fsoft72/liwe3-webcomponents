import type { HTMLAttributes } from 'svelte/elements';
import type { CheckListElement as CheckListElementType, CheckListItem } from '@liwe3/webcomponents';
interface Props extends HTMLAttributes<CheckListElementType> {
    title?: string;
    items?: CheckListItem[];
    onchange?: (items: CheckListItem[]) => void;
}
declare const CheckList: import("svelte").Component<Props, {}, "">;
type CheckList = ReturnType<typeof CheckList>;
export default CheckList;
//# sourceMappingURL=CheckList.svelte.d.ts.map