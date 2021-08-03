function parseData(response){
    console.log("parse");
    console.log(response);
    let parsedResponse = [];
    response
        .split("\n")
        .filter(str => str.length > 0)
        .forEach(obj => parsedResponse.push(JSON.parse(obj)));
    return cleanData(parsedResponse);
}
function cleanData(data){
    const fieldsToRemove = ["nazione", "regione", "provincia", "comune", "squareID", "fonte"];
    data.forEach(record => {
        fieldsToRemove.forEach(field => {
            if(record.hasOwnProperty(field)){
                delete record[field];
            }
        })
    });
    return data;
}

export {cleanData, parseData};
