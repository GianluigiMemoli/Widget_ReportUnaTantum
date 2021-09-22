<script>
    import {Button} from 'svelte-materialify';
    import {createEventDispatcher} from 'svelte';
    import {luoghiInseriti} from "../modules/stores";
    import {get} from "svelte/store";
    import DynamicSelect from "./DynamicSelect.svelte";
    let luoghi = get(luoghiInseriti);
    export let currentZoom = 0;
    export let showInquinante = true;
    let selectedLuogo = "";
    const dispatch = createEventDispatcher();
    console.log(luoghi);
    let fonti = Object.keys(luoghi);
    let selectedFonte = "";
    $: if(selectedFonte != "") {
        console.log("cambiata fonte");
        mapIdentificatoriLuogo()
    }

    let inquinanti = [];
    let selectedDati = [];

    $: if(selectedDati.length > 0) {
        console.log("cambiato luogo");
        let copy = selectedLuogo;
        selectedLuogo = "";
        selectedLuogo = copy;
        inquinanti = getInquinanti(selectedDati);
    }

    let selectedInquinante = "";

    let mappedLuogoDati = new Map();
    function getInquinanti(dati){
        let inquinanti = new Set();
        dati.forEach(
            record =>
                Object.keys(record).forEach(inquinante =>
                    inquinanti.add(inquinante))
        );
        return Array.from(inquinanti);
    }
    function mapIdentificatoriLuogo(){
        mappedLuogoDati = new Map();
        mappedLuogoDati.set("", []);
        console.log(mappedLuogoDati);
        let key ;
        if(currentZoom == 5){
            key = "squareID"
        } else {
            const keys = ["nazione", "regione", "provincia", "comune", "squareID"];
            key = keys[currentZoom];
        }
        luoghi[selectedFonte].forEach(
            luogo => {
                console.log(luogo);
                if(mappedLuogoDati.has(luogo[key])){
                    mappedLuogoDati.set(
                        luogo[key],
                        mappedLuogoDati.get(luogo[key]).push(luogo.dati)
                    );
                } else {
                    mappedLuogoDati.set(luogo[key], luogo.dati);
                }
            }
        );
        return mappedLuogoDati;
    }
    function sendData(){
        dispatch("showData", {data: mappedLuogoDati.get(selectedLuogo), selectedInquinante, inquinanti})
    }
</script>
<div id="container">
    <div id="selectContainer">
        <DynamicSelect labelValue="Fonte" data={Object.keys(luoghi)} on:selectChanged={(e) => selectedFonte = e.detail.data}></DynamicSelect>
        {#if selectedFonte != ""}
            <br>
            <DynamicSelect labelValue="Luogo" data={Array.from(mappedLuogoDati.keys()).filter(x => x!="")} on:selectChanged={(e) => {selectedDati = mappedLuogoDati.get(e.detail.data); selectedLuogo = e.detail.data}}></DynamicSelect>
        {/if}
        {#if selectedLuogo != "" && inquinanti.length > 0 && showInquinante}
            <br>
            <DynamicSelect labelValue="Inquinante" data={inquinanti} on:selectChanged={(e) => selectedInquinante = e.detail.data}></DynamicSelect>
        {/if}
        {#if (selectedInquinante && showInquinante) || (selectedLuogo != undefined)}<br>
            <Button class="primary" on:click={sendData}>Mostra</Button>
        {/if}
    </div>
</div>

<style>
    #container{
        display: flex;
        flex-direction:row;
        justify-content: center;

    }
</style>
