<template>
<div class="q-pa-md row justify-center">
  <q-form
    @submit.prevent="onSubmit()"
    class="q-gutter-md">

    <q-layout class="layout">
      <q-bar class="bg-black glossy unelevated text-white text-center">
        <q-btn
          @click="goBack()"
        >
          <q-icon name="reply" class="text-white" />
          <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
            Voltar
          </q-tooltip>
        </q-btn>
        <q-toolbar-title>INFORMAÇÕES</q-toolbar-title>
      </q-bar>

      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
        class="q-mb-lg">

        <q-tab name="pessoais">
          <q-icon size="32px" name="account_box" class="text-back" />
          <q-item-label>Pessoais</q-item-label>
        </q-tab>
        <q-tab name="profissionais">
          <q-icon size="32px" name="work" class="text-back" />
          <q-item-label>Profissionais</q-item-label>
        </q-tab>
        <q-tab name="seguranca">
          <q-icon size="32px" name="security" class="text-back" />
          <q-item-label>Segurança</q-item-label>
        </q-tab>
        <q-tab name="configuracoes">
          <q-icon size="32px" name="settings" class="text-back" />
          <q-item-label>Configurações</q-item-label>
        </q-tab>

      </q-tabs>

      <q-tab-panels
          v-model="tab"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="text-center"
        >

        <q-tab-panel name="pessoais">
          <div class="div-uploader row justify-center">
            <q-uploader
              ref="image"
              url=""
              label="Foto de Perfil"
              color="black"
              accept="image/*"
            />
          </div>

          <q-input outlined
            ref="name"
            v-model="user.name"
            label="Nome*"
            placeholder=""
            hint=""
            :rules="[
              val => !!val || 'Nome obrigatório'
            ]">

            <template v-slot:prepend>
              <q-icon name="spellcheck" />
            </template>
          </q-input>

          <q-input outlined
            ref="email"
            type="email"
            v-model="user.email"
            label="Email*"
            hint="">

            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input outlined
            ref="birth"
            type="date"
            hint=""
            v-model="user.birth"
            label="Data de Nascimento*"
            :rules="[
              val => !!val || 'Data de nascimento obrigatória'
            ]"
          >

            <template v-slot:prepend>
              <q-icon name="today" />
            </template>
          </q-input>
        </q-tab-panel>
        <q-tab-panel name="profissionais">
          <q-select
            outlined
            v-model="user.department"
            :options="departments"
            :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
            :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'"
            label="Departamento*"
            :rules="[
              val => !!val || 'Departamento obrigatório'
            ]">

            <template v-slot:prepend>
              <q-icon name="work" />
            </template>
          </q-select>

          <q-select
            outlined
            v-model="user.workSchedule"
            :options="workSchedules"
            :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
            :option-label="opt => Object(opt) === opt && 'name' in opt ? `Das ${opt.begin} às ${opt.end}` : '- Null -'"
            label="Horário*"
            :rules="[
              val => !!val || 'Horário obrigatório'
            ]">

            <template v-slot:prepend>
              <q-icon name="schedule" />
            </template>
          </q-select>
        </q-tab-panel>

        <q-tab-panel name="seguranca">

          <q-input outlined
            ref="password"
            v-model="password"
            label="Nova senha*"
            type="password"
            placeholder=""
            hint=""
            :rules="[val => !!val || 'Senha obrigatória']"
          >

            <template v-slot:prepend>
              <q-icon name="vpn_key" />
            </template>
          </q-input>

          <q-input outlined
            ref="password"
            v-model="password"
            label="Confirmar senha*"
            type="password"
            placeholder=""
            hint=""
            :rules="[val => !!val || 'Senha obrigatória']"
          >

            <template v-slot:prepend>
              <q-icon name="vpn_key" />
            </template>
          </q-input>

        </q-tab-panel>
      </q-tab-panels>
      <div class= "div-btn">
        <q-btn
          glossy
          unelevated
          push
          type="submit"
          color="primary"
          text-color="black"
          class="full-width"
          size="lg"
        >
          <q-icon size="32px" name="edit" class="text-black" />
          Alterar
        </q-btn>
      </div>
    </q-layout>
  </q-form>
</div>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'Profile',

  data () {
    return {
      tab: 'pessoais',
      departments: this.getDepartments(),
      workSchedules: this.getWorkSchedules(),
      user: this.$globals.logged_user
    }
  },
  methods: {
    getDepartments () {
      this.$axios.get('/department')
        .then((response) => {
          if (response.data.data) {
            this.departments = response.data.data
          }
        })
    },
    getWorkSchedules () {
      this.$axios.get('/work-schedule')
        .then((response) => {
          if (response.data.data) {
            this.workSchedules = response.data.data
          }
        })
    },
    onSubmit () {
      const formData = new FormData()
      formData.append('name', this.user.name)
      formData.append('email', this.user.email)
      formData.append('birth', this.user.birth)
      formData.append('department', this.user.department.id)
      formData.append('work_schedule', this.user.workSchedule.id)
      formData.append('image', this.$refs.image.files[0])

      this.tryUpdate(formData)
    },
    tryUpdate (data) {
      this.$axios.post('/user/update', data)
        .then((response) => {
          LocalStorage.set('statuze_user', response.data.data)
          this.$router.push({ name: 'home' })
          this.$globals.showNotify('success', response.data.message)
        }).catch((error) => {
          this.$globals.showNotify('error', error.message)
        })
    },
    goBack () {
      this.$router.back()
    }
  }
}

</script>
<style scoped>
.div-btn {
  padding: 0 15px 0 15px;
}
.div-uploader {
  padding: 0 0 20px 0;
}
.layout {
  width: 90vw;
  background-color: #FFF;
}
</style>
