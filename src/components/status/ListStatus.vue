<template>

  <div class="row q-gutter-sm justify-center" v-drag-and-drop="options" draggable="false">
    <q-list
      dense
      highlight
      v-for="status in statusWithUsers"
      :key="status.id"
      :data-id="status.id"
      class="app-custom-list q-pa-md"
      @added="isUserLogged($event, status)"
      @removed="isUserLogged($event, status)"
      @reordered="isUserLogged($event, status)"
    >

      <list-status-toolbar :status="status" />
      <user-item :user="user" v-for="user in status.users" :key="user.id" />

    </q-list>
  </div>

</template>

<script>
import { Notify } from 'quasar'
import UserItem from '../../components/status/UserItem'
import ListStatusToolbar from '../../components/status/ListStatusToolbar'

export default {
  name: 'ListStatus',
  components: {
    UserItem, ListStatusToolbar
  },
  data () {
    return {
      statusWithUsers: [],
      evento: null,
      statusChanged: false,
      statusOld: '',
      statusNew: '',
      openDialog: false,
      options: {
        multipleDropzonesItemsDraggingEnabled: false,
        dropzoneSelector: '.q-list',
        reactivityEnabled: true,
        draggableSelector: '.q-item',
        onDrop: (event) => {}
      }
    }
  },
  created () {
    this.getStatusesWithUsers()
  },
  beforeMount () {
    this.$root.$on('ListStatus::added', (statusNew) => {
      this.statusChanged = true
      this.added(this.evento, statusNew)
    })

    this.$root.$on('ListStatus::removed', (statusOld) => {
      this.removed(this.evento, statusOld)
    })
  },
  methods: {
    callDialog () {
      this.$root.$emit('dialogChangeStatus::show', this.statusNew, this.statusOld)
    },
    isUserLogged (event, status) {
      if (event.detail.ids[0] !== `${this.$globals.logged_user.id}`) return

      if (event.type === 'added') {
        event.detail.index = 0
        event.detail.ids = []
        event.detail.ids[0] = `${this.$globals.logged_user.id}`
        this.added(event, status)
      }

      if (event.type === 'removed') {
        this.removed(event, status)
      }
    },
    added (event, status) {
      if (this.statusChanged) {
        status.users
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)

        const newUsers = this.statusWithUsers.map((status) => status.users)
          .reduce((prev, curr) => [...prev, ...curr], [])
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) >= 0)
        status.users.splice(event.detail.index, 0, ...newUsers)

        this.statusChanged = !this.statusChanged

        return
      }

      this.statusNew = status
    },
    removed (event, status) {
      if (this.statusChanged) {
        status.users
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)

        return
      }

      this.statusOld = status
      this.callDialog()
    },
    reordered (event, status) {
      if (this.statusChanged) {
        const reorderedUsers =
          status.users.filter((user) => event.detail.ids.map(Number).indexOf(user.id) >= 0)
        const newUsers = status.users
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)
        newUsers.splice(event.detail.index, 0, ...reorderedUsers)
        status.users = newUsers
      }
    },
    getStatusesWithUsers () {
      this.$axios.get('/status/users')
        .then((response) => {
          if (response.data.data) {
            this.statusWithUsers = response.data.data
          }
        }).catch((error) => {
          Notify.create({
            message: error.message,
            position: 'top',
            color: 'red',
            icon: 'thumb_down'
          })
        })
    }
  }
}
</script>

<style>
.app-custom-list {
  min-width: 10rem;
  margin-top: 0 !important;
}
@keyframes nodeInserted {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 0.8;
  }
}
.item-dropzone-area {
  height: 2rem;
  background: #888;
  opacity: 0.8;
  animation-duration: 0.5s;
  animation-name: nodeInserted;
  margin-left: 0.6rem;
  margin-right: 0.6rem;
}
</style>
