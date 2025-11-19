<script lang="ts">
  import { ContainerBox } from "@liwe3/webcomponents-svelte";
  import type { PopoverMenuItem, MenuPosition } from "@liwe3/webcomponents";

  let outputMessage = $state(
    "Interact with the container box to see output..."
  );
  let menuPosition: MenuPosition = $state("bottom-left");
  let alwaysShowMenu = $state(false);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    outputMessage = `[${timestamp}] ${message}`;
  };

  const menuItems: PopoverMenuItem[] = [
    { label: "Edit", onclick: () => log("Edit clicked") },
    { label: "Delete", onclick: () => log("Delete clicked") },
    { label: "---sep" },
    { label: "Properties", onclick: () => log("Properties clicked") },
  ];

  const positions: MenuPosition[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ];
</script>

<div class="demo-container">
  <header class="demo-header">
    <h1>ContainerBox Component</h1>
    <p class="subtitle">
      A container that wraps elements and shows a menu on hover
    </p>
  </header>

  <section class="demo-section">
    <h2>Interactive Demo</h2>
    <div class="controls">
      <div class="control-group">
        <label for="position-select">Menu Position:</label>
        <select id="position-select" bind:value={menuPosition}>
          {#each positions as pos}
            <option value={pos}>{pos}</option>
          {/each}
        </select>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" bind:checked={alwaysShowMenu} />
          Always Show Menu
        </label>
      </div>
    </div>

    <div class="example-area">
      <ContainerBox {menuItems} {menuPosition} {alwaysShowMenu}>
        <div class="box-content">
          <h3>Hover me!</h3>
          <p>This is the content inside the container box.</p>
        </div>
      </ContainerBox>
    </div>
  </section>

  <section class="demo-section">
    <h2>Output Console</h2>
    <div class="output-area">
      <pre>{outputMessage}</pre>
    </div>
  </section>
</div>

<style>
  .demo-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  .demo-header {
    text-align: center;
    padding: 2rem 0;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .demo-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
    margin: 0;
  }

  .demo-section {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .demo-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .controls {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .example-area {
    border: 1px dashed #ccc;
    padding: 2rem;
    display: flex;
    justify-content: center;
    background: #fafafa;
  }

  .box-content {
    width: 300px;
    height: 200px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .box-content h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .box-content p {
    margin: 0;
    color: #666;
  }

  .output-area {
    background: #e9ecef;
    border-radius: 8px;
    padding: 20px;
    min-height: 60px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 14px;
  }

  .output-area pre {
    margin: 0;
    color: #212529;
    white-space: pre-wrap;
  }
</style>
