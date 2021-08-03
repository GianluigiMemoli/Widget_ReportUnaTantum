<script>
    import DataSelector from "./DataSelector.svelte"
    import {onMount} from "svelte";
    export let currentZoom ;

    let inquinanti;
    let dataToShow;
    function mock(){
        inquinanti = [
            "timestamp",
            "pm10",
            "pm2_5",
            "pm1",
            "co",
            "o3",
            "no2",
            "so2",
            "h2s",
            "temperatura",
            "pressione",
            "umidita",
            "intensita_vento",
            "direzione_vento"
        ];
        let numOfRecords = 30;
        dataToShow = [];

        for(let i=0; i < numOfRecords; i++){
            let record = {};
            inquinanti.forEach(inq => {
                record[inq] = 992;
            });
            dataToShow.push(record);
        }
    }
    function makeTable(e){

        let payload = e.detail;
        inquinanti = e.detail.inquinanti;
        dataToShow = e.detail.data;

    }
</script>
<DataSelector currentZoom={currentZoom} on:showData={makeTable} showInquinante={false}></DataSelector>
{#if dataToShow}
<div class="table-container">
    <table>
        <thead class="title-text fix">
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
    table{
        border-collapse: separate;
    }
    .table-container{
        max-height: 50vh;
        overflow-y: scroll;
        overflow-x: scroll;
        margin-bottom: 3em;
    }
    td{
        text-align: center;
        border:1px solid #eee;
        padding: 2px;
    }

    thead{
        border-bottom: 1px solid #333;
    }
    tr:nth-child(even){
        background: #a1e5ab;

    }
    .fix{
        position: -webkit-sticky;
         position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
    }
</style>
