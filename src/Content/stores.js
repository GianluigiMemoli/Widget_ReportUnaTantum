import {writable} from 'svelte/store';
export const nomeProgetto = writable("");
export const zoom = writable(0);
export const commenti = writable([]);
export const luogoRicerca = writable({
    'nazione': '',
    'regione': '',
    'provincia': '',
    'comune': '',
});

export const luoghiInseriti = writable({
    "ssq": [],
    "copernicus": [],
    "arpa_eea": [],
});

export const date = writable({
    "start_date": null,
    "start_hour": null,
    "end_date": null,
    "end_hour": null
});

export const req_type = writable("daily");
export const inquinanti = writable([]);
export const frequenze = writable([]);
