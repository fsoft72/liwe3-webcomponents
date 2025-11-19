<script lang="ts">
  import { Drawer } from "@liwe3/webcomponents-svelte";

  type DrawerState = "expanded" | "shrunk" | "closed";

  let basicState = $state<DrawerState>("expanded");
  let controlledState = $state<DrawerState>("expanded");
  let verticalState = $state<DrawerState>("shrunk");
  let sidebarState = $state<DrawerState>("shrunk");
  let showSidebarTitle = $state(true);

  let controlledDrawerRef: any;

  interface StateEntry {
    oldState: DrawerState;
    newState: DrawerState;
    timestamp: string;
  }

  let controlledHistory = $state<StateEntry[]>([]);

  const handleStateChange = (
    event: CustomEvent<{ oldState: DrawerState; newState: DrawerState }>
  ) => {
    controlledHistory = [
      {
        oldState: event.detail.oldState,
        newState: event.detail.newState,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...controlledHistory,
    ].slice(0, 5);
  };

  const expandControlled = () => {
    controlledDrawerRef?.expand();
  };

  const shrinkControlled = () => {
    controlledDrawerRef?.shrink();
  };

  const toggleControlled = () => {
    controlledDrawerRef?.toggle();
  };

  const resetControlled = () => {
    controlledState = "expanded";
    controlledDrawerRef?.expand();
  };

  const toggleSidebar = () => {
    sidebarState = sidebarState === "expanded" ? "shrunk" : "expanded";
  };

  const verticalMilestones = [
    {
      title: "Daily standup",
      time: "09:30",
      owner: "Product",
      status: "Synced",
    },
    {
      title: "Design handoff",
      time: "11:00",
      owner: "Design",
      status: "Ready",
    },
    {
      title: "QA window",
      time: "14:00",
      owner: "Quality",
      status: "Active",
    },
    {
      title: "Release review",
      time: "17:00",
      owner: "Engineering",
      status: "Scheduled",
    },
  ];

  const quickFilters = [
    "Blocked tasks",
    "Needs review",
    "Recently updated",
    "Watched repos",
  ];
</script>

<div class="page-container">
  <h1>Drawer Component Demo</h1>
  <p class="subtitle">
    Flexible off-canvas container that can expand, shrink, or hide content while
    keeping controls accessible
  </p>

  <section class="demo-section">
    <h2>Basic Horizontal Drawer</h2>
    <p>
      The drawer exposes a compact handle with customizable icon, title, and
      smooth expand/shrink transitions.
    </p>

    <div class="demo-box">
      <Drawer
        bind:state={basicState}
        title="Project Overview"
        icon="📁"
        contentPadding="20px"
        style="--drawer-horizontal-size: 520px;"
      >
        <div class="drawer-content-block">
          <h3>Mobile Banking Revamp</h3>
          <ul>
            <li>✅ User research completed</li>
            <li>⚙️ API layer refactor in progress</li>
            <li>🎨 Visual refresh scheduled for sprint 28</li>
          </ul>
          <p>
            Use the hamburger button to collapse the drawer without losing
            context. The title remains visible when shrunk if desired.
          </p>
        </div>
      </Drawer>

      <div class="output">
        <strong>Current state:</strong>
        <span class={`state-pill ${basicState}`}>{basicState}</span>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2>Programmatic Control & Events</h2>
    <p>
      Imperatively call <code>expand</code>, <code>shrink</code>, or
      <code>toggle</code> via the Svelte wrapper. Listen to
      <code>drawer-state-change</code> for analytics or UI sync.
    </p>

    <div class="demo-box control-grid">
      <div class="control-panel">
        <div class="control-buttons">
          <button onclick={expandControlled}>Expand</button>
          <button onclick={shrinkControlled}>Shrink</button>
          <button onclick={toggleControlled}>Toggle</button>
          <button onclick={resetControlled}>Reset</button>
        </div>

        <div class="history">
          <h3>Recent transitions</h3>
          {#if controlledHistory.length === 0}
            <p>No transitions yet.</p>
          {:else}
            <ul>
              {#each controlledHistory as entry}
                <li>
                  <span class="history-time">{entry.timestamp}</span>
                  <span class="history-state">
                    {entry.oldState} → {entry.newState}
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>

      <div class="control-preview">
        <Drawer
          bind:this={controlledDrawerRef}
          bind:state={controlledState}
          title="Realtime Insights"
          icon="📊"
          contentPadding="22px"
          showTitleWhenShrunk
          onstatechange={handleStateChange}
          style="--drawer-horizontal-size: 420px;"
        >
          <div class="stats-grid">
            <div>
              <p class="stat-label">Deploys</p>
              <p class="stat-value">6 today</p>
            </div>
            <div>
              <p class="stat-label">Latency</p>
              <p class="stat-value">183 ms</p>
            </div>
            <div>
              <p class="stat-label">Incidents</p>
              <p class="stat-value">0 open</p>
            </div>
          </div>
          <p class="drawer-note">
            Shrink the drawer to keep KPIs visible while saving screen estate.
          </p>
        </Drawer>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2>Vertical Drawer (Bottom Sheet)</h2>
    <p>
      Switch to <code>direction="vertical"</code> to anchor the drawer to the bottom
      of the viewport for mobile-friendly workflows.
    </p>

    <div class="demo-box vertical-box">
      <Drawer
        direction="vertical"
        bind:state={verticalState}
        title="Team Timeline"
        icon="🗓️"
        contentPadding="16px"
        showTitleWhenShrunk
        style="--drawer-vertical-size: 320px; --drawer-vertical-shrunk-size: 72px;"
      >
        <ol class="timeline">
          {#each verticalMilestones as milestone}
            <li>
              <span class="time">{milestone.time}</span>
              <div>
                <p class="title">{milestone.title}</p>
                <p class="meta">{milestone.owner} • {milestone.status}</p>
              </div>
            </li>
          {/each}
        </ol>
      </Drawer>

      <div class="output">
        <strong>Current state:</strong>
        <span class={`state-pill ${verticalState}`}>{verticalState}</span>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2>Compact Sidebar Mode</h2>
    <p>
      Hide the toggle button and pin a slim info rail for dashboards. Titles can
      remain visible even when the drawer is shrunk.
    </p>

    <div class="demo-box sidebar-box">
      <div class="sidebar-controls">
        <label>
          <input type="checkbox" bind:checked={showSidebarTitle} />
          Show title when shrunk
        </label>
        <button onclick={toggleSidebar}>
          {sidebarState === "expanded" ? "Shrink sidebar" : "Expand sidebar"}
        </button>
      </div>

      <Drawer
        bind:state={sidebarState}
        title="Quick Filters"
        icon="🎯"
        contentPadding="18px"
        showToggleButton={false}
        showTitleWhenShrunk={showSidebarTitle}
        style="--drawer-horizontal-size: 280px; --drawer-horizontal-shrunk-size: 58px;"
      >
        <div class="filters">
          {#each quickFilters as filter}
            <label>
              <input type="checkbox" checked />
              {filter}
            </label>
          {/each}
          <button class="apply">Apply filters</button>
        </div>
      </Drawer>
    </div>
  </section>
</div>

<style>
  .page-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .subtitle {
    font-size: 1.1rem;
    color: #626262;
    margin-bottom: 2.5rem;
  }

  .demo-section {
    margin-bottom: 3rem;
  }

  .demo-section h2 {
    margin-bottom: 0.4rem;
    color: #222;
  }

  .demo-section p {
    color: #5c5c5c;
    margin-bottom: 1.2rem;
  }

  .demo-box {
    background: #f8f9fb;
    border: 1px solid #e2e6ef;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .drawer-content-block ul {
    padding-left: 1.2rem;
  }

  .drawer-content-block li {
    margin-bottom: 0.3rem;
  }

  .output {
    margin-top: 1rem;
    padding: 0.8rem 1rem;
    background: white;
    border: 1px solid #dde1eb;
    border-radius: 8px;
    font-size: 0.95rem;
  }

  .state-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 92px;
    margin-left: 0.4rem;
    padding: 0.2rem 0.8rem;
    border-radius: 999px;
    text-transform: capitalize;
    font-weight: 600;
  }

  .state-pill.expanded {
    background: #dcfce7;
    color: #166534;
  }

  .state-pill.shrunk {
    background: #fee2e2;
    color: #b91c1c;
  }

  .state-pill.closed {
    background: #e2e8f0;
    color: #475569;
  }

  .control-grid {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 2fr;
    gap: 1.5rem;
  }

  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .control-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .control-buttons button,
  .sidebar-controls button,
  .filters .apply {
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1.1rem;
    font-weight: 600;
    cursor: pointer;
    background: #2563eb;
    color: white;
    transition: background 0.2s ease;
  }

  .control-buttons button:hover,
  .sidebar-controls button:hover,
  .filters .apply:hover {
    background: #1d4ed8;
  }

  .control-buttons button:nth-child(2) {
    background: #475569;
  }

  .control-buttons button:nth-child(2):hover {
    background: #334155;
  }

  .control-buttons button:nth-child(3) {
    background: #0f766e;
  }

  .control-buttons button:nth-child(3):hover {
    background: #0d5f58;
  }

  .control-buttons button:nth-child(4) {
    background: #9333ea;
  }

  .control-buttons button:nth-child(4):hover {
    background: #7e22ce;
  }

  .history {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .history h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  .history ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .history li {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #374151;
  }

  .history-time {
    font-weight: 600;
    color: #111827;
  }

  .history-state {
    font-family: "Monaco", "Menlo", monospace;
  }

  .control-preview :global(liwe3-drawer),
  .sidebar-box :global(liwe3-drawer),
  .demo-box :global(liwe3-drawer) {
    display: block;
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat-label {
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.2rem;
    letter-spacing: 0.04em;
  }

  .stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .drawer-note {
    margin: 0;
    color: #475569;
  }

  .vertical-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .timeline {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .timeline li {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0.4rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .timeline li:last-child {
    border-bottom: none;
  }

  .timeline .time {
    font-family: "Monaco", "Menlo", monospace;
    font-weight: 600;
    color: #0f172a;
    width: 70px;
  }

  .timeline .title {
    font-weight: 600;
    margin: 0;
    color: #111827;
  }

  .timeline .meta {
    margin: 0;
    color: #6b7280;
    font-size: 0.85rem;
  }

  .sidebar-box {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .sidebar-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .sidebar-controls label {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-weight: 500;
    color: #1f2937;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .filters label {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .filters input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  .filters .apply {
    margin-top: 0.5rem;
    align-self: flex-start;
  }

  @media (max-width: 900px) {
    .control-grid,
    .sidebar-box {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 560px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .control-buttons {
      flex-direction: column;
    }
  }
</style>
