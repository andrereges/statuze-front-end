<template>
  <div id="q-app">
    <!-- <base-spinner/>
    <layout-notification/> -->
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
// import LayoutNotification from './layouts/LayoutNotification'
// import BaseSpinner from './components/global/BaseSpinner'

export default {
  name: 'App'
  // components: {
  //   BaseSpinner,
  //   LayoutNotification
  // },
  // mounted () {
  //   if (this.$globals.logged_user) {
  //     this.$router.push({ name: this.$globals.logged_user ? 'home' : 'login' })

  //     setTimeout(() => {
  //       this.$root.$emit('Spinner::hide')
  //     }, 300)
  //   }
  // }
}
</script>
