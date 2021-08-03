<script>
    import DataSelector from "./DataSelector.svelte";
    import Chart from 'chart.js/auto';

    export let currentZoom = 0;

    let ctx;
    function getDataForAxes(valueName, values){
        let data  = [];
        values.forEach(record => {
            if(record.hasOwnProperty(valueName)){
                data.push(record[valueName]);
            }
        })
        return data;
    }
    let plot;
    function draw(payload){
        let dataToPlot = payload.detail;
        console.log(dataToPlot);
        let yAxis = getDataForAxes("timestamp",dataToPlot.data);
        let xAxis = getDataForAxes(dataToPlot.selectedInquinante, dataToPlot.data);
        if(plot){
            plot.destroy();
        }
         plot = new Chart(ctx, {
            type: "line",
            data: {
                labels: yAxis,
                datasets: [{
                    label: dataToPlot.selectedInquinante,
                    data: xAxis
                }]
            }
        })
    }

</script>

<DataSelector currentZoom={currentZoom} on:showData={draw}></DataSelector>
<div id="chartContainer">
    <canvas id="plot" width="500" height="500" bind:this={ctx}>

    </canvas>
</div>
