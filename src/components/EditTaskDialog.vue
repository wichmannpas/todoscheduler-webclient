<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="edit-task-dialog-label"
      aria-describedby="edit-task-dialog-description">
    <form
        @submit.prevent="updateTask">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="edit-task-dialog-dialog-label"
              class="mdc-dialog__header__title">
            Edit Task
          </h2>
        </header>
        <section
            id="edit-task-dialog-description"
            class="
              mdc-dialog__body
              mdc-dialog__body--scrollable
              mdc-dialog__body--big">
          <div class="mdc-layout-grid">
            <div class="mdc-layout-grid__inner">
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
                <strong>
                  Scheduled Duration
                </strong>
              </div>
              <div
                  class="
                    mdc-layout-grid__cell
                    mdc-layout-grid__cell--span-7
                    align-right">
                {{ task.scheduledDuration.toNumber() }}h
              </div>
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
                <strong>
                  Finished Duration
                </strong>
              </div>
              <div
                  class="
                    mdc-layout-grid__cell
                    mdc-layout-grid__cell--span-7
                    align-right">
                {{ task.finishedDuration.toNumber() }}h
              </div>
            </div>
          </div>

          <TaskForm
              @submit="updateTask"
              v-model="editedTask"
              :autofocus="true"
              :loading="loading"
              :errors="errors"
          />
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
              type="submit"
              class="
                mdc-button
                mdc-dialog__footer__button
                mdc-dialog__footer__button--accept">
            Update task
          </button>
        </footer>
      </div>
    </form>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
import { updateTask } from '@/api/task'
import TaskForm from '@/components/TaskForm'

export default {
  name: 'EditTaskDialog',
  components: {
    TaskForm
  },
  props: [
    'task'
  ],
  data: function () {
    return {
      loading: false,
      errors: [],
      editedTask: Object.assign({}, this.task)
    }
  },
  methods: {
    updateTask () {
      this.loading = true

      let task = Object.assign({}, this.editedTask)
      task.id = this.task.id
      updateTask(this.$store, task).then((response) => {
        this.errors = []

        this.closeDialog()
      }).catch(error => {
        this.errors = Object.keys(error)
      }).finally(() => {
        this.loading = false
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
