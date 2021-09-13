<script>
    import {date} from "./stores.js";
    import {get} from "svelte/store";
    import {onMount} from "svelte";
    /*
        La data è aaaa-mm-gg
    */

 function saveDate(component, val){
     date.update(self => {
         self[component] = val;
         console.log(val);
         return self;

     });
 }
    let today = new Date();
    let startDate;
    let startHour;
    let endDate;
    let endHour;
 onMount(() => {
     let _date = get(date);
    startDate = _date["start_date"] == null ? "" : _date["start_date"];
    startHour = _date["start_hour"] == null ? "":_date["start_hour"];
    endDate = _date["end_date"] == null ? "":_date["end_date"];
    endHour = _date["end_hour"] == null ? "":_date["end_hour"];
    console.log(startDate);

 });
</script>
<p class="description-text">Periodo dati</p>
<div id="dateContainer">
    <label class="description-text">Data inizio
    <input type="date" on:change={(e) => saveDate("start_date", e.target.value)} name="start_date" value={startDate}></label>
    <label class="description-text">Ora inizio
    <input type="time" on:change={(e) => saveDate("start_hour", e.target.value)} name="start_hour" value={startHour}></label>
    <label class="description-text">Data fine
        <input type="date" on:change={(e) => saveDate("end_date", e.target.value)} name="end_date" value={endDate}></label>
    <label class="description-text">Ora fine
        <input type="time" on:change={(e) => saveDate("end_hour", e.target.value)} name="end_hour" value={endHour}></label>
</div>
<style>
#dateContainer{
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 0;
}
#dateContainer > label{
    margin-right: 1em;
}
p{
    margin-top: 1em;
    margin-bottom: 0;
}
</style>
