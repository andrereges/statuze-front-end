
import axios from 'axios'
import { LocalStorage } from 'quasar'

const statuzeBackendAPI = axios.create({
  baseURL: process.env.STATUZE_BACKEND_API,
  timeout: 30000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${LocalStorage.getItem('statuze_access_token')}`
  }
})

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
  Vue.prototype.$statuzeBackendAPI = statuzeBackendAPI
}

export { statuzeBackendAPI }
