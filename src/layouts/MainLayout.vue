<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black glossy text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Statuze App
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          @click="logout"
          arial-label="Logout">

          <q-icon name="exit_to_app"></q-icon>

        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <Menu
          v-for="link in links"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Menu from 'components/Menu'
import { LocalStorage, Notify } from 'quasar'

export default {
  name: 'MainLayout',

  components: {
    Menu
  },

  data () {
    return {
      leftDrawerOpen: false,
      links: [
        {
          title: 'Home',
          caption: 'Status',
          icon: 'access_time',
          link: '/'
        }
      ]
    }
  },
  methods: {
    logout () {
      this.$axios.post('/auth/logout')
        .then(() => {
          LocalStorage.remove('statuze_access_token')
          this.$router.push('/login')
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
