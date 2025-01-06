import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class UserService {
    api: any
    constructor(baseUrl = import.meta.env.VITE_BACKEND_URL0+"/api") {
        this.api = createApiClient(baseUrl);
    }
    async getUsers(token: string) {
        return await axios.get(`https://dtplatform.onrender.com/user`, {
            headers: {
                'token': token
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new UserService();