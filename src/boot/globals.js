import { LocalStorage } from 'quasar'
import moment from 'moment'

const globals = {
  appName: 'Statuze',
  version: '1.0.0',
  isLogged: (new Date() >= LocalStorage.getItem('statuze_token_expires_in')),
  logged_user: LocalStorage.getItem('statuze_user'),
  token_info: {
    token: LocalStorage.getItem('statuze_access_token'),
    expires_in: LocalStorage.getItem('statuze_token_expires_in')
  },
  userLoggedHasRoles: (userLoggedRoles, roles) => {
    let hasPermission = false

    userLoggedRoles.forEach(userRole => {
      roles.forEach(roleName => {
        if (userRole.name.toUpperCase() === roleName.toUpperCase()) {
          hasPermission = true
        }
      })
    })

    return hasPermission
  },
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
  },
  getTime: (dateTime) => {
    return moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
  },
  getTimeOrDateTime: (dateTime) => {
    if (moment(dateTime, 'DDMMYYYY').format('DDMMYYYY') !== moment().format('DDMMYYYY')) {
      return moment(dateTime, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }

    return moment(dateTime, 'DD/MM/YYYY HH:mm:ss').format('HH:mm')
  },
  formatDateEN: (dateTime) => {
    return moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')
  },
  formatDateBR: (dateTime) => {
    return moment(dateTime, 'DD/MM/YYYY HH:mm:ss HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }
}

export default ({ Vue }) => {
  Vue.prototype.$globals = globals
}
