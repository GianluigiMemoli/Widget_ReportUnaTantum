<script>
    // import & props
    import {getElencoRegioni, getElencoMunicipi, getElencoProvince, getElencoCentraline} from "./requests.js";
    import DynamicSelect from './DynamicSelect.svelte';
    import {luogoRicerca, luoghiInseriti} from "./stores.js";
    import SourcesContainer from "./SourceTable.svelte";
    import Riepilogo from "./Riepilgo.svelte";
    import {Button} from 'svelte-materialify';
    export let zoom;
    //logic
    let regioniPromise = getElencoRegioni("Italia");
    let provinciaPromise;
    let municipioPromise;
    let campiRicerca;
    let luogoDaRicercare;
    let sourcesToSubmit;

    const unsubLuogoRicerca = luogoRicerca.subscribe(luogo => {
        luogoDaRicercare = luogo;
    });

    function addSorgenteCallback(centralina, source){
        luoghiInseriti.update(self => {
            self[source].push(centralina);
            return self;
        });
    }

    const unsubInseriti = luoghiInseriti.subscribe(l => {
        sourcesToSubmit = l;
    });

    function updateProvincia(value) {
        provinciaPromise = getElencoProvince(value);
    }

    function updateMunicipio(value) {
        municipioPromise = getElencoMunicipi(value);
    }

    let centralinePromises = {
        "ssq": null,
        "arpa_eea": null,
        "copernicus": null
    };

    function getAllCentraline() {
        const fonti = ["ssq", "arpa_eea", "copernicus"];
        fonti.forEach(fonte => {
            centralinePromises[fonte] = getElencoCentraline(luogoDaRicercare, fonte);
        });
    }

    function removeCb(index, source){
        luoghiInseriti.update(self => {
            self[source].splice(index, 1);
            return self;
        });
    }
    let frequenze;
    let inquinanti;

</script>
<div id="search">
    <p class="description-text">Area geografica</p>
    <div>
    <DynamicSelect labelValue="Nazioni" data={["Italia"]} storeField="nazione"/><br>
    {#await regioniPromise}
        {:then regioni}
        <DynamicSelect labelValue="Regioni" data={regioni.result} storeField="regione"  on:selectChanged={(e) => updateProvincia(e.detail.data)}/>
        <br>
        {:catch error}
        {alert(error.message)}
    {/await}
    {#if provinciaPromise }
        {#await provinciaPromise}
        {:then province}
            <DynamicSelect labelValue="Provincia" data={province.result} storeField="provincia" on:selectChanged={(e)=>updateMunicipio(e.detail.data)}/>
            <br>
        {:catch error}
            {alert(error.message)}
        {/await}
    {/if}
    {#if municipioPromise }
        {#await municipioPromise}
        {:then comuni}
            <DynamicSelect labelValue="Comune" data={comuni.result} storeField="comune"/>
            <br>
        {:catch error}
            {alert(error.message)}
        {/await}
    {/if}
    <Button class="primary" on:click={() => getAllCentraline()}>Cerca luoghi</Button>
    </div>
    <div id="sourcesRow">
        {#await centralinePromises["ssq"]}
            <p>Download sorgenti ssq ...</p>
            {:then centraline}
            <SourcesContainer zoom={zoom} source="ssq" data={centraline} btnCb={addSorgenteCallback}></SourcesContainer>
        {/await}
        {#await centralinePromises["arpa_eea"]}
            <p>Download sorgenti arpa_eea ...</p>
            {:then centraline}
                <SourcesContainer zoom={zoom} source="arpa_eea" data={centraline} btnCb={addSorgenteCallback}></SourcesContainer>
        {/await}
        {#await centralinePromises["copernicus"]}
            <p>Download sorgenti copernicus ...</p>
        {:then centraline}
            <SourcesContainer zoom={zoom} source="copernicus" data={centraline} btnCb={addSorgenteCallback}></SourcesContainer>
        {/await}
        {#if sourcesToSubmit !== undefined}
            <Riepilogo zoom={zoom} btnCb={removeCb} ></Riepilogo>
        {/if}
    </div>

</div>

<style>
    #sourcesRow{
        display: flex;
        flex-direction: column;

        align-items: center;
        align-self: center;
        flex-wrap: wrap;
    }
    #riepilogoRow{
        display: flex;
        flex-direction: row;
        justify-content: space-around;

    }
    #search{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
