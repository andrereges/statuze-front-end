<template>
  <q-item
    items-center
    :key="user.id"
    :data-id="user.id"
    class="app-custom-item"
    @dblclick="updateStatus(user)"
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
    updateStatus (user) {
      if (user.id !== this.$globals.logged_user.id) return
      this.statusNew = this.statusOld = user.user_status.status
      this.$root.$emit('dialogChangeStatus::show', this.statusNew, this.statusOld, user)
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
