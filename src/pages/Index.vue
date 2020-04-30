<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm justify-center" v-drag-and-drop="options">

      <q-list
        dense
        highlight
        v-for="group in groupsWithItems"
        :key="group.id"
        :data-id="group.id"
        class="app-custom-list q-pa-md"
        @added="added($event, group)"
        @removed="removed($event, group)"
        @reordered="reordered($event, group)"
      >

      <q-list-header class="q-pa-md row">
         <q-toolbar class="glossy text-white" :class="group.color">
          <q-toolbar-title class="label">{{ group.id }}</q-toolbar-title>
          <q-btn flat round dense icon="assignment_ind" >
            <q-badge floating color="black">{{ group.items.length }}</q-badge>
          </q-btn>
        </q-toolbar>
      </q-list-header>

        <q-item
          items-center
          v-for="item in group.items"
          :key="item.id"
          :data-id="item.id"
          class="app-custom-item"
        >

          <q-item-section avatar top class="q-ml-none q-pa-xs">
            <q-chip>
              <q-avatar rounded size="48px">
                <img :src="item.image" width="50" height="50">
              </q-avatar>
              <q-item-label class="label">{{ item.name }}</q-item-label>
            </q-chip>
          </q-item-section>

        </q-item>

      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      groupsWithItems: [],
      options: {
        multipleDropzonesItemsDraggingEnabled: true,
        dropzoneSelector: '.q-list',
        draggableSelector: '.q-item'
      }
    }
  },
  mounted () {
    this.getStatuses()
    this.getUsers()
  },
  methods: {
    added (event, group) {
      const newItems = this.groupsWithItems.map((group) => group.items)
        .reduce((prev, curr) => [...prev, ...curr], [])
        .filter((item) => event.detail.ids.map(Number).indexOf(item.id) >= 0)
      group.items.splice(event.detail.index, 0, ...newItems)
    },
    removed (event, group) {
      group.items = group.items
        .filter((item) => event.detail.ids.map(Number).indexOf(item.id) < 0)
    },
    reordered (event, group) {
      const reorderedItems =
        group.items.filter((item) => event.detail.ids.map(Number).indexOf(item.id) >= 0)
      const newItems = group.items
        .filter((item) => event.detail.ids.map(Number).indexOf(item.id) < 0)
      newItems.splice(event.detail.index, 0, ...reorderedItems)
      group.items = newItems
    },
    getStatuses () {
      this.$axios.get('/status')
        .then((response) => {
          this.groupsWithItems = response.data.data.map(status => {
            return {
              id: status.name,
              color: status.color,
              items: []
            }
          })
        }).catch((error) => console.log(error))
    },
    getUsers () {
      this.$axios.get('/user')
        .then((response) => {
          response.data.data.forEach((user) => {
            const userName = user.user_status.status.name

            this.groupsWithItems.forEach((group) => {
              if (userName === group.id) {
                group.items.push(user)
              }
            })
          })
        }).catch((error) => console.log(error))
    }
  }
}
</script>

<style>
.app-custom-list {
  min-width: 10rem;
  height: 90vh;
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
