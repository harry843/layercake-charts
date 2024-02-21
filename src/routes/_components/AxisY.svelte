<!--
	@component
	Generates an SVG y-axis. This component is also configured to detect if your y-scale is an ordinal scale. If so, it will place the markers in the middle of the bandwidth.
 -->
<script>
	import { getContext } from 'svelte';

	const { padding, xRange, yScale } = getContext('LayerCake');

	/** @type {Boolean} [gridlines=true] - Extend lines from the ticks into the chart space */
	export let gridlines = true;

	/** @type {Boolean} [refline=false] - Extend lines from the ticks into the chart space */
	export let refline = false;

	export let reflineConfig = undefined;

	/** @type {Boolean} [tickMarks=false] - Show a vertical mark for each tick. */
	export let tickMarks = false;

	/** @type {Function} [formatTick=d => d] - A function that passes the current tick value and expects a nicely formatted value in return. */
	export let formatTick = (/** @type {any} */ d) => d;

	/** @type {Number|Array<String|Number>|Function} [ticks=4] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. */
	export let ticks = 4;

	/** @type {Number} [xTick=0] - How far over to position the text marker. */
	export let xTick = 0;

	/** @type {Number} [yTick=0] - How far up and down to position the text marker. */
	export let yTick = 0;

	/** @type {Number} [dxTick=0] - Any optional value passed to the `dx` attribute on the text marker and tick mark (if visible). This is ignored on the text marker if your scale is ordinal. */
	export let dxTick = 0;

	/** @type {Number} [dyTick=-4] - Any optional value passed to the `dy` attribute on the text marker and tick mark (if visible). This is ignored on the text marker if your scale is ordinal. */
	export let dyTick = -4;

	/** @type {String} [textAnchor='start'] The CSS `text-anchor` passed to the label. This is automatically set to "end" if the scale has a bandwidth method, like in ordinal scales. */
	export let textAnchor = 'start';

	/** @type {String} [units=''] The units passed to the y-axis labels. */
	export let units = '';

	export let skipYTick = false;

	$: isBandwidth = typeof $yScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $yScale.domain()
		: typeof ticks === 'function'
		? ticks($yScale.ticks())
		: $yScale.ticks(ticks);
	$: console.log(tickVals);
</script>

<g class="axis y-axis" transform="translate({-$padding.left}, 0)">
	{#each tickVals as tick, index (tick)}
		<g
			class="tick tick-{tick}"
			transform="translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {$yScale(tick)})"
		>
			{#if gridlines !== false}
				<line
					class="gridline"
					x2="100%"
					y1={isBandwidth ? $yScale.bandwidth() / 2 : 0}
					y2={isBandwidth ? $yScale.bandwidth() / 2 : 0}
				/>
			{/if}
			{#if tickMarks === true}
				<line
					class=""
					x1="0"
					x2={isBandwidth ? -6 : 6}
					y1={isBandwidth ? $yScale.bandwidth() / 2 : 0}
					y2={isBandwidth ? $yScale.bandwidth() / 2 : 0}
				/>
			{/if}
			{#if skipYTick && index % 2 == 0}
				<text
					class={tick === 'Svelte'
						? 'font-bold text-xs xxs:text-sm md:text-base'
						: typeof tick === 'string'
						? 'text-xs xxs:text-sm md:text-base font-regular'
						: 'text-xs xs:text-sm text-gray-700'}
					x={xTick}
					y={isBandwidth ? $yScale.bandwidth() / 2 + yTick : yTick}
					dx={isBandwidth ? -9 : dxTick}
					dy={isBandwidth ? 4 : dyTick}
					style="text-anchor:{isBandwidth ? 'end' : textAnchor};">{formatTick(tick)}{units}</text
				>
			{:else if !skipYTick}
				<text
					class={tick === 'Svelte'
						? 'font-bold text-xs xxs:text-sm md:text-base'
						: typeof tick === 'string'
						? 'text-xs xxs:text-sm md:text-base font-regular'
						: 'text-xs xs:text-sm text-gray-700'}
					x={xTick}
					y={isBandwidth ? $yScale.bandwidth() / 2 + yTick : yTick}
					dx={isBandwidth ? -9 : dxTick}
					dy={isBandwidth ? 4 : dyTick}
					style="text-anchor:{isBandwidth ? 'end' : textAnchor};">{formatTick(tick)}{units}</text
				>
			{/if}
		</g>
	{/each}
	{#if refline}
		<g
			transform="translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {$yScale(reflineConfig.value)})"
			><line stroke={reflineConfig.lineColour} stroke-dasharray={reflineConfig.strokeDash} x2="100%" />
			<text class="-translate-y-2 translate-x-1/4">{reflineConfig.text}</text>
		</g>
	{/if}
</g>

<style>
	.tick {
		font-size: 1em;
		font-weight: 400;
	}

	.tick line {
		stroke: #aaa;
	}
	.tick .gridline {
		stroke-dasharray: 1;
		stroke: #e2e8f0;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
</style>
