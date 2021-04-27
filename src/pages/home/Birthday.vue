<template>
  <q-layout class="q-pa-md birthday">
    <q-page-container class="row items-start q-gutter-md justify-center">
      <q-card
        flat
        bordered
        class="my-card"
         v-for="user in users" :key="user.id"
        >
        <q-item>
          <q-item-section avatar>
            <q-avatar size="70px">
              <img :src="user.image">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
            <q-item-label caption>
              {{ user.birth }} - {{ user.age }} anos
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'Birthday',

  data () {
    return {
      users: []
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.$statuzeBackendAPI.get('/user/birthdays/' + new Date().getMonth())
        .then((response) => {
          if (response.data.data) {
            response.data.data.map(user => {
              this.users.push({
                id: user.id,
                name: user.name,
                age: this.$globals.calculateAge(user.birth),
                birth: this.$globals.formatDate('EN', 'BR', user.birth),
                image: user.image
              })
            })
          }
        })
    },
    goBack () {
      this.$router.back()
    }
  }
}

</script>
<style scoped>
.birthday {
  background-image: url("../../statics/birthday-background.jpg");
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
}
.my-card {
  border: solid;
  width: 300px;
  font-size: 14px;
  font-weight: bold;
}
.my-card:hover {
  transform: scale(1.2);
  z-index: 1000;
  border-style: ridge;
}
</style>
