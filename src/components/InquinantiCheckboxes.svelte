<script>
    import {inquinanti} from "../modules/stores.js";
    import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
    import 'simplebar/dist/simplebar.css';
    export let inquinantiNames;
    let inquinantiChecked = []

    function updateInquinanti(inquinante){
        let indexInquinante =inquinantiChecked.indexOf(inquinante);
        if(indexInquinante >= 0){
            inquinantiChecked.splice(indexInquinante, 1);
        } else {
            inquinantiChecked.push(inquinante);
        }
        inquinanti.update( self => self = inquinantiChecked);
    }

    function removeUnderscore(string){
        let words = string.split("_");
        let stringCleaned = "";
        words
            .forEach(w => stringCleaned += w + " ");
        return stringCleaned;
    }
</script>
<div id="inquinanti">
    <p class="description-text">Inquinanti</p>
    <div id="inquinantiContainer" data-simplebar data-simplebar-auto-hide="true" class="shadows">
        {#each inquinantiNames as inquinante}

        <label>
            <input name = "inquinanti" value={inquinante} type="checkbox" on:change={() => updateInquinanti(inquinante)}/>
            {removeUnderscore(inquinante)}
        </label>
        {/each}
    </div>
</div>
<style>
    .shadows{
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
    .shadows:hover{
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    #inquinanti{
        justify-content: center;
        align-self: center;
        width: 200px;
    }
    #inquinantiContainer{
        flex-direction: column;
        max-height: 100px;
        /*border: 3px solid #32a852;*/
        border-radius: 5px;
        padding: 1em;
        overflow-y: scroll;
        align-items: flex-start;
        text-align: left;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    #inquinantiContainer::-webkit-scrollbar {
        display: none;
    }
    p{
        text-align: center;
    }
</style>
