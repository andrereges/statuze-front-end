<template>
  <q-dialog
    v-model="dialog"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <div class="dialog">
      <q-layout view="Lhh lpR fff" class="bg-white">

        <q-header class="glossy bg-black">
          <q-toolbar>
            <q-btn
              :label="statusOld.name"
              class="glossy text-black status-title"
              :class="statusOld.color" />

            <q-icon size="32px" name="arrow_forward" class="text-white" />

            <q-btn
              :label="statusNew.name"
              class="glossy text-black status-title"
              :class="statusNew.color" />
            <q-btn v-close-popup round dense size="18px" icon="close" @click="cleanFields()" />
          </q-toolbar>
        </q-header>

        <q-page-container>

          <q-page padding>
            <q-form
              @submit.prevent="onSubmit()"
              class="q-gutter-md">

              <q-select
                ref="reason"
                outlined
                required
                v-model="reason"
                :options="statusWithReasons"
                :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : ''"
                :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : ''"
                label="Motivo*"
              >

                <template v-slot:prepend>
                  <q-icon name="short_text" />
                </template>
              </q-select>

              <q-input
                ref="expectedReturn"
                type="time"
                :label="expectedReturnLabel"
                outlined
                v-model="expectedReturn"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>

              <q-input outlined
                ref="note"
                :required="isNoteRequired"
                v-model="note"
                label="Anotação"
                type="textarea"
                maxlength="100"
                :hint="note.length + ' de 100'"
              >

                <template v-slot:prepend>
                  <q-icon name="view_headline" />
                </template>
              </q-input>

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

            </q-form>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </q-dialog>
</template>

<script>
import { Notify } from 'quasar'

export default {
  name: 'DialogChangeStatus',
  data () {
    return {
      statusWithReasons: [],
      expectedReturnLabel: '',
      statusOld: '',
      statusNew: '',
      reason: '',
      expectedReturn: '',
      note: '',
      dialog: false,
      isNoteRequired: false
    }
  },
  watch: {
    reason: function (newValue) {
      if (newValue.expectedReturn) {
        this.expectedReturn = this.$globals
          .createTime(newValue.expectedReturn)
      }

      if (newValue.name.toUpperCase() === 'OUTROS') {
        this.isNoteRequired = true
      }
    }
  },
  created () {
    this.$root.$on('dialogChangeStatus::show', (statusNew, statusOld) => {
      this.statusNew = statusNew
      this.statusOld = statusOld
      this.getStatuses()
      this.expectedReturnLabel = `${this.statusNew.name} até às`
      this.dialog = true
    })
  },
  methods: {
    getStatuses () {
      this.$axios.get(`/status/${this.statusNew.id}`)
        .then((response) => {
          if (response.data.data) {
            response.data.data.reasons.map(reason => {
              this.statusWithReasons.push({
                id: reason.id,
                name: reason.name,
                expectedReturn: reason.expected_return
              })
            })
          }
        })
    },
    hasErrorInForm (data) {
      if (!data.status && !data.reason) {
        return 'O informe os campos obrigatórios'
      }

      if (this.expectedReturn && this.expectedReturn <= this.$globals.getTime()) {
        return 'A hora prevista do status deve ser maior que a atual.'
      }

      return false
    },
    onSubmit () {
      let dateTime = ''
      if (this.expectedReturn) {
        dateTime = this.$globals
          .formatDateTime(this.expectedReturn)
      }

      const data = {
        status: this.statusNew.id,
        reason: this.reason.id,
        to: dateTime,
        note: this.note
      }

      const error = this.hasErrorInForm(data)
      if (error) {
        Notify.create({
          message: error,
          position: 'top',
          color: 'red',
          icon: 'thumb_down'
        })
      } else {
        this.tryChangeStatus(data)
        this.dialog = false
      }
    },
    tryChangeStatus (data) {
      this.$axios.post('/user-status', data)
        .then((response) => {
          this.$root.$emit('ListStatus::added', this.statusNew)
          this.$root.$emit('ListStatus::removed', this.statusOld)
          this.$globals.refreshPage()
        })
        .catch((error) => {
          Notify.create({
            message: error.message,
            position: 'top',
            color: 'red',
            icon: 'thumb_down'
          })
        })
    },
    cleanFields () {
      this.statusWithReasons = []
      this.note = ''
      this.reason = ''
      this.expectedReturn = ''
      this.expectedReturnLabel = ''
    }
  }
}
</script>
<style scoped>
.dialog {
  width: 350px;
  height: 500px;
  overflow: hidden;
  background-color: transparent;
}
.div-btn {
  width: 100%;
  padding: 0 15px 0 0;
}
</style>
