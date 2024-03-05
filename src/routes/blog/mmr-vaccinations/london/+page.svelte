<script>
	import { LayerCake, Svg, Html } from 'layercake';
	import { feature } from 'topojson-client';
	import { geoIdentity } from 'd3-geo';
	import { scaleQuantize } from 'd3-scale';
	import { format } from 'd3-format';
	import classNames from 'classnames';


	import MapSvg from '../../../_components/Map.svg.svelte';
	import Tooltip from '../../../_components/Tooltip.html.svelte';

	// This example loads json data as json using @rollup/plugin-json
	import londonBoroughs from '../../../_data/london-boroughs_1179.json';
	import mmrData from '../../../_data/london-boroughs-mmr-uptake.json';
	import Annotations from '../../../_components/Annotations.html.svelte';
	import ArrowheadMarker from '../../../_components/ArrowheadMarker.svelte';
	import Arrows from '../../../_components/Arrows.svelte';

	let width = 0;

	$: annotations = [
		{
			text: 'Hackney has the lowest vaccination rates in London',
			top: '108%',
			right: '34%',
			arrows: [
				{
					clockwise: true, // true or false, defaults to true
					source: {
						anchor: 'middle-middle', // can be `{left, middle, right},{top-middle-bottom}`
						dx: -21,
						dy: -21
					},
					target: {
						x: '53.5%',
						y: '37%'
					}
				}
			]
		}
	];
	const swoopiness = 10

	const colorKey = 'Percentage of Total';

	/* --------------------------------------------
	 * Create lookups to more easily join our data
	 * `dataJoinKey` is the name of the field in the data
	 * `mapJoinKey` is the name of the field in the map file
	 */
	const dataJoinKey = 'name';
	const mapJoinKey = 'name';
	const dataLookup = new Map();

	const geojson = feature(londonBoroughs, londonBoroughs.objects.london_boroughs);
	const projection = geoIdentity;

	mmrData.forEach((d) => {
		dataLookup.set(d[dataJoinKey], d);
	});

	let evt;
	let hideTooltip = true;

	// Create a flat array of objects that LayerCake can use to measure
	// extents for the color scale
	const flatData = geojson.features.map((d) => d.properties);
	// const colors = ['#fb7185', '#fff1f2', '#f9fafb', '#eef2ff', '#c7d2fe', '#818cf8']
	const colors = ['#e11d48', '#fda4af', '#fff1f2', '#eef2ff', '#e0e7ff', '#a5b4fc'];

	const addCommas = format(',');
	// console.log("FlatData",flatData);
	// flatData.forEach((d) => {console.log(dataLookup.get(d[dataJoinKey])) })
</script>

<section bind:clientWidth={width}>
	{#if width > 0}
		<div>
			<h1 class="text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-center pt-4">
				London: 2-year olds vaccinated against measles in 2023
			</h1>
		</div>

		<div class={classNames("absolute right-0 mr-auto ml-auto w-32 -translate-x-1 sm:-translate-x-[15%]", {"bottom-0": width<580})}>
			<h2 class="flex flex-row justify-center text-[0.575rem] sm:text-xs font-medium w-32 py-1">
				Vaccination Rate
			</h2>
			<div class="flex flex-row justify-center h-3 sm:h-4 w-32">
				<div
					class="bg-[#e11d48] border border-[#e11d48] border-r-[#f43f5e] w-3 sm:w-4 h-3 sm:h-4 text-[0.5rem] sm:text-xs"
				>
					<p class="translate-y-3 sm:translate-y-4">65%</p>
				</div>
				<div
					class="bg-[#fda4af] border border-[#fda4af] border-r-[#fda4af] w-3 sm:w-4 h-3 sm:h-4 text-xs"
				/>
				<div
					class="bg-[#fff1f2] border border-[#fff1f2] border-r-[#e5e7eb] w-3 sm:w-4 h-3 sm:h-4 text-xs"
				/>
				<div
					class="bg-[#eef2ff] border border-[#eef2ff] border-r-[#c7d2fe] w-3 sm:w-4 h-3 sm:h-4 text-xs"
				/>
				<div
					class="bg-[#e0e7ff] border border-[#e0e7ff] border-r-[#c7d2fe] w-3 sm:w-4 h-3 sm:h-4 text-xs"
				/>
				<div class="bg-[#a5b4fc] w-3 sm:w-4 h-3 sm:h-4 text-[0.5rem] sm:text-xs">
					<p class="translate-y-3 sm:translate-y-4 sm:translate-x-1">90%</p>
				</div>
			</div>
		</div>

		<div
			id="london-map"
			class="chart-container h-[30vh] xxs:h-[36vh] xs:h-[46vh] sm:h-[60vh] md:h-[67vh] lg:h-[76vh] xl:h-[82vh]"
		>
			<LayerCake
				data={geojson}
				z={(d) => dataLookup.get(d[mapJoinKey])[colorKey]}
				zScale={scaleQuantize()}
				zRange={colors}
				{flatData}
			>
				<Svg>
					<MapSvg
						{projection}
						reflectY={true}
						on:mousemove={(event) => (evt = hideTooltip = event)}
						on:mouseout={() => (hideTooltip = true)}
					/>
					<Arrows {annotations} {swoopiness} />
					<svelte:fragment slot="defs">
						<ArrowheadMarker size={10} />
					</svelte:fragment>
				</Svg>

				<Html pointerEvents={false}>
					<Annotations {annotations} />

					{#if hideTooltip !== true}
						<Tooltip {evt} let:detail>
							<!-- For the tooltip, do another data join because the hover event only has the data from the geography data -->
							{@const tooltipData = { ...detail.props, ...dataLookup.get(detail.props['name']) }}
							{#each Object.entries(tooltipData) as [key, value]}
								{#if ['name', 'Children Vaccinated', 'Percentage of Total'].includes(key)}
									{@const keyCapitalized = key.replace(/^\w/, (d) => d.toUpperCase())}
									<div class="row">
										<span class="text-xs"
											>{keyCapitalized === 'Name' ? 'Borough' : keyCapitalized}:</span
										>
										<span class="text-xs font-medium"
											>{typeof value === 'number' && value >= 1000
												? addCommas(value)
												: typeof value === 'number' && key.includes('Percentage')
												? value + '%'
												: value}</span
										>
									</div>
								{/if}
							{/each}
						</Tooltip>
					{/if}
				</Html>
			</LayerCake>
		</div>
	{/if}
</section>

<style>
	/*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
	.chart-container {
		width: 80%;
	}
</style>
