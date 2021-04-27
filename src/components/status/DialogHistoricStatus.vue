<template>
  <q-dialog
    v-model="dialog"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <div class="dialog">
      <q-layout view="Lhh lpR fff" class="bg-white">

        <q-page-container>

          <q-page padding>
            <q-timeline glossy color="primary">
              <q-timeline-entry
                :avatar="user.image"
                :subtitle="date"
                :title="user.name" />

              <q-timeline-entry v-for="userStatus in userStatuses" :key="userStatus.id">
                <div class="container">
                  <div class="row">
                    <div>
                      <template>
                        <q-icon size="20px" name="category" />
                        <span class="format-label"> STATUS:</span>
                      </template>
                      {{ userStatus.status.name }}
                    </div>
                  </div>
                  <div class="row">
                    <div>
                      <template>
                        <q-icon size="20px" name="short_text" />
                        <span class="format-label"> MOTIVO:</span>
                      </template>
                      {{ userStatus.reason.name }}
                    </div>
                  </div>
                  <div class="row">
                    <div>
                      <template>
                        <q-icon size="20px" name="access_time" />
                        <span class="format-label"> PERÍODO:</span>
                      </template>
                      {{ `Das ${userStatus.from} Até ${userStatus.to}` }}
                    </div>
                  </div>
                  <div class="row" v-if="userStatus.diff">
                    <div>
                      <template>
                        <q-icon size="20px" name="timer" />
                        <span class="format-label"> DURAÇÃO:</span>
                      </template>
                      {{ userStatus.diff }}
                    </div>
                  </div>
                  <div class="row" v-if="userStatus.note">
                    <div>
                      <template>
                        <q-icon size="20px" name="view_headline" />
                        <span class="format-label"> ANOTAÇÕES:</span>
                      </template>
                      {{ userStatus.note }}
                    </div>
                  </div>
                </div>
              </q-timeline-entry>

            </q-timeline>
          </q-page>

        </q-page-container>
      </q-layout>
    </div>
  </q-dialog>
</template>

<script>

export default {
  name: 'DialogHistoricStatus',
  data () {
    return {
      user: '',
      date: '',
      userStatuses: [],
      dialog: false
    }
  },
  created () {
    this.$root.$on('DialogHistoricStatus::show', (user) => {
      this.user = user
      this.date = this.$globals.formatDate('BR', 'BR')
      this.getUserInfo()
      this.dialog = true
    })
  },
  methods: {
    getUserInfo () {
      this.$statuzeBackendAPI.get(`/user-status/user/${this.user.id}/${this.$globals.getNow()}`)
        .then((response) => {
          if (response.data.data) {
            response.data.data.map(data => {
              this.userStatuses.push({
                id: data.id,
                from: this.$globals.getTime('BR', data.from),
                to: data.to ? this.$globals.getTime('BR', data.to) : '...',
                diff: data.to ? this.$globals.diffHourAndMinutes(data.from, data.to) : '',
                note: data.note,
                status: data.status_reason.status,
                reason: data.status_reason.reason
              })
            })
          }
        })
    }
  }
}
</script>
<style scoped>
.dialog {
  width: 100vw;
}
.format-label {
  padding-right: 5px;
  font-weight: bold;
}
</style>
