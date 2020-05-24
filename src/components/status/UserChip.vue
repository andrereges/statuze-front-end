<template>
    <q-chip class="zoom border-style">
      <q-avatar rounded size="48px">
        <img :src="user.image" width="50" height="50" class="border-style">
      </q-avatar>
      <q-item-label class="label">{{ user.nickName }}</q-item-label>
    </q-chip>
</template>

<script>
export default {
  name: 'UserTooltip',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.zoom:hover {
  transform: scale(1.1);
}
.border-style {
  border-style: ridge groove;
  border: solid
}
</style>
