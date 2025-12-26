import type { TreeNode } from "@liwe3/webcomponents";
interface Props {
    data?: TreeNode[];
    indentWidth?: number;
    selectedIds?: string[];
    onselectionchange?: (selectedIds: string[]) => void;
    ontoggle?: (event: CustomEvent<{
        nodeId: string;
        expanded: boolean;
    }>) => void;
    onitemselected?: (event: CustomEvent<{
        node: TreeNode;
        nodeId: string;
    }>) => void;
}
declare const TreeView: import("svelte").Component<Props, {
    /**
       * Expose methods to parent component
       */ toggleExpansion: (nodeId: string) => void;
    toggleSelection: (nodeId: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    expandAll: () => void;
    collapseAll: () => void;
}, "data" | "selectedIds">;
type TreeView = ReturnType<typeof TreeView>;
export default TreeView;
//# sourceMappingURL=TreeView.svelte.d.ts.map