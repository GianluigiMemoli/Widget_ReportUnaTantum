<script>
    import { createEventDispatcher } from 'svelte';
    import {afterUpdate, beforeUpdate} from 'svelte';
    import {luogoRicerca} from './stores.js';
    export let labelValue = "Generic select";
    export let data = null;
    export let storeField = 'default';
    const dispatch = createEventDispatcher();
    let customSelect;


    function updateLuogoRicerca(value){
        dispatch('selectChanged', {data: value});
        luogoRicerca.update(self => {
            self[storeField] = value;
            return self;
        });
    }
    beforeUpdate(()=>{
       data.unshift('');
    });
    afterUpdate(() => {

            updateLuogoRicerca(data[0]);

    });

</script>
<label class="secondary-title-text">{labelValue}<br>
    <select bind:this={customSelect} on:change={(e) => updateLuogoRicerca(e.target.value)}>
        {#each data as value}
            <option>{value}</option>
        {/each}
    </select>
</label>

<style>
    label{
        display: inline;
    }
    select{
        border-bottom: 1px solid black;
        min-width: 200px;
    }
</style>
