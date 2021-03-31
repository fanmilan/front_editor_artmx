import axios from "axios";

export function GET(url) {
    return axios.get(url)
        .then(res => {
            console.log(res);
            console.log(res.data);
        });
}