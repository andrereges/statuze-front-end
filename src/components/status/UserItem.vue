<template>
  <q-item
    items-center
    :key="user.id"
    :data-id="user.id"
    class="app-custom-item"
    @dblclick="historicStatus(user)"
  >

    <q-item-section avatar top class="q-ml-none q-pa-xs q-pa-md">
      <user-chip :user="user" />
      <user-tooltip :user="user" />
    </q-item-section>

  </q-item>
</template>

<script>
import UserTooltip from '../status/UserTooltip'
import UserChip from '../status/UserChip'

export default {
  name: 'UserStatus',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    UserTooltip, UserChip
  },
  methods: {
    historicStatus (user) {
      if (
        !this.$globals.userLoggedHasRoles(this.$globals.logged_user.roles, ['ADMIN', 'MANAGER']) &&
        user.id !== this.$globals.logged_user.id
      ) return

      this.$root.$emit('DialogHistoricStatus::show', this.user)
    }
  }
}
</script>

<style>
.app-custom-item[aria-grabbed="true"] {
  background: #5cc1a6;
  color: #fff;
}
</style>
