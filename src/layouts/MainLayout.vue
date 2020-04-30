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

        <div>v1.0.0</div>
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
        },
        {
          title: 'Login',
          caption: '',
          icon: 'account_circle',
          link: '/login'
        }
      ]
    }
  }
}
</script>
