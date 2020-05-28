<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black glossy text-white">

        <q-btn flat @click="drawer = !drawer" round dense :icon="iconMenu" />

        <menu-left :drawer="drawer" :user="loggedUser"/>

        <q-toolbar-title>
          <q-btn
            flat
            dense
            round
            size="18px"
            @click="index"
          >
            <q-avatar>
              <img src="../assets/logo.png">
            </q-avatar>

            <q-item-label style="padding-left: 10px; font-size: 28px">
              {{ this.$globals.appName }}
            </q-item-label>

            <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
              Home
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            fab
            icon="sync"
            class="zoom glossy bg-amber text-black shadow-4"
            @click="refreshPage()"
          />
        </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLeft from '../components/global/MenuLeft'

export default {
  name: 'MainLayout',
  components: {
    MenuLeft
  },
  beforeUpdate () {
    this.$root.$on('MenuLeft::close', () => {
      this.drawer = false
    })
  },
  computed: {
    iconMenu: (vm) => {
      if (vm.drawer) {
        return 'menu_open'
      }

      return 'menu'
    }
  },
  data () {
    return {
      drawer: false,
      loggedUser: this.$globals.logged_user,
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
    index () {
      this.$router.push('/')
    },
    refreshPage () {
      this.$globals.refreshPage()
    }
  }
}
</script>
