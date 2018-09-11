<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="task-chunk-notes-dialog-label"
      aria-describedby="task-chunk-notes-dialog-description">
    <form
        @submit.prevent="updateNotes">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="task-chunk-notes-dialog-dialog-label"
              class="mdc-dialog__header__title">
            {{ task.name }}
          </h2>
        </header>
        <section
            id="task-chunk-notes-dialog-description"
            class="
              mdc-dialog__body
              mdc-dialog__body--scrollable
              mdc-dialog__body--big">
          <textarea
              v-model="notes"
              class="full-width-text-field"
              :disabled="loading"
              rows="5" />
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
              type="submit"
              class="
                mdc-button
                mdc-dialog__footer__button
                mdc-dialog__footer__button--accept">
            Update notes
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

import Loading from '@/components/Loading'
import { updateTaskChunkNotes } from '@/api/taskchunk'

export default {
  name: 'EditTaskChunkNotesDialog',
  props: [
    'chunk'
  ],
  components: {
    Loading
  },
  data: function () {
    return {
      loading: false,
      notes: this.chunk.notes
    }
  },
  computed: {
    task () {
      return this.chunk.task(this.$store)
    }
  },
  methods: {
    updateNotes () {
      if (this.loading === true) {
        return
      }

      this.loading = true

      updateTaskChunkNotes(this.$store, this.chunk, this.notes).then(() => {
        this.$emit('close')
      }).catch(response => {
        Vue.set(this, 'errors', Object.keys(response))
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
