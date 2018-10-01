<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="task-chunk-notes-dialog-label"
      aria-describedby="task-chunk-notes-dialog-description">
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
        <h3>
          Task Notes
        </h3>
        <textarea
            v-model="taskNotes"
            @keyup.enter="handleTaskNotesKeyup"
            class="full-width-text-field"
            :disabled="loading.taskNotes"
            :rows="taskNotesRows" />

        <Loading v-if="loading.taskNotes" />
        <h3>
          <a
              v-if="!editing.chunkNotes"
              @click="editing.chunkNotes = true"
              data-tooltip="Edit"
              class="c-hand tooltip">
            <i
                class="material-icons">
              edit
            </i>
          </a>
          <a
              v-else
              @click="updateChunkNotes"
              data-tooltip="Save"
              class="c-hand tooltip">
            <i
                class="material-icons">
              done
            </i>
          </a>
          Task Chunk Notes
        </h3>
        <textarea
            v-if="editing.chunkNotes"
            v-model="chunkNotes"
            @keyup.enter="handleChunkNotesKeyup"
            class="full-width-text-field"
            :disabled="loading.chunkNotes"
            :rows="chunkNotesRows" />
        <div
            v-else
            class="notes"
            @checkboxChange="chunkCheckboxChanged"
            @click="editChunkNotes"
            v-html="compiledChunkNotes">
        </div>

        <Loading v-if="loading.chunkNotes" />
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
          Close
        </button>
      </footer>
    </div>
    <div
        @click="closeDialog"
        class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
import Vue from 'vue'

import Loading from '@/components/Loading'
import { updateTaskNotes } from '@/api/task'
import { updateTaskChunkNotes } from '@/api/taskchunk'
import { compileMarkdown, setCheckbox, textareaRows } from '@/utils'

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
      loading: {
        chunkNotes: false,
        taskNotes: false
      },
      editing: {
        chunkNotes: false
      },
      chunkNotes: this.chunk.notes,
      taskNotes: this.chunk.task(this.$store).notes
    }
  },
  computed: {
    task () {
      return this.chunk.task(this.$store)
    },

    compiledChunkNotes () {
      return compileMarkdown(this.chunkNotes)
    },

    taskNotesRows () {
      return textareaRows(this.taskNotes)
    },
    chunkNotesRows () {
      return textareaRows(this.chunkNotes)
    }
  },
  methods: {
    editChunkNotes (event) {
      if (event !== undefined && event.target.tagName === 'INPUT') {
        // ignore clicks on inputs
        return
      }

      this.editing.chunkNotes = true
    },

    chunkCheckboxChanged (event) {
      this.chunkNotes = setCheckbox(
        this.chunkNotes, event.detail.occurrence, event.detail.checked)
      this.updateChunkNotes()
    },

    updateChunkNotes () {
      if (this.loading.chunkNotes === true) {
        return
      }

      this.loading.chunkNotes = true

      updateTaskChunkNotes(this.$store, this.chunk, this.chunkNotes).then(() => {
        this.editing.chunkNotes = false
      }).catch(response => {
        Vue.set(this, 'errors', Object.keys(response))
      }).finally(() => {
        this.loading.chunkNotes = false
      })
    },
    updateTaskNotes () {
      if (this.loading.taskNotes === true) {
        return
      }

      this.loading.taskNotes = true

      updateTaskNotes(this.$store, this.task, this.taskNotes).catch(response => {
        Vue.set(this, 'errors', Object.keys(response))
      }).finally(() => {
        this.loading = false
      })
    },
    closeDialog () {
      this.$emit('close')
    },
    handleChunkNotesKeyup (event) {
      if (event.ctrlKey || event.MetaKey) {
        this.updateChunkNotes()
      }
    },
    handleTaskNotesKeyup (event) {
      if (event.ctrlKey || event.MetaKey) {
        this.updateTaskNotes()
      }
    }
  }
}
</script>
