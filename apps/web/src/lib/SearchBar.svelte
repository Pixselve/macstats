<script lang="ts">
    let searchResults = [];
    let search = "";
    let searchTimeout = null;
    let loading = true;
    let isFocused = false;

    function searchCity() {
        loading = true;
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(async () => {
            if (search.length === 0) {
                searchResults = [];
                loading = false;
                return;
            }
            const {results} = await fetch(`/api/search?q=${search}`).then(res => res.json())
            searchResults = results;
            loading = false;
        }, 500);
    }

    function handleFocusOut() {
        setTimeout(() => {
            isFocused = false;
        }, 100);
    }

    function resetSearch() {
        search = "";
        searchResults = [];
    }
</script>



<div class="relative" >
    <input on:focusin={() => isFocused = true}  on:focusout={handleFocusOut}  on:input={searchCity} bind:value={search} type="text" placeholder="Rechercher une ville.."
           class="input input-bordered w-full"/>
    {#if isFocused && search.length > 0}
        <div class="absolute w-full bg-white shadow-xl border rounded-lg overflow-hidden mt-2 z-50">
            {#if loading}
                <div class="p-4">
                    <div class="">Chargement...</div>
                </div>
            {:else}

                {#if searchResults.length === 0}
                    <div class="p-4">
                        <div class="">Aucun résultat</div>
                    </div>
                {:else}

                    <ul>
                        {#each searchResults as result}
                            <li>
                                <a on:click={resetSearch} class="py-2 px-4 hover:bg-neutral hover:text-base-100 block" href={`/city/${result}`}>{result}</a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            {/if}
        </div>
    {/if}
</div>
