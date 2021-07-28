<script>
    import ZoomSelector from './ZoomSelector.svelte';
    import {TextField, Button} from 'svelte-materialify';
    import {downloadData, getReport} from "../modules/requests.js";
    import {inquinanti, frequenze, luoghiInseriti, date, req_type, commenti, zoom} from "../modules/stores.js";
    import SearchSources from './SearchSources.svelte';
    import {get} from 'svelte/store';
    import InquinantiCheckboxes from "./InquinantiCheckboxes.svelte";
    import swal from 'sweetalert';
    import MediaSelector from "./MediaSelector.svelte";
    import PeriodoInput from "./PeriodoInput.svelte";
    import {cleanData, parseData} from "../modules/util";
    import {createEventDispatcher} from 'svelte';
    import Plot from "./Plot.svelte";
    import Table from "./Table.svelte";
    import Commenti from "./Commenti.svelte";

    const dispatch = createEventDispatcher();

    let downloadReady = false;
    let projectName = "";
    let errorName = false;
    let inquinantiSelezionati = [];
    let currentStep = 0;

    function nextStep() {
        let chosenDate = get(date);

        if (!checkDate(chosenDate)) {
            swal("Dati non completi", "Data/Orario non inseriti", "error");
            return;
        }
        if (!checkInquinanti()) {
            swal("Dati non completi", "Inquinanti non inseriti", "error");
            return;
        }
        if (!checkTitle()) {
            swal("Dati non completi", "Titolo non inserito", "error");
            return;
        }
        currentStep++;
    }

    let inquinantiNames = [
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
        "direzione_vento",

    ];

    let currentZoom = 0;

    function onZoomChanged(e) {
        currentZoom = e.detail.zoom;
    }

    function checkTitle() {
        if (projectName.trim().length > 0) {
            errorName = false;
            return true;
        } else {
            errorName = true;
            return false;
        }
    }

    function checkDate(chosenDate) {
        let isValid = true;
        Object.keys(chosenDate).forEach(k => {
            if (chosenDate[k] == null) {
                isValid = false;
            }
        });
        return isValid;
    }

    function checkInquinanti() {
        return inquinantiSelezionati.length > 0;
    }

    function runDownloadData() {
        let chosenDate = get(date);
        if (!checkDate(chosenDate)) {
            swal("Dati non completi", "Data/Orario non inseriti", "error");
            return;
        }
        if (!checkInquinanti()) {
            swal("Dati non completi", "Inquinanti non inseriti", "error");
        }
        if (!checkTitle()) {
            swal("Dati non completi", "Titolo non inserito", "error");
        }
        let startDate = chosenDate.start_date;
        let endDate = chosenDate.end_date;
        let startHour = (chosenDate.start_hour.split(":"))[0];
        let endHour = (chosenDate.end_hour.split(":"))[0];
        let luoghi = get(luoghiInseriti);
        let isLuoghiEmpty = true;
        Object.keys(luoghi).forEach(ente => {
            if (luoghi[ente].length > 0) {
                isLuoghiEmpty = false;
            }
        });
        if (isLuoghiEmpty) {
            swal("Ops", "Seleziona almeno un luogo", "error");
        }
        let waitingPromises = 0;
        Object.keys(luoghi).forEach(ente => {
            luoghi[ente].forEach(luogo => {
                    waitingPromises++;
                    dispatch("start_loading", {msg: "Scarico i dati"});
                    downloadData(startDate, startHour, endDate, endHour, luogo, currentZoom, get(req_type), ente)
                        .then(resp => {
                            luogo.dati = parseData(resp);
                            waitingPromises--;
                            downloadReady = false;
                            if (waitingPromises == 0) {
                                downloadReady = true;
                                dispatch("end_loading");
                                currentStep++;
                            }
                        });
                }
            )
        });
    }

    function downloadReport() {
        let start_date = get(date)["start_date"];
        start_date = start_date.split("-");
        start_date = `${Number(start_date[2])}-${Number(start_date[1])}-${Number(start_date[0])}`

        let end_date = get(date)["end_date"];
        end_date = end_date.split("-");
        end_date = `${Number(end_date[2])}-${Number(end_date[1])}-${Number(end_date[0])}`;
        dispatch("start_loading", {msg: "Creazione report..."})
        getReport(
            projectName,
            currentZoom,
            get(inquinanti),
            get(commenti),
            start_date,
            end_date,
            get(date)["start_hour"],
            get(date)["end_hour"],
            get(luoghiInseriti)).then(() => dispatch("end_loading"));
    }

    inquinanti.subscribe(updated => {
        inquinantiSelezionati = updated;
    });


</script>
{#if currentStep == 0}
    <div id="form">
        <p class="title-text">Report una tantum</p>
        <TextField error={errorName} type="text" name="progetto"  bind:value={projectName}>Nome progetto</TextField>
        <ZoomSelector on:zoomChanged={onZoomChanged}/>
        <MediaSelector zoom={currentZoom}></MediaSelector>
        <PeriodoInput></PeriodoInput>
        <InquinantiCheckboxes inquinantiNames={inquinantiNames}></InquinantiCheckboxes>
    </div>

    <div id="btnContainer">
        <!--<Button id="submitBtn" class="primary" on:click={runDownloadData}>Richiedi report</Button>-->
        <!--<button id="downloadBtn" disabled={!downloadReady} on:click={downloadReport}>Download report</button>-->
    </div>
{/if}
{#if currentStep == 2}
    <div id="downloaded">
        <div>
            <Button class="primary" on:click={downloadReport}>Download pdf</Button>
            <Button class="primary" on:click={() => currentStep = 3}>Grafici</Button>
            <Button class="primary" on:click={() => currentStep = 4 }>Tabelle</Button>
        </div>
    </div>
{/if}
{#if currentStep == 3}
    <Plot currentZoom={currentZoom}></Plot>
    <Commenti></Commenti>
{/if}
{#if currentStep == 4}
    <Table currentZoom={currentZoom}></Table>
    <Commenti></Commenti>
{/if}
{#if currentStep == 1}
    <p class="title-text">Luoghi del report</p>
    <SearchSources zoom={currentZoom}/>
{/if}
<div id="btnStep" class="{currentStep == 0? 'toEnd' : 'spaced'}">
    {#if currentStep > 0}
        <Button class="secondary" on:click={() => {
            if(currentStep == 3 || currentStep == 4){
                currentStep = 2;
            } else
            currentStep--
        }}>Indietro</Button>
    {/if}
    {#if currentStep == 0}
        <Button  class="primary" on:click={nextStep}>Avanti</Button>
    {/if}
    {#if currentStep == 1}
        <Button class="primary" on:click={() => runDownloadData()}>Richiedi report</Button>
    {/if}
</div>




<style>
    #btnContainer{
        display: flex;
        flex-direction: row;
        align-self: center;
    }

    #submitBtn, #downloadBtn{
        max-width: 300px;
        align-self: center;
        border-radius: 20px;
    }

    #form{
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
    }
    #btnStep{
        display: flex;
        flex-direction: row;
        margin-top: 2em;
        align-items: flex-end;
    }
    #downloaded{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    #downloaded > div {
        display: flex;
        flex-direction: column;
        width: 30vw;
    }
    .toEnd{
        justify-content: flex-end;
    }
    .spaced{
        justify-content: space-between;
    }
</style>
