
<script>
    /* NON MODIFICARE -> INIZIO */
    import ProjectForm from "./ProjectForm.svelte";

    export let showResult, showError, showLoading, showMaintenance, showProgressBar, updateProgressBar, getFormData;
    export let WIDGET_VISIBLE = false;
    /* NON MODIFICARE -> FINE */

    /* ESEMPIO FUNZIONAMENTO ->  INIZIO */
    import {Button} from 'svelte-materialify/src';

    showResult();
    /* ESEMPIO FUNZIONAMENTO ->  FINE */
    let loading = false;

</script>

<main style={WIDGET_VISIBLE ? "" : "display: none"}>


  <ProjectForm on:start_loading={(e) => showLoading(e.detail.msg)} on:end_loading={showResult}></ProjectForm>

</main>

<style>

    main {
        width: 100%;
        height: 100%;
    }

</style>
