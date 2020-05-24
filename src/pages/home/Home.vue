<template>
  <div class="q-pa-md" id="home">
      <dialog-change-status />
      <dialog-update-status />
      <list-status />
  </div>
</template>

<script>
import ListStatus from '../../components/status/ListStatus'
import DialogChangeStatus from '../../components/status/DialogChangeStatus'
import DialogUpdateStatus from '../../components/status/DialogUpdateStatus'

export default {
  name: 'Home',
  components: {
    ListStatus,
    DialogChangeStatus,
    DialogUpdateStatus
  }
}
</script>

<style>
</style>
