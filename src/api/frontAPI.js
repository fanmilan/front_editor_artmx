//import {GET} from "./ajax";
import axios from "axios";

const url = 'https://pishchulin.site/api/front_editor';

export const getFrontBlocksApi = () => {
    return axios.get(url)
                .then(res => res.data);
}


/*
* id = front for Public Home Page
*
* */

export const getBlockApi = (id) => {
    return axios.get(url+'/'+id)
                .then(res => res.data);
}

export const createFrontBlocksApi = (data) => {
    return axios.post(url, data)
                .then(res => res.data);
}

/*
*
* id = front for update Home Page
*
* */

export const updateFrontBlocksApi = (id, data) => {
    return axios.put(url+'/'+id, data)
                .then(res => res.data);
}

