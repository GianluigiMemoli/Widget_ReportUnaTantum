<script>
    import DataSelector from "./DataSelector.svelte"
    export let currentZoom ;
    let dataTable;

    let inquinanti;
    let dataToShow;
    function makeTable(e){

        let payload = e.detail;
        inquinanti = e.detail.inquinanti;
        dataToShow = e.detail.data;


    }
</script>
<DataSelector currentZoom={currentZoom} on:showData={makeTable} showInquinante={false}></DataSelector>
{#if dataToShow}
<div class="table-container">
    <table bind:this={dataTable}>
        <thead class="title-text">
        <th>timestamp</th>
        {#each inquinanti as inquinante}
            {#if inquinante != "timestamp"}
                <th>{inquinante}</th>
            {/if}
        {/each}
        </thead>
        <tbody>
        {#each dataToShow as row}
            <tr class="secondary-title-text">
            <td>{row["timestamp"]}</td>
            {#each inquinanti as prop}
                {#if prop != "timestamp"}
                    <td>{row[prop]}</td>
                {/if}
            {/each}
            </tr>

        {/each}
        </tbody>
    </table>
</div>
    {/if}
<style>
    .table-container{
        max-height: 50vh;
        overflow-y: scroll;
    }
    td{
        padding: 1em;
        border-right: 1px solid #333;
        border-collapse: collapse;
        text-align: center;
    }
    thead{
        border-bottom: 1px solid #333;
    }
</style>
