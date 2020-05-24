<template>
<q-toolbar class="row glossy text-white status-title" :class="status.color">

  <q-toolbar-title class="label text-center">{{ status.name }}</q-toolbar-title>

  <q-btn flat round dense icon="people" >
    <q-badge floating color="black">{{ status.users.length }}</q-badge>
  </q-btn>

</q-toolbar>
</template>

<script>
export default {
  name: 'ListStatusToolbar',
  props: {
    status: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.status-title {
  width: 17rem;
  border-style: ridge groove;
  border-radius: 30px
}
.label {
  color: black;
  font-weight: bold;
}
</style>
