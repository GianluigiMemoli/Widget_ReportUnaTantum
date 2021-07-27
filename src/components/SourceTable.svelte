<script>
    import {beforeUpdate} from 'svelte';
    import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
    import 'simplebar/dist/simplebar.css';
    import {mockCentaline} from "../modules/mock.js";
    import {luogoRicerca} from "../modules/stores.js";
    import {get} from 'svelte/store';
    import { mdiPlus } from '@mdi/js';
    import {Icon, Button} from 'svelte-materialify';
    export let source = "no source";
    export let data = null;
    export let zoom = null;
    export let btnCb = () => console.log("stub");
    const centralinaFields = ["nazione", "regione", "provincia", "comune", "squareID"];
    let fieldsToShow = [];
    let luogoCercato;

    let insertedSources;
    let sourcesUniques = [];

    let fieldAsKey;

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
    const latitudeAlternatives = ["latitude", "latitudine", "lat"];
    const longitudeAlternatives = ["longitude", "longitudine", "lon"];
    function removeCentralinaWithNoLatLon(){
        let hasLatField = false;
        let hasLonField = false;
        let indexesToRemove = [];
        sourcesUniques.forEach((source, idx) => {
            latitudeAlternatives.forEach(alt => {
                if (source.hasOwnProperty(alt)) {
                    hasLatField = true;
                }
            });
            longitudeAlternatives.forEach(alt => {
                if (source.hasOwnProperty(alt)) {
                    hasLonField = true;
                }
            })
            if(!(hasLatField && hasLonField)){
                indexesToRemove.push(idx);
            }
        });
        for(let i = sourcesUniques.length - 1; i >=0 ; i--){
            if(indexesToRemove.includes(i)) {
                let removed = sourcesUniques.splice(i, 1);

            }
        }

    }
    function addMissingFields(centralina){
        centralinaFields.forEach(field => {
            if(!centralina.hasOwnProperty(field)){
                centralina[field] = luogoCercato[field];
            }
        });
        latitudeAlternatives.forEach(latField => {
           if(centralina.hasOwnProperty(latField) && latField !== "lat"){
               let val = centralina[latField];
               delete centralina[latField];
               centralina["lat"] = val;
           }
        });
        longitudeAlternatives.forEach(lonField => {
            if(centralina.hasOwnProperty(lonField) && lonField !== "lon"){
                let val = centralina[lonField];
                delete centralina[lonField];
                centralina["lon"] = val;
            }
        });
        return centralina;
    }
    function setFieldAsKey(){
        switch (Number(zoom)) {
            case 0:
                fieldAsKey = 'nazione';
                break;
            case 1:
                fieldAsKey = 'regione';
                break;
            case 2:
                fieldAsKey = 'provincia';
                break;
            case 3:
                fieldAsKey = 'comune';
                break;
            case 4:
                fieldAsKey = 'squareID';
                break;
        }
    }
    function removeDuplicates(){
        if(zoom == 5){
            sourcesUniques = Object.assign([],data);
        } else
        insertedSources = [];
        sourcesUniques = [];
        data.forEach(
            source => {
                let key = source[fieldAsKey] === undefined ? luogoCercato[fieldAsKey] : source[fieldAsKey];
                if(key === undefined){
                    alert("key undef filed" + fieldAsKey);
                    return;
                }
                if(!insertedSources.includes(key)){
                    sourcesUniques.push(source);
                    insertedSources.push(key);
                }
            }
        )
    }




    beforeUpdate(() => {
        if(data != null) {
            luogoCercato = get(luogoRicerca);
            setFieldAsKey();
            filterFields(zoom);
            if(zoom != 5) {
                removeDuplicates();
            } else {
                sourcesUniques = data;
            }
            if(zoom == 5){
                removeCentralinaWithNoLatLon();
            }
        }

    });



</script>
{#if data != null && data.length > 0}
<div id="sourceContainer">
    <p class="title-text" id="sourceName">Sorgenti {source}</p>

    <div id="sourceTableContainer" class="shadows"  >
        <table>
            <thead>
            {#each fieldsToShow as field}
                <th class="secondary-title-text">{field}</th>
            {/each}
            </thead>
            <tbody>
            {#each sourcesUniques as centralina}
                <tr>
                    {#each fieldsToShow as key}
                        <td>
                            {#if centralina[key] !== undefined}
                            {centralina[key]}
                                {:else}
                                {luogoCercato[key]}
                                {/if}
                        </td>
                        {/each}
                    <td id="btnTd">
                        <Button icon class="primary" on:click={() => btnCb(addMissingFields(centralina), source)}>
                            <Icon path={mdiPlus}></Icon>
                        </Button>
                    </td>

                </tr>
                        {/each}
            </tbody>
        </table>
    </div>

</div>
    {/if}
<style>


    table{
        border-collapse: collapse   ;
    }
    thead{
        border-bottom: 1px solid;
    }
    th{
        text-transform: capitalize;
        margin-right: 2em;
    }
    #btnTd{
        border: none    ;
    }
    td{
        text-align: center;

    }
    button{
        width: 40px;
        height: 20px;
        font-weight: bolder;
        border: 2px solid;
        border-radius: 20px;
        text-align: center;
    }
    button:hover{
        background: white;
        color: #98e85f;
    }
    #sourceContainer{
        text-align: center;
        flex-direction: column;
        padding: 1em;
    }
    .shadows{
        -webkit-box-shadow: 0px 3px 13px 5px rgba(186,186,186,1);
        -moz-box-shadow: 0px 3px 13px 5px rgba(186,186,186,1);
        box-shadow: 0px 3px 13px 5px rgba(186,186,186,1);
    }
    #sourceTableContainer{
        -ms-overflow-style: none;  /* IE and Edge */
        overflow-y: scroll;
        text-align: center;
        max-width: 700px;
        max-height: 400px;
        padding: 1em;
        border-radius: 10px;
        overflow-y: scroll;
    }
    #sourceName{
        text-align: center;
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    #sourceTableContainer::-webkit-scrollbar {
        display: none;
    }
    .shadows{
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
    .shadows:hover{
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

</style>
