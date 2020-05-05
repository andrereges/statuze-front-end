import { LocalStorage } from 'quasar'

const globals = {
  appName: 'Statuze App',
  version: '1.0.0',
  user: LocalStorage.getItem('statuze_logged_user'),
  myFunctions: {
    refreshPage: () => window.location.reload(),
    formatDateTime: (formHours) => {
      if (!formHours) return

      const d = new Date()
      formHours = formHours.split(':')

      const day = d.getDate()
      const month = (d.getMonth() + 1)
      const year = d.getFullYear()
      const hours = (parseInt(d.getHours()) + parseInt(formHours[0]))
      const minutes = (parseInt(d.getMinutes()) + parseInt(formHours[1]))
      const seconds = d.getSeconds()

      const dt = new Date(year, month, day, hours, minutes, seconds)

      const date = [
        dt.getFullYear(),
        dt.getMonth().toString().padStart(2, '0'),
        dt.getDay().toString().padStart(2, '0')
      ].join('-')

      const hour = [
        dt.getHours().toString().padStart(2, '0'),
        dt.getMinutes().toString().padStart(2, '0'),
        dt.getSeconds().toString().padStart(2, '0')
      ].join(':')

      return date + ' ' + hour
    }
  }
}

export default ({ Vue }) => {
  Vue.prototype.$globals = globals
}
