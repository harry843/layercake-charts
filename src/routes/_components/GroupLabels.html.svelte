<!--
  @component
  Generates HTML text labels for a nested data structure. It places the label near the y-value of the highest x-valued data point. This is useful for labeling the final point in a multi-series line chart, for example. It expects your data to be an array of objects where each has `values` field that is an array of data objects. It uses the `z` field accessor to pull the text label.
 -->
<script>
	import { getContext } from 'svelte';
	import { max } from 'd3-array';
	import classNames from 'classnames';

	export let width = 20;

	const { data, x, y, xScale, yScale, xRange, yRange, z } = getContext('LayerCake');

	/* --------------------------------------------
	 * Title case the first letter
	 */
	const cap = (val) => val.replace(/^\w/, (d) => d.toUpperCase());

	/* --------------------------------------------
	 * Put the label on the highest value
	 */
	$: left = (values) => $xScale(max(values, $x)) / Math.max(...$xRange);
	$: top = (values) => $yScale(max(values, $y)) / Math.max(...$yRange);
</script>

{#each $data as group}
	<div
		class={classNames(
			`absolute -translate-x-full -translate-y-full text-sm w-${width}`,
			{ 'translate-y-10 sm:y-translate-20': group.Framework === 'React' },
			{
				'-translate-x-[100px] xs:-translate-x-[150px] sm:-translate-x-[250px] md:-translate-x-[300px] lg:-translate-x-[350px] xl:-translate-x-[460px] translate-y-9 text-xs lg:text-sm w-32':
					group.Region === 'London'
			},
			{
				'-translate-x-[100px] xs:-translate-x-[150px] sm:-translate-x-[250px] md:-translate-x-[300px] lg:-translate-x-[350px] xl:-translate-x-[460px] translate-y-6 text-xs lg:text-sm w-40 sm:w-52':
					group.Region === 'The Rest of England'
			}
		)}
		style="
        top:{top(group.values) * 100}%;
        left:{left(group.values) * 100}%;
      "
	>
		{cap($z(group))}
	</div>
{/each}
