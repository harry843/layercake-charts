<script lang="ts">
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
	import { scaleBand } from 'd3-scale';
	import { format } from 'd3-format';

	import framework_data from '../../../_data/js-framework-popularity.csv';
	import AxisX from '../../../_components/AxisX.svelte';
	import AxisY from '../../../_components/AxisY.svelte';
	import Bar from '../../../_components/Bar.svelte';
	import Annotations from '../../../_components/Annotations.html.svelte';
	import Tooltip from '../../../_components/Tooltip.html.svelte';
	import ArrowheadMarker from '../../../_components/ArrowheadMarker.svelte';
	import Arrows from '../../../_components/Arrows.svelte';

	let width = 0;
	let evt;
	let hideTooltip = false;

	$: height = width <= 400 ? 25 : 35;

	const xBar = 'value';
	const yBar = 'variable';
	const swoopiness = 5;

	$: arrowYPosition = width <= 400 ? '80%' : '84%';

	$: annotations = [
		{
			text: '1 in 32 developers have worked in Svelte',
			top: arrowYPosition,
			left: '35%',
			arrows: [
				{
					clockwise: true, // true or false, defaults to true
					source: {
						anchor: 'left-bottom', // can be `{left, middle, right},{top-middle-bottom}`
						dx: -2,
						dy: -7
					},
					target: {
						x: '14%',
						y: '90%'
					}
				}
			]
		}
	];

	framework_data.forEach((/** @type {{ [columnName: string]:  number; }} */ row) => {
		row[xBar] = +row[xBar];
	});

	function framework_sortorder(framework_data) {
		const sorted_data = framework_data.sort((a, b) => b.value - a.value);
		const variablesArray = sorted_data.map((item) => item.variable);
		return variablesArray;
	}

	const addCommas = format(',');

	const formatTickY = (d) => format(`~s`)(d);
</script>

<section id="i-built-a-website-bar" class="flex flex-col">
	<div class="chart-container" style="height: 80vh" bind:clientWidth={width}>
		{#if width > 0}
			<LayerCake
				padding={{ top: 0, bottom: 20, left: 30 }}
				x={xBar}
				y={yBar}
				yScale={scaleBand().paddingInner(0.1)}
				xDomain={[0, null]}
				yDomain={framework_sortorder(framework_data)}
				data={framework_data}
				debug={false}
			>
				<Svg zIndex={1}>
					<AxisX gridlines={false} baseline={false} tickMarks={true} formatTick={formatTickY} />
					<AxisY gridlines={false} />
					<Bar
						on:mousemove={(event) => (evt = hideTooltip = event)}
						on:mouseout={() => (hideTooltip = true)}
					/>
				</Svg>

				<Html zIndex={2} pointerEvents={false}>
					<Annotations {annotations} />
					{#if hideTooltip !== true}
						<Tooltip {evt} let:detail>
							{@const tooltipData = { ...detail.props }}

							<div class="row p-0.5">
								<span class="font-medium">{addCommas(tooltipData.percentage)}%</span> have worked in {tooltipData.variable}
							</div>
							<div class="row p-0.5">
								<span class="font-medium">{addCommas(tooltipData.value)}</span> out of 310,352 survey
								participants
							</div>
						</Tooltip>
					{/if}
				</Html>

				<Svg>
					<svelte:fragment slot="defs">
						<ArrowheadMarker />
					</svelte:fragment>
					<Arrows {annotations} {swoopiness} />
				</Svg>
			</LayerCake>
		{/if}
	</div>
	{#if width > 0}
		<div id="BarXAxisTitle" class="text-center text-xs xs:text-sm text-gray-700 -translate-y-1/2">
			Developers using it
		</div>
	{/if}
</section>

<style>
	.chart-container {
		width: 80%;
		margin: 25px auto;
		display: flex;
	}
</style>
