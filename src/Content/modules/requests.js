import {frequenze, inquinanti} from "./stores";

const url = 'https://sqd.sensesquare.eu:5001';
const elencoRegioni = '/elenco_regioni';
const elencoProvince = '/elenco_province';
const elencoMunicipi = '/elenco_municipi';
const elencoCentraline = '/elenco_centraline';
const route_geojson = "/squarejson";

const creaProgettoURL= '/creazione_progetto';
let apikey =  '2HHWGTKFP7XQ';
const download="/download?";
function _append(string, name, value){
    string += `${name}=${value}&`;
    return string;
}
//let apikey = JSON.parse(localStorage.getItem("user_info")).token;
async function  getElencoRegioni(nazione){
    const data = new FormData();
    data.append("naz_name", nazione);
    return await fetch( url + elencoRegioni, {
        body: data,
        method: 'POST'
        }).then(response => response.json());
}
async function  getElencoProvince(regione){
    const data = new FormData();
    data.append("reg_name", regione);
    return await fetch( url + elencoProvince, {
        body: data,
        method: 'POST'
    }).then(response => response.json());
}

async function  getElencoMunicipi(provincia){
    const data = new FormData();
    data.append("prov_name", provincia);
    return await fetch( url + elencoMunicipi, {
        body: data,
        method: 'POST'
    }).then(response => response.json());
}

async function getElencoCentraline(luogo, fonte){
    const data = new FormData();
    data.append("apikey", apikey);
    data.append('fonte', fonte);
    Object.keys(luogo).forEach(k => {
       if(luogo[k] !== ''){
           data.append(k, luogo[k]);
       }
    });
    return await fetch( url + elencoCentraline, {
        body: data,
        method: 'POST'
    }).then(response => response.json());
}

async function downloadData(startDate, startHour, endDate, endHour, luogo, zoom, reqType, ente) {
    console.log(startDate);
    console.log(startHour);
    console.log(endDate);
    console.log(endHour);
    console.log(luogo);
    console.log(zoom);
    console.log(reqType);
    let params = "";
    params = _append(params, "start_date", startDate);
    params = _append(params, "end_date", endDate);
    params = _append(params, "start_hour", startHour);
    params = _append(params, "end_hour", endHour);
    if(zoom == 5 && ente !== "ssq") {
        params = _append(params, "zoom", 4);
    } else {
        params = _append(params, "zoom", zoom);
    }
    params = _append(params, "req_type", reqType);
    params = _append(params, "format", "json");
    params = _append(params, "apikey", apikey);
    params = _append(params, "fonte", ente);
    params += getLuogoParams(zoom, luogo, ente);

    return await fetch(url + download + params).then(resp => resp.text());
}
const mapquestkey="7RA0GikGlQvrGrCrXfkW67N6ZskF4VZm";
const mapquest_endpoint= "http://www.mapquestapi.com/geocoding/v1/reverse";

async function getAddress(lat, lon){
    console.log(`lat: ${lat}\nlon: ${lon}`);
    let url = `${mapquest_endpoint}?key=${mapquestkey}&location=${lat},${lon}&thumbMaps=false`;
    return await
        fetch(url).
        then(resp =>
            resp.json());
}


function getLuogoParams(zoom, luogo, ente){
    console.log(luogo);
    const centralinaFields = ["nazione", "regione", "provincia", "comune", "squareID"];

    let params = "";
    for(let ii = 0 ; ii <= zoom && ii < 5; ii ++){
        params = _append(params,centralinaFields[ii], luogo[centralinaFields[ii]]);
    }
    if(zoom == 5 && ente === "ssq"){
        params = _append(params,"req_centr", luogo["ID"]);
    }
    return params;
}

async function getReport(titolo, zoom, inquinanti, commenti, startDate, endDate, startHour, endHour, luoghi){
    let periodo = {"start_date": `${startDate} ${startHour}`, "end_date": `${endDate} ${endHour}`};
    let geoJsonPromises = [];
    let addrPromises = [];

    let dati = {
        titolo,
        zoom: Number(zoom),
        inquinanti,
        commenti,
        periodo,
    };
    Object.keys(luoghi).forEach(ente => {
       let luoghiFormatted = formatLuoghiReport(luoghi[ente], zoom);
       if (zoom == 4){
           Object.keys(luoghiFormatted).forEach(luogo => {
                let squareID = luoghiFormatted[luogo].info.squareID;
                let nazione = luoghiFormatted[luogo].info.nazione;
                let provincia = luoghiFormatted[luogo].info.provincia;
                let comune = luoghiFormatted[luogo].info.comune;
                let currentPromise = getGeoJson(squareID, nazione, provincia, comune);
                geoJsonPromises.push(currentPromise);

                currentPromise.then(
                    respObj => {
                        console.log(respObj);
                        respObj.features.forEach(geojson => {
                            if (geojson.properties.name === squareID) {
                                console.log("restituisco geogjson");
                                console.log(geojson);
                                luoghiFormatted[luogo].info["geojson"] = geojson;
                            }
                        });
                    });



           });
       } else if(zoom == 5){
           Object.keys(luoghiFormatted).forEach(luogo => {
               let addrPromise = getAddress(luoghiFormatted[luogo].info.lat, luoghiFormatted[luogo].info.lon);
               addrPromises.push(addrPromise);
               addrPromise.then(addr => {
                   console.log("Address;")
                   console.log(addr);
                   console.log(addr.results[0].locations[0].street);
                   luoghiFormatted[luogo].info["address"] = addr.results[0].locations[0].street;
               });

               console.log(luoghiFormatted[luogo]);
           });

           }
       dati[ente] = luoghiFormatted;
    });
    const body = new FormData();

    body.append("apikey", apikey);


    if(zoom == "4") {
        console.log("lo zoom è 4");
        return await Promise.all(geoJsonPromises)
            .then()
            .then(() =>{
                console.log("faccio la req");
                body.append("dati", JSON.stringify(dati));
                console.log(dati);
                return makeReportRequest(body);
            });
    } else if(zoom == "5"){
        return  await  Promise.all(addrPromises)
            .then()
            .then(() => {
                body.append("dati", JSON.stringify(dati));
                console.log(dati);
                return makeReportRequest(body);
            });
    }
    else {
        body.append("dati", JSON.stringify(dati));

        return await makeReportRequest(body);
    }

}

async function makeReportRequest(body) {
    return await fetch("https://sqd.sensesquare.eu:5002/richiesta_report", {
        body: body,
        method: 'POST'
    }).then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}



function formatLuoghiReport(luoghi, zoom){
    zoom = Number(zoom);
    let formattedLuogo = {};
    const keys = ["nazione", "regione", "provincia", "comune", "squareID"];

    luoghi.forEach(luogo => {
        let key;
        if(zoom == 5){
            key = "squareID";
        } else {
            key = keys[zoom];
        }
        formattedLuogo[luogo[key]] = {};
        if(zoom > 0){
            formattedLuogo[luogo[key]]["info"] = {};
            let stop =  zoom == 5 ? 4 : zoom;
            for(let i = 0; i <=stop; i++){
                formattedLuogo[luogo[key]]["info"][keys[i]] = luogo[keys[i]];
            }
            if(zoom == 5){
                formattedLuogo[luogo[key]]["info"]["lat"] = luogo["lat"];
                formattedLuogo[luogo[key]]["info"]["lon"] = luogo["lon"];
            }

        }
        formattedLuogo[luogo[key]]["dati_luogo"] =  luogo.dati;
    });
    console.log(formattedLuogo);
    return formattedLuogo;
}

async function getGeoJson(squareID, nazione, provincia, comune){
    console.log("Getgeojson");
    const formdata = new FormData();
    formdata.append("apikey", apikey);
    formdata.append("squareID", squareID);
    formdata.append("nazione", nazione);
    formdata.append("provincia", provincia);
    formdata.append("comune", comune);
    return await fetch(url + route_geojson, {body: formdata, method: "POST"})
        .then(resp => resp.json());
}

export {getElencoRegioni,getElencoProvince,getElencoMunicipi, getElencoCentraline, downloadData, getReport};
