import type { HTMLAttributes } from 'svelte/elements';
import type { ResizableCropperElement as ResizableCropperElementType, ResizableCropperValues } from '@liwe3/webcomponents';
interface Props extends HTMLAttributes<ResizableCropperElementType> {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: string;
    disabled?: boolean;
    allowCrop?: boolean;
    allowResize?: boolean;
    onchange?: (values: ResizableCropperValues) => void;
    'onrcw:change'?: (detail: any) => void;
    'onrcw:scale-start'?: (detail: any) => void;
    'onrcw:crop-start'?: (detail: any) => void;
    'onrcw:pan-start'?: (detail: any) => void;
}
declare const ResizableCropper: import("svelte").Component<Props, {
    getValues: () => ResizableCropperValues | undefined;
    setValues: (values: Partial<ResizableCropperValues>) => void;
}, "">;
type ResizableCropper = ReturnType<typeof ResizableCropper>;
export default ResizableCropper;
//# sourceMappingURL=ResizableCropper.svelte.d.ts.map