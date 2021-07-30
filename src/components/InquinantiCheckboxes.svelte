<script>
    import {inquinanti} from "../modules/stores.js";
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
<p class="description-text">Inquinanti</p>
<div id="inquinanti">
        {#each inquinantiNames as inquinante, idx}
            <div id="inquinante">
                <label>
                    <input name = "inquinanti" value={inquinante} type="checkbox" on:change={() => updateInquinanti(inquinante)}/>
                    {removeUnderscore(inquinante)}
                </label>
            </div>
        {/each}
</div>
<style>

    #inquinanti{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-self: center;
        width: 40%;
    }

    #inquinante{
        flex:  0 40%;
    }
    p{
        text-align: center;
    }
</style>
