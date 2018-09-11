<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="edit-task-chunk-series-dialog-label"
      aria-describedby="edit-task-chunk-series-dialog-description">
    <form
        @submit.prevent="updateSeries">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="edit-task-chunk-series-dialog-dialog-label"
              class="mdc-dialog__header__title">
            Update Task Chunk Series
          </h2>
        </header>
        <section
            id="edit-task-chunk-series-dialog-description"
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
          <p>
            This series is scheduled {{ series.description() }}, starting {{ series.prettyStart($store.state.time.today) }}.
          </p>
          <p>
            You can change the end date of a series.
            When changing the end date, already scheduled task chunks of this series occuring <em>after</em> that end date are removed.
            When advancing the end date, new chunks may be scheduled.
          </p>
          <p>
            A series is not required to have an end date.
            If it does not have one, new chunks will regularly be scheduled.
          </p>

          <div
              class="mdc-text-field full-width-text-field">
            <input
                ref="endInput"
                v-model="end"
                id="series-end"
                type="date"
                class="mdc-text-field__input" />
            <label
                class="mdc-floating-label mdc-floating-label--float-above"
                for="series-end">
              Ends on
            </label>
          </div>
          <p
              v-if="errors.indexOf('end') >= 0"
              class="
                mdc-text-field-helper-text
                mdc-text-field-helper-text--validation-msg
                mdc-text-field-helper-text--persistent
                error">
            This is not a valid end date.
            <span
                v-if="errors.indexOf('start') >= 0">
              Make sure that it is not before the start date.
            </span>
          </p>

          <Loading
              v-if="loading" />

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
            Update series
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
import { updateTaskChunkSeries } from '@/api/taskchunk'
import Loading from '@/components/Loading'
import MergeTask from '@/components/MergeTask'
import TaskChunkSeriesForm from '@/components/TaskChunkSeriesForm'
import TaskChunkSeries from '@/models/TaskChunkSeries'

import { formatDayString } from '@/utils'

export default {
  name: 'EditTaskChunkSeriesDialog',
  components: {
    Loading,
    MergeTask,
    TaskChunkSeriesForm
  },
  props: [
    'series'
  ],
  data: function () {
    return {
      loading: false,
      errors: [],
      end: formatDayString(this.series.end)
    }
  },
  computed: {
    task () {
      return this.series.task(this.$store)
    }
  },
  methods: {
    updateSeries () {
      this.loading = true

      let series = Object.assign(new TaskChunkSeries(), this.series)
      series.start = formatDayString(series.start)
      series.end = this.end
      updateTaskChunkSeries(this.$store, series).then(response => {
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
