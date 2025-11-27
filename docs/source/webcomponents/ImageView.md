# ImageView Component

An image viewer component with support for various display modes, positioning, and visual effects.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <div style="margin-bottom: 10px;">
    <label>Effect: 
      <select onchange="document.getElementById('demo-image').setAttribute('fx', this.value)">
        <option value="none">None</option>
        <option value="bokeh">Bokeh</option>
        <option value="zoom-in">Zoom In</option>
        <option value="zoom-out">Zoom Out</option>
        <option value="pan-left">Pan Left</option>
        <option value="pan-right">Pan Right</option>
      </select>
    </label>
    <label>Hover Effect: 
      <select onchange="document.getElementById('demo-image').setAttribute('fx-hover', this.value)">
        <option value="none">None</option>
        <option value="bokeh">Bokeh</option>
        <option value="zoom-in" selected>Zoom In</option>
      </select>
    </label>
  </div>

  <liwe3-image-view
    id="demo-image"
    src="https://picsum.photos/800/400"
    width="100%"
    height="300px"
    mode="cover"
    fx-hover="zoom-in"
  ></liwe3-image-view>
</div>

## Usage

```html
<liwe3-image-view
  src="image.jpg"
  width="300px"
  height="200px"
  mode="cover"
  fx="zoom-in"
></liwe3-image-view>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | `string` | `""` | The source URL of the image. |
| `width` | `string` | `"100%"` | Width of the component. |
| `height` | `string` | `"auto"` | Height of the component. |
| `mode` | `ImageMode` | `"cover"` | How the image should fit the container. |
| `position` | `ImagePosition` | `"center"` | Alignment of the image within the container. |
| `fx` | `ImageFX` | `"none"` | Visual effect to apply always. |
| `fx-hover` | `ImageFX` | `"none"` | Visual effect to apply on hover. |
| `alt` | `string` | `""` | Alt text for the image. |

### ImageMode

Values: `'stretch'`, `'1:1'`, `'cover'`, `'contain'`

### ImagePosition

Values: `'center'`, `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`

### ImageFX

Values: `'none'`, `'bokeh'` (blur), `'pan-left'`, `'pan-right'`, `'zoom-in'`, `'zoom-out'`

## Styling

The component is self-contained but respects the dimensions set via attributes or CSS.

```css
liwe3-image-view {
  display: block;
  /* Width and height can be controlled via CSS or attributes */
}
```
