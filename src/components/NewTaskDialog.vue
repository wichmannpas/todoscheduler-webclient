<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="new-task-dialog-label"
      aria-describedby="new-task-dialog-description">
    <form
        @submit.prevent="createTask">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="new-task-dialog-dialog-label"
              class="mdc-dialog__header__title">
            Create a New Task
          </h2>
        </header>
        <section
            id="new-task-dialog-description"
            class="
              mdc-dialog__body
              mdc-dialog__body--scrollable
              mdc-dialog__body--big">

          <TaskForm
              @submit="createTask"
              v-model="task"
              :autofocus="true"
              :loading="loading"
              :errors="errors"
          />

          <hr />

          <div
              ref="schedule"
              class="mdc-switch">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
              <div class="mdc-switch__thumb">
                  <input
                      v-model="schedule"
                      :disabled="loading"
                      type="checkbox"
                      id="task-schedule"
                      class="mdc-switch__native-control"
                      role="switch">
              </div>
            </div>
          </div>
          <label for="task-schedule">Schedule this task</label>

          <div
              ref="scheduleFor"
              class="mdc-select full-width-text-field"
              :class="{ hidden: !schedule }">
            <select
                v-model="scheduleFor"
                class="mdc-select__native-control">
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>
            <label class="mdc-floating-label mdc-floating-label--float-above">
              Schedule for
            </label>
            <div class="mdc-line-ripple"></div>
          </div>

          <div
              v-if="schedule && longDuration"
              class="warning">
            You are about to schedule a very long duration to a single day!
          </div>

          <Loading v-if="loading" />
        </section>
        <footer class="mdc-dialog__footer">
          <button
              @click="closeDialog"
              ref="cancel"
              type="button"
              class="
                mdc-button
                mdc-dialog__footer__button
                mdc-dialog__footer__button--cancel">
            Cancel
          </button>
          <button
              ref="submit"
              :disabled="loading"
              type="submit"
              class="
                mdc-button
                mdc-dialog__footer__button
                mdc-dialog__footer__button--accept">
            Create Task
          </button>
        </footer>
      </div>
    </form>
    <div
        @click="closeDialog"
        class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
import Vue from 'vue'
import { ripple, select, switchControl } from 'material-components-web'

import { createTask, scheduleTask } from '@/api/task'
import Loading from '@/components/Loading'
import TaskForm from '@/components/TaskForm'

export default {
  name: 'NewTaskDialog',
  components: {
    Loading,
    TaskForm
  },
  data: function () {
    return {
      ui: {
        cancelButton: null,
        submitButton: null,
        scheduleSwitch: null,
        scheduleForSelect: null
      },
      loading: false,
      schedule: false,
      scheduleFor: 'today',
      errors: [],
      task: {
        name: '',
        duration: 1,
        priority: 5,
        start: null,
        labelIds: []
      }
    }
  },
  mounted: function () {
    if (this.ui.cancelButton === null) {
      this.ui.cancelButton = new ripple.MDCRipple(this.$refs.cancel)
    }
    if (this.ui.submitButton === null) {
      this.ui.submitButton = new ripple.MDCRipple(this.$refs.submit)
    }

    if (this.ui.scheduleSwitch === null) {
      this.ui.scheduleSwitch = new switchControl.MDCSwitch(this.$refs.schedule)
    }

    if (this.ui.scheduleForSelect === null) {
      this.ui.scheduleForSelect = new select.MDCSelect(this.$refs.scheduleFor)
    }
  },
  computed: {
    longDuration () {
      return this.task.duration > this.$store.state.user.user.workhoursWeekday.toNumber()
    }
  },
  methods: {
    createTask () {
      this.loading = true

      createTask(this.$store, this.task).then(task => {
        if (this.schedule) {
          scheduleTask(
            this.$store,
            task,
            this.scheduleFor,
            this.task.duration
          ).then((response) => {
            this.loading = false
            Vue.set(this, 'errors', [])

            this.closeDialog()
          }).catch((response) => {
            this.loading = false

            Vue.set(this, 'errors', Object.keys(response))
          })
        } else {
          this.loading = false
          Vue.set(this, 'errors', [])

          this.closeDialog()
        }
      }).catch(error => {
        this.loading = false

        Vue.set(this, 'errors', Object.keys(error))
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
