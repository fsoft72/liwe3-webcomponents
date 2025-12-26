# PopoverMenu Component

A menu component with support for nested submenus and fixed positioning.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px; height: 200px; display: flex; align-items: center; justify-content: center;">
  <button id="demo-popover-trigger">Open Menu</button>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('demo-popover-trigger');
    let menu = null;

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        customElements.whenDefined('liwe3-popover-menu').then(() => {
          if (menu) {
            menu.remove();
            menu = null;
            return;
          }

          menu = document.createElement('liwe3-popover-menu');
          document.body.appendChild(menu);
          
          const items = [
            { label: 'Option 1', onclick: () => alert('Option 1') },
            { label: 'Option 2', onclick: () => alert('Option 2') },
            { label: '---sep' },
            { label: 'Submenu', items: [
                { label: 'Sub 1', onclick: () => alert('Sub 1') },
                { label: 'Sub 2', onclick: () => alert('Sub 2') }
              ]
            }
          ];
          
          menu.show(e.clientX, e.clientY, items);
          
          const closeHandler = (ev) => {
            if (menu && !menu.contains(ev.target) && ev.target !== trigger) {
              menu.remove();
              menu = null;
              document.removeEventListener('click', closeHandler);
            }
          };
          setTimeout(() => document.addEventListener('click', closeHandler), 0);
        });
      });
    }
  });
</script>

## Usage

```javascript
const menu = document.createElement('liwe3-popover-menu');
document.body.appendChild(menu);
menu.show(x, y, items);
```
