import axios from "axios";
import {
    getDefaultAccount,
    getWeb3
} from "./utils/web3";


const BASE_URL = process.env.REACT_APP_SERVER_URL;
localStorage.removeItem('authorizationToken');


const buildAuthorizationHeader = () => {
    const token = localStorage.getItem('authorizationToken');
    return {'Authorization': `Housteca ${token}`};
};


const buildHeaders = () => {
    return {
        ...buildAuthorizationHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
};

const requestSignature = async () => {
    const web3 = await getWeb3();
    const account = await getDefaultAccount();
    const time = (new Date().getTime() / 1000).toString();
    const msg =  web3.eth.accounts.hashMessage(time);
    const signature = await web3.eth.sign(msg, account);
    const token = btoa(`${time}:${signature}`);
    localStorage.setItem('authorizationToken', token);
    await login();
};

const checkToken = async () => {
    const result = localStorage.getItem('authorizationToken');
    if (!result) {
        await requestSignature();
        await login();
    }
};


export const uploadFile = async file => {
    await checkToken();
    const headers = buildHeaders();
    headers['Content-Type'] = 'multipart/form-data';
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${BASE_URL}/api/v1/documents/`, formData, {headers});
    return response.data.hash;
};


export const login = async () => {
    const account = await getDefaultAccount();
    const headers = buildHeaders();
    try {
        await axios.get(`${BASE_URL}/api/v1/users/${account}`, {headers});
    } catch (e) {
        const data = {
            email: 'test@test.com',
            first_name: 'test_first_name',
            last_name: 'test_last_name',
            address: account,
        };
        await axios.post(`${BASE_URL}/api/v1/users/`, data, {headers});
    }
};
