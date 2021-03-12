import { LocalStorage, Notify } from 'quasar'
import moment from 'moment'

const globals = {
  appName: process.env.APP_NAME,
  version: process.env.VERSION,
  isLogged: (new Date() >= LocalStorage.getItem('statuze_token_expires_in')),
  logged_user: LocalStorage.getItem('statuze_user'),
  token_info: {
    token: LocalStorage.getItem('statuze_access_token'),
    expires_in: LocalStorage.getItem('statuze_token_expires_in')
  },
  showNotify: (type, message) => {
    Notify.create({
      message: message,
      position: 'top',
      color: (type === 'success') ? 'green' : 'red',
      icon: (type === 'success') ? 'thumb_up' : 'thumb_down'
    })
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
  getNow: () => {
    return moment().format('YYYY-MM-DD')
  },
  plusHourAndMinutes: (startTime, endTime) => {
    const hours = endTime.split(':')[0]
    const minutes = endTime.split(':')[1]
    return moment(moment(startTime, 'DD/MM/YYYY HH:mm'))
      .add(hours, 'hours')
      .add(minutes, 'minutes').format('HH:mm')
  },
  diffHourAndMinutes: (startTime, endTime) => {
    return moment.utc(moment(endTime, 'DD/MM/YYYY HH:mm').diff(moment(startTime, 'DD/MM/YYYY HH:mm'))).format('HH:mm')
  },
  getTime: (locale, dateTime) => {
    if (locale === 'EN' && dateTime) {
      return moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
    }
    if (locale === 'BR' && dateTime) {
      return moment(dateTime, 'DD/MM/YYYY HH:mm:ss').format('HH:mm')
    }

    return moment().format('HH:mm')
  },
  getTimeOrDateTime: (dateTime) => {
    if (moment(dateTime, 'DDMMYYYY').format('DDMMYYYY') !== moment().format('DDMMYYYY')) {
      return moment(dateTime, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }

    return moment(dateTime, 'DD/MM/YYYY HH:mm:ss').format('HH:mm')
  },
  formatDate: (localeFrom, localeTo, dateTime) => {
    if (localeFrom === 'EN' && dateTime) {
      if (localeTo === 'BR') {
        return moment(dateTime, 'YYYY-MM-DD').format('DD/MM/YYYY')
      }

      if (localeTo === 'EN' && dateTime) {
        return moment(dateTime, 'YYYY-MM-DD').format('YYYY-MM-DD')
      }
    }

    if (localeFrom === 'BR' && dateTime) {
      if (localeTo === 'BR') {
        return moment(dateTime, 'DD/MM/YYYY').format('DD/MM/YYYY')
      }

      if (localeTo === 'EN' && dateTime) {
        return moment(dateTime, 'DD/MM/YYYY').format('YYYY-MM-DD')
      }
    }

    return moment().format('DD/MM/YYYY')
  },
  calculateAge: (dateTime) => {
    dateTime = moment(dateTime, 'YYYY-MM-DD', true)
    return moment().diff(dateTime, 'years')
  },
  formatPhone: (phone) => {
    if (phone) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 12)}`
    }
    return ''
  }
}

export default ({ Vue }) => {
  Vue.prototype.$globals = globals
}
