<script>
    import {req_type} from "../modules/stores.js";
    import {get} from "svelte/store";
    import {onMount} from "svelte";
    import {Radio} from "svelte-materialify";
    export let zoom = 0;
    let group;
    $: if(group)setReqType(group);

    function setReqType(val){
        console.log("media");
        req_type.update(self => {
            self = val;
            return self;
        });
    }

    onMount(() => {
       group = get(req_type);
    });
</script>
<p class="description-text">Dati</p>

<div id="mediaContainer">

    <Radio style="margin-right: 1em"value="daily" bind:group>Giornalieri</Radio>
    <Radio style="margin-right: 1em"value="hourly" bind:group>Orari</Radio>
    {#if zoom >= 3}
         <Radio style="margin-right: 1em"value="instant" bind:group> Al minuto </Radio>
        <Radio style="margin-right: 1em"value="raw" bind:group>Grezzi</Radio>
    {/if}
</div>

<style>
    #mediaContainer > label{
        display: inline-block;
        margin-left: 2em;
    }
    #mediaContainer{
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 0;
    }
    h4{
        margin-bottom: 1em;
    }
</style>
