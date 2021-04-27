<template>
  <q-drawer
    v-if="drawer"
    show-if-above
    side="left"
    :width="300"
    :breakpoint="500"
    bordered
    content-class="bg-grey-10"
  >
    <q-scroll-area class="scroll">
      <q-list v-for="(menuItem, index) in menuList" :key="index">

        <q-item clickable v-ripple exact @click="action(menuItem.action)" :to="menuItem.routerName">
          <q-item-section avatar>
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section>
            {{ menuItem.label }}
          </q-item-section>
        </q-item>

        <q-separator />

      </q-list>
    </q-scroll-area>
    <q-img class="absolute-top img" src="../../statics/background-picture.png">
      <div class="absolute-bottom bg-transparent text-center div-avatar">
        <q-avatar size="100px" class="q-mb-md">
          <img :src="user.image">
        </q-avatar>
        <div class="text-weight-bold">{{ user.name }}</div>
        <div>{{ user.department.name }}</div>
      </div>
      </q-img>
  </q-drawer>
</template>

<script>
import { LocalStorage } from 'quasar'
const menuList = [
  {
    icon: 'home',
    iconColor: 'black',
    label: 'Home',
    routerName: { name: 'home' }
  },
  {
    icon: 'account_box',
    iconColor: 'black',
    label: 'Perfil',
    routerName: { name: 'profile' }
  },
  {
    icon: 'list_alt',
    iconColor: 'black',
    label: 'Administração',
    routerName: { name: 'administration' }
  },
  {
    icon: 'comment',
    iconColor: 'black',
    label: 'Quadro de Sugestões',
    routerName: { name: 'suggestions' }
  },
  {
    icon: 'cake',
    iconColor: 'black',
    label: 'Aniversariantes do Mês',
    routerName: { name: 'birthdays' }
  },
  {
    icon: 'emoji_objects',
    iconColor: 'black',
    label: 'Sobre',
    routerName: { name: 'about' }
  },
  {
    icon: 'settings',
    iconColor: 'black',
    label: 'Configurações',
    routerName: { name: 'settings' }
  },
  {
    icon: 'exit_to_app',
    iconColor: 'black',
    label: 'Sair',
    action: 'logout'
  }
]

export default {
  props: {
    drawer: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      menuList
    }
  },
  methods: {
    logout () {
      LocalStorage.getAllKeys().forEach(key => LocalStorage.remove(key))

      this.$statuzeBackendAPI.post('/auth/logout')
        .then(() => {
          this.$router.push({ name: 'login' })
        })
        .catch(() => {
          this.$router.push({ name: 'login' })
        })
    },
    action (action) {
      this.$root.$emit('MenuLeft::close')

      if (typeof action !== 'undefined' || action) {
        this[action]()
      }
    }
  }
}
</script>

<style scoped>
.scroll {
  height: calc(100% - 200px);
  margin-top: 200px;
  border-right: 1px solid #ddd
}
.img {
  height: 200px
}
.div-avatar {
  font-size: 20px
}
</style>
