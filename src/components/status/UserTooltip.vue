<template>
  <q-tooltip
    content-style="font-size: 16px"
    content-class="bg-amber text-black shadow-4"
    transition-show="rotate"
    transition-hide="rotate"
    :delay="1000"
  >
    <q-item-label><strong>Motivo: </strong> {{ user.user_status.reason.name }}</q-item-label>
    <q-item-label v-if="userHasPermission()">
      <strong>Desde: </strong> {{ fromHour }}
    </q-item-label>
    <q-item-label><strong>Previsto até às: </strong> {{ toHour }}</q-item-label>
    <q-item-label><strong>Anotações: </strong> {{ user.user_status.note }}</q-item-label>
  </q-tooltip>
</template>

<script>
export default {
  name: 'UserTooltip',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    fromHour: (vm) => {
      if (vm.user.user_status.from) {
        return vm.$globals
          .getTimeOrDateTime(vm.user.user_status.from)
      }
    },
    toHour: (vm) => {
      if (vm.user.user_status.to) {
        return vm.$globals
          .getTimeOrDateTime(vm.user.user_status.to)
      }
    }
  },
  methods: {
    userHasPermission () {
      const userLoggedRoles = this.$globals.logged_user.roles
      return this.$globals.userLoggedHasRoles(userLoggedRoles, ['ADMIN', 'MANAGER'])
    }
  }
}
</script>

<style>
</style>
