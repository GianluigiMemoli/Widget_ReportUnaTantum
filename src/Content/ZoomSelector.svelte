<script>
    import {createEventDispatcher} from 'svelte';
    import {Radio} from 'svelte-materialify';
    import {zoom as globZoom} from "./stores";
    import {get} from "svelte/store";

    import {onMount} from "svelte";
    const dispatch = createEventDispatcher();
    function dispatchZoomChangedEvent(zoom){
        dispatch('zoomChanged', {
           zoom
        });
    }
    function handleZoomChanged(z){
        zoom = z;
        globZoom.update(self => {
                self = Number(z);
                return self;
        });
        dispatchZoomChangedEvent(z);
    }
    let zoom;
    let group;
    $: if(group) handleZoomChanged(group)

    onMount(() => {
            group = get(globZoom);
            console.log(group);
    });

</script>

<p id="zoom-title" class="description-text">Zoom</p>

<div id="zoomSelector">
        <Radio
        style="margin-right: 1em"
            bind:group
            value={0}
            on:change={handleZoomChanged}

        >Nazione</Radio>

        <Radio
        style="margin-right: 1em"
                bind:group
                value={1}
                on:change={handleZoomChanged}
        >Regione</Radio>

        <Radio
                style="margin-right: 1em"

                bind:group
                value={2}
                on:change={handleZoomChanged}
        >Provincia</Radio>

        <Radio
        style="margin-right: 1em"
        bind:group
                value={3}
                on:change={handleZoomChanged}
        >Comune</Radio>
        <Radio
        style="margin-right: 1em"
                bind:group
                value={4}
                on:change={handleZoomChanged}
        >Square id</Radio>
        <Radio
        style="margin-right: 1em"
                bind:group
                value={5}
                on:change={handleZoomChanged}
        >
            Centralina
        </Radio>

</div>


<style>
    Radio{
        display: inline;
        margin-left: 2em;
    }
    #zoomSelector{
        margin-top: 0;
        display: flex;
        flex-direction: row;
    }

    h4{
        text-align: left;
    }
    #zoom-title{
        margin-bottom: 0;
    }
</style>
