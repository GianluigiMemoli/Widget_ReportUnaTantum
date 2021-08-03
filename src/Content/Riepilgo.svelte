<script>
    import {beforeUpdate} from 'svelte';
    import {luoghiInseriti} from "./stores.js";
    import {get} from 'svelte/store';
    import { mdiMinus } from '@mdi/js';
    import {Button, Icon} from "svelte-materialify";
    let data = null;
    const unsubLuoghiInseriti = luoghiInseriti.subscribe(updated => data = updated);
    export let zoom = null;

    export let btnCb = () => console.log("stub");
    const centralinaFields = ["nazione", "regione", "provincia", "comune", "squareID"];
    let fieldsToShow = [];



    function filterFields(zoom)  {
        if(zoom != 5) {
            fieldsToShow = [];
            for (let i = 0; i <= zoom; i++) {
                fieldsToShow.push(centralinaFields[i]);
            }
        } else {
            fieldsToShow = centralinaFields;
        }
    }




    beforeUpdate(() => {
        if(data != null) {
            filterFields(zoom);
        }

    });



</script>
{#if data["ssq"].length > 0 || data["arpa_eea"].length > 0 || data["copernicus"].length > 0 }
    <div id="sourceContainer">
        <p class="title-text" id="sourceName">Riepilogo</p>

        <div id="sourceTableContainer">
            <table>
                <thead>
                {#each fieldsToShow as field}
                    <th class="secondary-title-text">{field}</th>
                {/each}
                </thead>
                <tbody>
                {#each Object.keys(data) as fonte}
                    {#each data[fonte] as centralina, index}
                    <tr>
                        {#each fieldsToShow as key}
                            <td>
                                {#if centralina[key] !== undefined}
                                    {centralina[key]}
                                {/if}
                            </td>
                        {/each}

                        <td id="btnTd">
                            <Button class="accent" id="addBtn" icon on:click={() => btnCb(index, fonte)}><Icon path={mdiMinus}></Icon></Button></td>
                        {/each}
                {/each}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
        </div>

    </div>


{/if}
<style>


    table{
        border-collapse: collapse   ;
    }
    thead{
        border-bottom: 1px solid ;
    }
    th{
        text-transform: capitalize;
    }
    #btnTd{
        border: none    ;
    }
    #addBtn{
        width: 40px;
        height: 20px;
        font-weight: bolder;
        border: 2px solid;
        border-radius: 20px;
        color: white;
        background: #f56f42;
        text-align: center;
        line-height: 0px;
    }
    #addBtn:hover{
        background: white;
        color: #f56f42;
    }

    #sourceContainer{
        text-align: center;
        padding: 1em
    }
    #sourceTableContainer{
        border: 2px solid #a1e5ab;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        text-align: center;
        max-height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        max-width: 700px;
        margin: 0 auto;
        padding: 1em;
        border-radius: 10px;
    }
    #sourceName{
        text-align: left;
    }
</style>
