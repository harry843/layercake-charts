<!--
  @component
  Generates a hover tooltip. It creates a slot with an exposed variable via `let:detail` that contains information about the event. Use the slot to populate the body of the tooltip using the exposed variable `detail`.
 -->
 <script>
    /** @type {Object} evt - A svelte event created via [`dispatch`](https://svelte.dev/docs#createEventDispatcher) with event information under `evt.detail.e`. */
    export let evt = {};
  
    /** @type {Number} [offset=-35] - A y-offset from the hover point, in pixels. */
    export let offset = -35;
  </script>
  
  {#if evt.detail}
    <div
    class="absolute w-200 border border-ccc rounded-md text-sm bg-white transform-translate-neg-50-translate-neg-100 p-1 z-15 overflow-y-auto"
      style="
        top:{evt.detail.e.layerY + offset}px;
        left:{evt.detail.e.layerX}px;
      "
    >
      <slot detail={evt.detail}></slot>
    </div>
  {/if}