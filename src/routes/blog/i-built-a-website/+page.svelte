<script lang="ts">
    const charts = [{
        chart: "bar"},
        {chart: "line"
    }]
</script>

<section class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <ul class="">
    {#each charts as {chart}}
        <li class="py-1.5">
            <li>
                <a href="/blog/i-built-a-website/{chart}" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">{chart}</a>
              </li>
    {/each}
</ul>    
</section>