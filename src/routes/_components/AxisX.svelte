<!--
	@component
	Generates an SVG x-axis. This component is also configured to detect if your x-scale is an ordinal scale. If so, it will place the markers in the middle of the bandwidth.
 -->
<script>
	import { getContext } from 'svelte';
	import Page from '../+page.svelte';
	const { width, height, xScale, yRange } = getContext('LayerCake');

	/** @type {Boolean} [gridlines=true] - Extend lines from the ticks into the chart space */
	export let gridlines = true;

	/** @type {Boolean} [tickMarks=false] - Show a vertical mark for each tick. */
	export let tickMarks = false;

	/** @type {Boolean} [baseline=false] – Show a solid line at the bottom. */
	export let baseline = false;

	/** @type {Boolean} [snapTicks=false] - Instead of centering the text on the first and the last items, align them to the edges of the chart. */
	export let snapTicks = false;

	/** @type {Function} [formatTick=d => d] - A function that passes the current tick value and expects a nicely formatted value in return. */
	export let formatTick = (/** @type {any} */ d) => d;

	/** @type {Number|Array<String|Number>|Function|Undefined} [ticks] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */
	export let ticks = undefined;

	/** @type {Number} [xTick=0] - How far over to position the text marker. */
	export let xTick = 0;

	/** @type {Number} [yTick=16] - The distance from the baseline to place each tick value. */
	export let yTick = 25;

	export let skipXTick = false;

	/** @type {Number} [screenWidth=0] - The width of the users screen in pixels. */
	export let screenWidth = 0;

	export let customAxis = false;

	export let customAxisMaxXvalue = undefined;
	export let customAxisXTranslate = undefined;

	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $xScale.domain()
		: typeof ticks === 'function'
		? ticks($xScale.ticks())
		: $xScale.ticks(ticks);

	/** @param {number} i */
	function textAnchor(i) {
		if (snapTicks === true) {
			if (i === 0) {
				return 'start';
			}
			if (i === tickVals.length - 1) {
				return 'end';
			}
		}
		return 'middle';
	}

	function customXTranslate(tick, i, tickVals) {
		if (customAxis === true) {
			const axisLength = $xScale(customAxisMaxXvalue) + $xScale(customAxisXTranslate);
			return (i / tickVals.length) * axisLength;
		} else {
			return $xScale(tick);
		}
	}
</script>

<g class="axis x-axis" class:snapTicks>
	{#each tickVals as tick, i (tick)}
		<g
			class="tick tick-{i}"
			transform="translate({customXTranslate(tick, i, tickVals)},{Math.max(...$yRange)})"
		>
			{#if gridlines !== false}
				<line class="gridline" y1={$height * -1} y2="0" x1="0" x2="0" />
			{/if}
			{#if tickMarks === true && screenWidth >= 640 && i % 2 == 0 && skipXTick}
				<line
					class="tick-mark"
					y1={0}
					y2={6}
					x1={isBandwidth ? $xScale.bandwidth() / 2 : 0}
					x2={isBandwidth ? $xScale.bandwidth() / 2 : 0}
				/>
			{:else if tickMarks === true && screenWidth < 640 && i % 3 == 0 && skipXTick}
				<line
					class="tick-mark"
					y1={0}
					y2={6}
					x1={isBandwidth ? $xScale.bandwidth() / 2 : 0}
					x2={isBandwidth ? $xScale.bandwidth() / 2 : 0}
				/>
			{:else if !skipXTick}
				<line
					class="tick-mark"
					y1={0}
					y2={6}
					x1={isBandwidth ? $xScale.bandwidth() / 2 : 0}
					x2={isBandwidth ? $xScale.bandwidth() / 2 : 0}
				/>
			{/if}

			{#if screenWidth >= 640 && skipXTick && i % 2 == 0}
				<text
					x={isBandwidth ? $xScale.bandwidth() / 2 + xTick : xTick}
					y={yTick}
					dx=""
					dy=""
					text-anchor={textAnchor(i)}>{formatTick(tick)}</text
				>
			{:else if screenWidth < 640 && skipXTick && i % 3 == 0}
				<text
					x={isBandwidth ? $xScale.bandwidth() / 2 + xTick : xTick}
					y={yTick}
					dx=""
					dy=""
					text-anchor={textAnchor(i)}>{formatTick(tick)}</text
				>
			{:else if !skipXTick}
				<text
					x={isBandwidth ? $xScale.bandwidth() / 2 + xTick : xTick}
					y={yTick}
					dx=""
					dy=""
					text-anchor={textAnchor(i)}
					>{formatTick(tick)}
				</text>
			{/if}
		</g>

		<div class="py-2">{tick}</div>
	{/each}
	{#if baseline === true}
		<line class="baseline" y1={$height + 0.5} y2={$height + 0.5} x1="0" x2={$width} />
	{/if}
</g>

<style>
	.tick {
		font-size: 0.725em;
		font-weight: 200;
	}

	line,
	.tick line {
		stroke: #aaa;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #666;
	}

	.tick .tick-mark,
	.baseline {
		stroke-dasharray: 6;
	}
	/* This looks slightly better */
	.axis.snapTicks .tick:last-child text {
		transform: translateX(3px);
	}
	.axis.snapTicks .tick.tick-0 text {
		transform: translateX(-3px);
	}
</style>
