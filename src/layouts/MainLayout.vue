<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black glossy text-white">

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
              Início
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>

        <q-btn
          push
          flat
          dense
          round
          @click="profile"
          style="padding-right: 15px"
        >
          <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
            Perfil
          </q-tooltip>

          <div class="container text-center">
            <div class="row justify-center">
              <q-avatar size="42px">
                <img :src="loggedUser.image">
              </q-avatar>
            </div>
            <div class="row">
              {{ loggedUser.nickName }}
            </div>
          </div>

        </q-btn>

        <q-btn
          push
          flat
          dense
          round
          @click="logout"
          arial-label="Logout">

          <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
            Sair
          </q-tooltip>

          <q-icon size="42px" name="exit_to_app"></q-icon>

        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            fab
            icon="refresh"
            class="zoom glossy bg-amber text-black shadow-4"
            @click="refreshPage()"
          />
        </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'MainLayout',

  data () {
    return {
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
    logout () {
      LocalStorage.getAllKeys().forEach(key => LocalStorage.remove(key))

      this.$axios.post('/auth/logout')
        .then(() => {
          this.$router.push('/login')
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    profile () {
      this.$router.push('/profile')
    },
    index () {
      this.$router.push('/')
    },
    refreshPage () {
      this.$globals.refreshPage()
    }
  }
}
</script>
