<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm justify-center" v-drag-and-drop="options" draggable="false">

    <q-dialog v-model="dialog" persistent>
      <q-card style="width: 350px">

      <q-card-section>
        <q-bar class="justify-center glossy">
          <q-btn
            :label="statusOld.name"
            class="full-width glossy text-black"
            :class="statusOld.color" />
          <q-btn
            label=" => "
            class="glossy text-black"
          />
          <q-btn
            :label="statusSelected.name"
            class="full-width glossy text-black"
            :class="statusSelected.color" />
        </q-bar>
      </q-card-section>
      <q-card-section>

        <q-select
          outlined
          v-model="user.reason"
          ref="user.reason"
          :options="statusWithReasons"
          :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : ''"
          :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : ''"
          label="Motivo*"
          :rules="[
            val => !!val || 'Motivo obrigatório'
          ]">
        </q-select>

        <q-input
          ref="user.reason.expectedReturn"
          :label="expectedReturnLabel"
          outlined
          v-model="user.reason.expectedReturn"
          mask="time">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time
                  v-model="user.reason.expectedReturn"
                  format24h
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input outlined
          ref="user.note"
          v-model="user.note"
          label="Anotação"
          type="textarea"
          maxlength="255"
          placeholder=""
          hint="" />

      </q-card-section>

      <q-card-section>
        <q-btn
          glossy unelevated
          push
          color="primary"
          text-color="black"
          label="Alterar"
          class="full-width"
          size="lg"
          @click="changeStatus"
        />

        <q-btn
          v-close-popup
          glossy unelevated
          push
          color="grey"
          text-color="black"
          label="Cancelar"
          class="full-width"
          size="lg"
        />
      </q-card-section>

    </q-card>
      </q-dialog>
      <q-list
        dense
        highlight
        v-for="status in statusWithUsers"
        :key="status.id"
        :data-id="status.id"
        class="app-custom-list q-pa-md"
        @added="added($event, status)"
        @removed="removed($event, status)"
        @reordered="reordered($event, status)"
        @dblclick="showDetails($event)"
      >

      <q-list-header class="row" style="width: 17rem;">
         <q-toolbar class="glossy text-white" :class="status.color">

          <q-toolbar-title class="label text-center">{{ status.name }}</q-toolbar-title>

          <q-btn flat round dense icon="assignment_ind" >
            <q-badge floating color="black">{{ status.users.length }}</q-badge>
          </q-btn>
        </q-toolbar>
      </q-list-header>

        <q-item
          items-center
          v-for="user in status.users"
          :key="user.id"
          :data-id="user.id"
          class="app-custom-item"
        >

          <q-item-section avatar top class="q-ml-none q-pa-xs q-pa-md">
            <q-chip>
              <q-avatar rounded size="48px">
                <img :src="user.image" width="50" height="50">
              </q-avatar>
              <q-item-label class="label">{{ user.nickName }}</q-item-label>
            </q-chip>
          </q-item-section>

        </q-item>

      </q-list>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'

export default {
  name: 'Home',
  data () {
    return {
      statusWithUsers: [],
      statusWithReasons: [],
      expectedReturnLabel: '',
      statusOld: '',
      statusSelected: '',
      evento: null,
      user: {
        reason: {},
        note: ''
      },
      process: false,
      dialog: false,
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
  // watch: {
  //   expectedReturnFormated: (val) => {
  //     console.log(val)
  //     const formHours = '01:00'.split(':')
  //     const d = new Date()
  //     const hours = (parseInt(d.getHours()) + parseInt(formHours[0]))
  //     const minutes = (parseInt(d.getMinutes()) + parseInt(formHours[1]))
  //     return hours + ':' + minutes
  //   }
  // },
  methods: {
    callDialog () {
      this.dialog = true
      this.statusWithReasons = []
      this.user.reason = {}
      this.user.note = ''
      this.expectedReturnLabel = `${this.statusSelected.name} até às`
      this.getStatuses(this.statusSelected)
    },
    changeStatus () {
      const dateTime = this.$globals.myFunctions
        .formatDateTime(this.user.reason.expectedReturn)

      const data = {
        status: this.statusSelected.id,
        reason: this.user.reason.id,
        to: dateTime,
        note: this.user.note
      }

      if (data.status && data.reason) {
        this.tryChangeStatus(data)
        this.dialog = false
      } else {
        Notify.create({
          message: 'O informe os campos obrigatórios',
          position: 'top',
          color: 'red',
          icon: 'error_outline'
        })
      }
    },
    showDetails () {
      this.dialog = true
    },
    isUserLogged (event) {
      if (event.detail.ids[0] === `${this.$globals.logged_user.id}`) return true
    },
    added (event, status) {
      if (!this.isUserLogged(event)) return

      if (!this.process) {
        event.detail.index = 0
        event.detail.ids = []
        event.detail.ids[0] = `${this.$globals.logged_user.id}`
        this.evento = event
        this.statusSelected = status
        this.callDialog()
        this.evento.preventDefault()
      }

      if (this.process) {
        status.users
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)

        const newUsers = this.statusWithUsers.map((status) => status.users)
          .reduce((prev, curr) => [...prev, ...curr], [])
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) >= 0)
        status.users.splice(event.detail.index, 0, ...newUsers)

        this.process = !this.process
      }
    },
    removed (event, status) {
      if (!this.isUserLogged(event)) return

      // this.statusOld = status
      if (this.process) {
        status.users
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)
      } else {
        this.statusOld = status
      }
    },
    reordered (event, status) {
      if (!this.isUserLogged(event)) return

      if (this.process) {
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
            icon: 'error_outline'
          })
        })
    },
    getStatuses (statusSelected) {
      this.$axios.get(`/status/${statusSelected.id}`)
        .then((response) => {
          if (response.data.data) {
            response.data.data.reasons.map(reason => {
              this.statusWithReasons.push({
                id: reason.id,
                name: reason.name,
                expectedReturn: reason.expected_return
              })
            })
          }
        })
    },
    tryChangeStatus (data) {
      this.$axios.post('/user-status', data)
        .then((response) => {
          this.process = true
          this.added(this.evento, this.statusSelected)
          this.removed(this.evento, this.statusOld)
          this.$globals.myFunctions.refreshPage()
        })
        .catch((error) => {
          Notify.create({
            message: error.message,
            position: 'top',
            color: 'red',
            icon: 'error_outline'
          })
        })
    }
  }
}
</script>

<style>
.app-custom-list {
  min-width: 10rem;
  /* height: 90vh; */
  margin-top: 0 !important;
}
.app-custom-item[aria-grabbed="true"] {
  background: #5cc1a6;
  color: #fff;
}
.label {
  color: black;
  font-weight: bold;
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
