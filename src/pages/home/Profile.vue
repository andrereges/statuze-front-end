<template>
  <q-page class="q-pa-md row">
    <div class="col-md-6 offset-md-3">
      <q-bar class="bg-black glossy unelevated text-white">Perfil</q-bar>

      <q-card class="q-pa-md">

        <q-card-section class="text-center">
          <q-uploader
            url=""
            field-name="image"
            label="Foto de Perfil"
            color="black"
            accept="image/*"
          />
        </q-card-section>

        <q-card-section>
          <q-input outlined
            ref="name"
            v-model="user.name"
            label="Nome*"
            placeholder=""
            hint=""
            :rules="[
              val => !!val || 'Nome obrigatório'
            ]" />

          <q-input outlined
            ref="email"
            v-model="user.email"
            label="Email*"
            placeholder=""
            hint=""
            :rules="[
              val => !!val || 'Email obrigatório',
              val => this.validateEmail(val) || 'Formato de email inválido'
            ]" />

          <q-input outlined
            ref="birth"
            type="date"
            hint=""
            v-model="user.birth"
            label="Data de Nascimento*"
            :rules="[
              val => !!val || 'Data de nascimento obrigatória'
            ]"
          />

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
          </q-select>
        </q-card-section>

        <q-card-section>
          <q-btn
            glossy unelevated
            push
            color="primary"
            text-color="black"
            label="Atualizar"
            class="full-width"
            size="lg"
            @click="update"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { Notify, LocalStorage } from 'quasar'

export default {
  name: 'PageProfile',

  data () {
    return {
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
    // upload () {
    //   this.$axios.post('/user/upload')
    //     .catch((error) => {
    //       Notify.create({
    //         message: error.message,
    //         position: 'top',
    //         color: 'red',
    //         icon: 'error_outline'
    //       })
    //     })
    // },
    update () {
      const data = {
        name: this.user.name,
        email: this.user.email,
        birth: this.user.birth,
        department: this.user.department.id,
        work_schedule: this.user.workSchedule.id
      }

      this.tryUpdate(data)
    },
    tryUpdate (data) {
      this.$axios.post('/user/update', data)
        .then((response) => {
          LocalStorage.set('statuze_user', response.data.data)
          this.$globals.myFunctions.refreshPage()

          Notify.create({
            message: response.data.message,
            position: 'top',
            color: 'green',
            icon: ''
          })
        }).catch((error) => {
          Notify.create({
            message: error.message,
            position: 'top',
            color: 'red',
            icon: 'error_outline'
          })
        })
    }
  }
}

</script>
