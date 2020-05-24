import axios from 'axios'
import { LocalStorage } from 'quasar'

const axiosInstance = axios.create({
  baseURL: 'http://statuze.local/api',
  // baseURL: 'http://10.0.0.34/api',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${LocalStorage.getItem('statuze_access_token')}`
  }
})

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}

export { axiosInstance }
