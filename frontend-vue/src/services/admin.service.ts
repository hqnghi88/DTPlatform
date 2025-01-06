import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AdminService {
    api: any
    constructor(baseUrl = import.meta.env.BACKEND_URL0+"/api") {
        this.api = createApiClient(baseUrl);
    }
    async upload(data1: any, token: string) {
        let data = new FormData();
        data.append('data', data1);
        return await axios.post(import.meta.env.BACKEND_URL0+"/csv/upload", data
        ,{
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': token
            }
        }).then((res) => {
            return res.data;
        }).catch((err: any) => {
            handlingError(err);
        })
    }
}

export default new AdminService();