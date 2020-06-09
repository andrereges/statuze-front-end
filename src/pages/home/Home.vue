<template>
  <div class="q-pa-md" id="home">
      <dialog-change-status />
      <dialog-historic-status />
      <list-status />
  </div>
</template>

<script>
import ListStatus from '../../components/status/ListStatus'
import DialogChangeStatus from '../../components/status/DialogChangeStatus'
import DialogHistoricStatus from '../../components/status/DialogHistoricStatus'

export default {
  name: 'Home',
  components: {
    ListStatus,
    DialogChangeStatus,
    DialogHistoricStatus
  }
}
</script>

<style>
</style>
