import { LocalStorage } from 'quasar'
import moment from 'moment'

const globals = {
  appName: 'Statuze App',
  version: '1.0.0',
  isLogged: (new Date() >= LocalStorage.getItem('statuze_token_expires_in')),
  logged_user: LocalStorage.getItem('statuze_user'),
  token_info: {
    token: LocalStorage.getItem('statuze_access_token'),
    expires_in: LocalStorage.getItem('statuze_token_expires_in')
  },
  myFunctions: {
    refreshPage: () => window.location.reload(),
    formatDateTime: (time) => {
      const formHours = time.split(':')
      const d = new Date()
      d.setHours(parseInt(formHours[0]))
      d.setMinutes(parseInt(formHours[1]))

      return moment(d).format('YYYY-MM-DD HH:mm:ss')
    },
    createTime: (time) => {
      const formHours = time.split(':')
      const d = new Date()
      d.setHours(parseInt(d.getHours()) + parseInt(formHours[0]))
      d.setMinutes(parseInt(d.getMinutes()) + parseInt(formHours[1]))

      return moment(d).format('HH:mm')
    }
  }
}

export default ({ Vue }) => {
  Vue.prototype.$globals = globals
}
