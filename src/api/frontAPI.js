//import {GET} from "./ajax";
import axios from "axios";

const url = 'http://localhost:8000/api/front_editor/';
const headers = {
    'Content-Type': 'application/json'
}


export const getFrontBlocksApi = () => {
    return axios.get(url)
                .catch(errorHandle)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
}

export const getBlockApi = (id) => {
    return axios.get(url+id)
                .then(res => res.data);
}

export const createFrontBlocksApi = (data) => {
    return axios.post(url, data)
                .then(res => res.data);
}

function errorHandle(error) {
    alert('Произошла ошибка');
    console.log(error);
}