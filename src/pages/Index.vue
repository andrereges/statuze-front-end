<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm justify-center" v-drag-and-drop="options">

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
              <q-item-label class="label">{{ user.name }}</q-item-label>
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
  name: 'Index',
  data () {
    return {
      statusWithUsers: [],
      options: {
        multipleDropzonesItemsDraggingEnabled: true,
        dropzoneSelector: '.q-list',
        draggableSelector: '.q-item'
      }
    }
  },
  mounted () {
    this.getStatuses()
  },
  methods: {
    added (event, status) {
      const newUsers = this.statusWithUsers.map((status) => status.users)
        .reduce((prev, curr) => [...prev, ...curr], [])
        .filter((user) => event.detail.ids.map(Number).indexOf(user.id) >= 0)
      status.users.splice(event.detail.index, 0, ...newUsers)
    },
    removed (event, status) {
      status.users = status.users
        .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)
    },
    reordered (event, status) {
      const reorderedUsers =
        status.users.filter((user) => event.detail.ids.map(Number).indexOf(user.id) >= 0)
      const newUsers = status.users
        .filter((user) => event.detail.ids.map(Number).indexOf(user.id) < 0)
      newUsers.splice(event.detail.index, 0, ...reorderedUsers)
      status.users = newUsers
    },
    getStatuses () {
      this.$axios.get('/status-with-users')
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
