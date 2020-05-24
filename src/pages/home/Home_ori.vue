<template>
  <div class="q-pa-md" id="home">

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
          v-model="reason"
          ref="reason"
          :options="statusWithReasons"
          :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : ''"
          :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : ''"
          label="Motivo*"
          :rules="[
            val => !!val || 'Motivo obrigatório'
          ]">
        </q-select>

        <q-input
          ref="expectedReturn"
          :label="expectedReturnLabel"
          outlined
          v-model="expectedReturn"
          mask="time"
          :rules="['time']"
          >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time
                  v-model="expectedReturn"
                  format24h
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input outlined
          ref="note"
          v-model="note"
          label="Anotação"
          type="textarea"
          maxlength="100"
          :hint="note.length + ' de 100'" />

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
      >
        <q-toolbar class="row glossy text-white status-title" :class="status.color">

        <q-toolbar-title class="label text-center">{{ status.name }}</q-toolbar-title>

        <q-btn flat round dense icon="assignment_ind" >
          <q-badge floating color="black">{{ status.users.length }}</q-badge>
        </q-btn>
      </q-toolbar>

      <q-item
        items-center
        v-for="user in status.users"
        :key="user.id"
        :data-id="user.id"
        class="app-custom-item"
        @dblclick="updateStatus(user)"
        @mouseover="showDetails(user)"
      >

        <q-item-section avatar top class="q-ml-none q-pa-xs q-pa-md">
          <q-chip class="zoom border-style">
            <q-avatar rounded size="48px">
              <img :src="user.image" width="50" height="50" class="border-style">
            </q-avatar>
            <q-item-label class="label">{{ user.nickName }}</q-item-label>
          </q-chip>
          <q-tooltip
            content-style="font-size: 16px"
            content-class="bg-amber text-black shadow-4"
            transition-show="rotate"
            transition-hide="rotate"
            :delay="1000"
            v-if="userSelected"
          >
            <q-item-label><strong>Motivo: </strong> {{ userSelected.user_status.reason.name }}</q-item-label>
            <q-item-label><strong>Desde: </strong> {{ fromHour }}</q-item-label>
            <q-item-label><strong>Previsto até às: </strong> {{ toHour }}</q-item-label>
            <q-item-label><strong>Anotações: </strong> {{ userSelected.user_status.note }}</q-item-label>
          </q-tooltip>
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
      user: '',
      reason: '',
      expectedReturn: '',
      note: '',
      process: false,
      dialog: false,
      dialogInfo: false,
      userSelected: '',
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
  computed: {
    fromHour: (vm) => {
      if (vm.userSelected.user_status.from) {
        return vm.$globals
          .getTimeOrDateTime(vm.userSelected.user_status.from)
      }
    },
    toHour: (vm) => {
      if (vm.userSelected.user_status.to) {
        return vm.$globals
          .getTimeOrDateTime(vm.userSelected.user_status.to)
      }
    }
  },
  watch: {
    reason: function (newReason, oldReason) {
      if (newReason.expectedReturn) {
        this.expectedReturn = this.$globals
          .createTime(newReason.expectedReturn)
      }
    }
  },
  methods: {
    showDetails (user) {
      this.dialogInfo = true
      this.userSelected = user
    },
    updateStatus (user) {
      if (user.id !== this.$globals.logged_user.id) return

      this.statusOld = user.user_status.status
      this.statusSelected = user.user_status.status
      this.statusWithReasons = []
      this.getStatuses(user.user_status.status)
      this.reason = user.user_status.reason
      this.expectedReturn = this.$globals.getTime(user.user_status.to)
      this.note = user.user_status.note
      this.expectedReturnLabel = `${user.user_status.status.name} até às`
      this.dialog = true
    },
    callDialog () {
      this.dialog = true
      this.statusWithReasons = []
      this.user = ''
      this.reason = ''
      this.expectedReturn = ''
      this.note = ''
      this.expectedReturnLabel = `${this.statusSelected.name} até às`
      this.getStatuses(this.statusSelected)
    },
    changeStatus () {
      let dateTime = ''
      if (this.expectedReturn) {
        dateTime = this.$globals
          .formatDateTime(this.expectedReturn)
      }

      const data = {
        status: this.statusSelected.id,
        reason: this.reason.id,
        to: dateTime,
        note: this.note
      }

      if (data.status && data.reason) {
        this.tryChangeStatus(data)
        this.dialog = false
      } else {
        Notify.create({
          message: 'O informe os campos obrigatórios',
          position: 'top',
          color: 'red',
          icon: 'thumb_down'
        })
      }
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

      this.statusOld = status

      if (this.process) {
        status.users
          .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)
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
            icon: 'thumb_down'
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
          this.$globals.refreshPage()
        })
        .catch((error) => {
          Notify.create({
            message: error.message,
            position: 'top',
            color: 'red',
            icon: 'thumb_down'
          })
        })
    },
    tryUpdateStatus (data) {
      this.$axios.post('/user-status', data)
        .then((response) => {
          this.process = true
          this.added(this.evento, this.statusSelected)
          this.removed(this.evento, this.statusOld)
          this.$globals.refreshPage()
        })
        .catch((error) => {
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
#home {
  background-color: #444;
  height: 100vh;
}
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
.zoom:hover {
  transform: scale(1.1);
}
.border-style {
  border-style: ridge groove;
  border: solid
}
.status-title {
  width: 17rem;
  box-shadow: 3px 5px #333;
  border-style: ridge groove;
  border-radius: 30px
}
</style>
