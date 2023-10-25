import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: `http://localhost:${env.PORT}`, // BackEnd URL
})
