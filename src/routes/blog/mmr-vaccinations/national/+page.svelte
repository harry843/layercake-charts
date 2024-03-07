<script lang="ts">
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';
	import { format } from 'd3-format';
	import { scaleOrdinal } from 'd3-scale';
  	import { timeParse, timeFormat } from 'd3-time-format';
	
	import data from '../../../_data/MMR_Vaccinations_London_vs_England.csv';
	import AxisX from '../../../_components/AxisX.svelte';
	import AxisY from '../../../_components/AxisY.svelte';
	import GroupLabels from '../../../_components/GroupLabels.html.svelte';
	import SharedTooltip from '../../../_components/SharedTooltip.svelte';
	import MultiLine from '../../../_components/MultiLine.svelte';

	let width = 0;

/* --------------------------------------------
 * Set what is our x key to separate it from the other series
 */
const xKey = 'Year';
const yKey = 'Vaccinated (%)';
const zKey = 'Region';

const xKeyCast = timeParse('%Y-%m-%d');

const seriesNames = Object.keys(data[0]).filter(d => d !== xKey);
const seriesColors = [{key:'London', hex:'#61dbfb'}, {key: 'The Rest of England', hex:'#4f46e5'}];

const reflineConfig = {text: "Herd Immunity (95%)", lineColour: "#22c55e", strokeDash: "10,10", value: 95}

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

const formatTooltipX = d => d.getFullYear().toString() + "-" + (d.getFullYear()+1).toString().slice(-2)
const formatTickY = d => format(`~s`)(d);
//console.log(formatTickY)

const groupedData = groupLonger(data, seriesNames, {
  groupTo: zKey,
  valueTo: yKey
});

const distinctYears: string[] = Array.from( data.map(d => d[xKey].getFullYear().toString()+"-"+ ((d[xKey].getFullYear()+1).toString()).slice(-2)))
//console.log(data.map(d => d[xKey].getFullYear().toString()+"-"+ ((d[xKey].getFullYear()+1).toString()).slice(-2)))

const maxDate = new Date(Math.max(...data.map(d => d[xKey])));
const secondSmallestDate = data.map(d => d[xKey]).sort((a, b) => a - b)[1]
</script>

<section id="mmr-london-vs-england" class="flex flex-col">
<div class="flex flex-row relative" bind:clientWidth={width}>
<div id="LineYAxisTitle" class="absolute origin-top-left -rotate-90 items-center justify-center text-center text-xs sm:text-sm text-gray-700 translate-y-72 left-1 xxs:left-2 xs:left-4 sm:left-6 md:left-8 lg:left-20 xl:left-24 2xl:left-32">Percentage of Children Vaccinated</div>
<div class="chart-container" style="height: 80vh" bind:clientWidth={width}>
{#if width > 0}
	<LayerCake
    padding={{ top: 45, right: 10, bottom: 0, left: 25 }}
    x={xKey}
    y={yKey}
    z={zKey}
    yDomain={[60, null]}
    zScale={scaleOrdinal()}
    zRange={seriesColors.map(color => color.hex)}
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
        skipXTick={true}
        screenWidth={width}
      />
      <AxisY
        ticks={[60, 70, 80, 90, 100]}
        formatTick={formatTickY}
        units={"%"}
        dxTick={-10}
        skipYTick={true}
        refline={true}
        {reflineConfig}
      />
      <MultiLine />
    </Svg>

    <Html>
      <GroupLabels width={60}/>
      <SharedTooltip
        formatTitle={formatTooltipX}
        tooltipWidth={252}
        dataset={data}
        offset={198}
        bold={true}
        keyColours={seriesColors}
        units={"% vaccinated"}
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
