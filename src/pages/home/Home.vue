<template>
  <div class="q-pa-md" id="home">
      <dialog-change-status />
      <list-status />
  </div>
</template>

<script>
import ListStatus from '../../components/status/ListStatus'
import DialogChangeStatus from '../../components/status/DialogChangeStatus'

export default {
  name: 'Home',
  components: {
    ListStatus,
    DialogChangeStatus
  }
}
</script>

<style>
</style>
