import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class PollutionService {
    api: any
    constructor(baseUrl = import.meta.env.VITE_BACKEND_URL0+"/api") {
        this.api = createApiClient(baseUrl);
    }
    async getPollution(token: string, city: string) {
        return await axios.get(`https://api.waqi.info/feed/${city}/?token=${token}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new PollutionService();