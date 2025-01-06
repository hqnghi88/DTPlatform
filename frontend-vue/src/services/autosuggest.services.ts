import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AutoSuggestService {
    api: any
    constructor(baseUrl = import.meta.env.VITE_BACKEND_URL0+"/api") {
        this.api = createApiClient(baseUrl);
    }
    async getAutoSuggest(q:string, token: string) {
        return await axios.get(`https://dev.virtualearth.net/REST/v1/Autosuggest?query=${q}&maxResults=5&key=${token}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new AutoSuggestService();
