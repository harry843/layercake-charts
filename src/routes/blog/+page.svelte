<script lang="ts">
    const slugs = [{
        slug: "i-built-a-website"
    }]
</script>

<section class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <ul>
    {#each slugs as {slug}}
            <li>
                <a href="/blog/{slug}" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">{slug}</a>
              </li>
    {/each}
</ul>    
</section>