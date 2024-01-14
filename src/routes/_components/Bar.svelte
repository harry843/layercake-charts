 <script lang="ts">
    import { createEventDispatcher, getContext } from 'svelte';
	import { raise } from 'layercake';

    const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');
  
    // /** @type {String} [fill='#00bbff'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
    // export let fill = "#00bbff";

    $: fillColor = (variable: string) => {
        if (variable === 'Svelte') {
            return "#aa1e1e"
        }
        else {
            return "#cbd5e1"
        };
    }

    const dispatch = createEventDispatcher();
        
        function handleMousemove(feature) {
          return function handleMousemoveFn(e) {
            raise(this);
            // When the element gets raised, it flashes 0,0 for a second so skip that
            if (e.layerX !== 0 && e.layerY !== 0) {
              dispatch("mousemove", { e, props: feature.properties });
            }
          };
        }

  </script>
  
  <g class="bar-group" role="figure" on:mouseout={(e) => dispatch("mouseout")}
    on:blur={(e) => dispatch("mouseout")}>
    {#each $data as d, i}
      <rect
        class='group-rect'
        data-id="{i}"
        x="{$xScale.range()[0]}"
        y="{$yGet(d)}"
        height={$yScale.bandwidth() / 1.05}
        width="{$xGet(d)}"
        fill={fillColor(d.variable)}
        role="tooltip"
        aria-label="Hover"
        on:mouseover={(e) => dispatch("mousemove", { e, props: d })}
        on:focus={(e) => dispatch("mousemove", { e, props: d })}
        on:mousemove={() => handleMousemove(d)}
        
      ></rect>
    {/each}
    
  </g>
 