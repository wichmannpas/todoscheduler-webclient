<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="schedule-task-dialog-label"
      aria-describedby="schedule-task-dialog-description">
    <form
        @submit.prevent="scheduleTask">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="schedule-task-dialog-dialog-label"
              class="mdc-dialog__header__title">
            Schedule Task
          </h2>
        </header>
        <section
            id="schedule-task-dialog-description"
            class="
              mdc-dialog__body
              mdc-dialog__body--scrollable
              mdc-dialog__body--big">

          <div class="mdc-layout-grid">
            <div class="mdc-layout-grid__inner">
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
                <strong>
                  Task Name
                </strong>
              </div>
              <div
                  class="
                    mdc-layout-grid__cell
                    mdc-layout-grid__cell--span-7
                    align-right">
                {{ task.name }}
              </div>
              <div
                  v-if="task.deadline !== null"
                  class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
                <strong>
                  Deadline
                </strong>
              </div>
              <div
                  v-if="task.deadline !== null"
                  class="
                    mdc-layout-grid__cell
                    mdc-layout-grid__cell--span-7
                    align-right">
                {{ task.prettyDeadline($store.state.time.today) }}
              </div>
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
                <strong>
                  Unscheduled Duration
                </strong>
              </div>
              <div
                  class="
                    mdc-layout-grid__cell
                    mdc-layout-grid__cell--span-7
                    align-right">
                {{ task.unscheduledDuration().toNumber() }}h
              </div>
              <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">
                <strong>
                  Total Duration
                </strong>
              </div>
              <div
                  class="
                    mdc-layout-grid__cell
                    mdc-layout-grid__cell--span-7
                    align-right">
                {{ task.duration.toNumber() }}h
              </div>
            </div>
          </div>

          <ScheduleTaskForm
            @complete="closeDialog"
            v-bind:task="task" />
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
            Schedule
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
import ScheduleTaskForm from '@/components/ScheduleTaskForm'

export default {
  name: 'ScheduleTaskDialog',
  props: [
    'task'
  ],
  components: {
    ScheduleTaskForm
  },
  methods: {
    scheduleTask () {
      this.$emit('schedule')
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
