import axios from 'axios';
import {API_URL} from '../../utilities/constants.js';

export const fetchBoard = async (id) => {
  const request = await axios.get(`${API_URL}/v1/board/${id}`);
  return request.data;
}