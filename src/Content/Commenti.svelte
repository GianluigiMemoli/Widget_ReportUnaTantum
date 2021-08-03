<script>
    import {beforeUpdate} from "svelte";
    import {get} from "svelte/store";
    import {Textarea,ListItem, Button, Icon, List, Subheader} from "svelte-materialify";
    import  {mdiPlus} from "@mdi/js";
    import {commenti} from "./stores";
    let _commenti;
    beforeUpdate(() => {
       _commenti = get(commenti);
       console.log(_commenti);
    });
    let value="";
    function addCommento(){
        _commenti.push(value);
        value = "";
        commenti.update((self) => self = _commenti);
    }
    function removeCommento(idx){
        console.log(idx);
        _commenti.splice(idx, 1);
        _commenti = _commenti;
        commenti.update((self) => self = _commenti);
    }
</script>
<div id="componentCommenti">
    <Textarea id="textArea"noResize outlined bind:value style="max-width: 30vw">Commenti    <Button primary fab size="small" slot="append" on:click={addCommento}><Icon path={mdiPlus}></Icon></Button></Textarea>
    <div id="commentiList">
        <List style="max-height: 30vh; overflow-y: scroll">
        <Subheader>Commenti</Subheader>

        {#each _commenti as commento, idx}
            <ListItem on:click={() => removeCommento(idx)}>{commento}</ListItem>
        {/each}
        </List>
    </div>
</div>

<style>
    #componentCommenti{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    #textArea{
        width: 30vw;
    }
</style>
