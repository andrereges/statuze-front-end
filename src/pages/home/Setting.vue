<template>
  <q-layout class="q-pa-md">
    <q-page-container class="row items-start q-gutter-md justify-center">
      <div class= "container">
        <div class="row justify-center" style="padding-bottom: 10px; font-size: 32px; color: white">
          PÁGINA: CONFIGURAÇÕES - EM CONSTRUÇÃO
        </div>
        <div class="row justify-center">
          <q-btn
            glossy
            color="primary"
            push
            label="Voltar"
            @click="goBack()"
          />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'Setting',

  data () {
    return {}
  },
  created () {},
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}

</script>
<style scoped>
</style>
