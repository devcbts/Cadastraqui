import axios from 'axios'

export const api = axios.create({
  //baseURL: 'https://cadastraqui-production-fbcc.up.railway.app',
  baseURL: 'http://localhost:4000' // BackEnd URL
})
