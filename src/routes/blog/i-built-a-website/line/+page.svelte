<script lang="ts">
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
	import { format } from 'd3-format';
	import { scaleOrdinal } from 'd3-scale';
  	import { timeParse, timeFormat } from 'd3-time-format';
	
	import data from '../../../_data/stackoverflow-posts-by-framework.csv';
	import AxisX from '../../../_components/AxisX.svelte';
	import AxisY from '../../../_components/AxisY.svelte';
	import GroupLabels from '../../../_components/GroupLabels.html.svelte';
	import SharedTooltip from '../../../_components/SharedTooltip.svelte';
	import MultiLine from '../../../_components/MultiLine.svelte';

	let width = 0;

/* --------------------------------------------
 * Set what is our x key to separate it from the other series
 */
const xKey = 'Date';
const yKey = 'Posts';
const zKey = 'Framework';

const xKeyCast = timeParse('%Y-%m-%d');

const seriesNames = Object.keys(data[0]).filter(d => d !== xKey);
const seriesColors = ['#61dbfb', '#aa1e1e'];

/* --------------------------------------------
 * Cast values
 */
data.forEach(d => {
  d[xKey] = typeof d[xKey] === 'string'
	? xKeyCast(d[xKey])
	: d[xKey];

  seriesNames.forEach(name => {
	d[name] = +d[name];
  });
});

const formatTooltipX = timeFormat('%B %Y');
const formatTickY = d => format(`~s`)(d);

const groupedData = groupLonger(data, seriesNames, {
  groupTo: zKey,
  valueTo: yKey
});

const distinctYears: number[] = Array.from( new Set(data.map(d => new Date(d[xKey]).getFullYear())))

const maxDate = new Date(Math.max(...data.map(d => d[xKey])));
const secondSmallestDate = data.map(d => d[xKey]).sort((a, b) => a - b)[1]
</script>

<section id="i-built-a-website-line" class="flex flex-col">
<div class="flex flex-row relative" bind:clientWidth={width}>
<div id="LineYAxisTitle" class="absolute origin-top-left -rotate-90 items-center justify-center text-center text-xs text-gray-700 translate-y-72 left-1 xxs:left-2 xs:left-4 sm:left-6 md:left-8 lg:left-20 xl:left-24 2xl:left-32">Number of StackOverflow Posts</div>
<div class="chart-container" style="height: 80vh" bind:clientWidth={width}>
{#if width > 0}
	<LayerCake
    padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
    x={xKey}
    y={yKey}
    z={zKey}
    yDomain={[0, null]}
    zScale={scaleOrdinal()}
    zRange={seriesColors}
    flatData={flatten(groupedData, 'values')}
    data={groupedData}
  >
    <Svg>
      <AxisX
        gridlines={false}
        ticks={distinctYears}
        tickMarks={true}
		customAxis={true}
		customAxisMaxXvalue={maxDate}
		customAxisXTranslate={secondSmallestDate}
      />
      <AxisY
        ticks={4}
        formatTick={formatTickY}
      />
      <MultiLine />
    </Svg>

    <Html>
      <GroupLabels />
      <SharedTooltip
        formatTitle={formatTooltipX}
        dataset={data}
        offset={120}
      />
    </Html>
  </LayerCake>
  {/if}
</div>
</div>
</section>
<style>
	.chart-container {
		width: 80%;
		margin: 25px auto;
		display:flex;
	}
	

</style>
