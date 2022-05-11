import axios from 'axios';
import { API_URL } from '../../utilities/constants.js';

export const fetchBoard = async(id) => {
    const request = await axios.get(`${API_URL}/v1/board/${id}`);
    return request.data;
}

export const createNewColumn = async(data) => {
    const request = await axios.post(`${API_URL}/v1/column`, data);
    return request.data;
}

// update or remove
export const updateColumn = async(id, data) => {
    const request = await axios.put(`${API_URL}/v1/column/${id}`, data);
    return request.data;
}

export const createNewCard = async(data) => {
    const request = await axios.post(`${API_URL}/v1/card`, data);
    return request.data;
}