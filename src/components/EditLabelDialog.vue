<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="edit-label-dialog-label"
      aria-describedby="edit-label-dialog-description">
    <form
        @submit.prevent="updateLabel">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="edit-label-dialog-dialog-label"
              class="mdc-dialog__header__title">
            Edit Label
          </h2>
        </header>
        <section
            id="edit-label-dialog-description"
            class="
              mdc-dialog__body
              mdc-dialog__body--scrollable
              mdc-dialog__body--big">
          <LabelForm
              @submit="updateLabel"
              v-model="editedLabel"
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
            Update label
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
import { updateLabel } from '@/api/label'
import LabelForm from '@/components/LabelForm'

export default {
  name: 'EditLabelDialog',
  components: {
    LabelForm
  },
  props: [
    'label'
  ],
  data: function () {
    return {
      loading: false,
      errors: [],
      editedLabel: Object.assign({}, this.label)
    }
  },
  methods: {
    updateLabel () {
      this.loading = true

      let label = Object.assign({}, this.editedLabel)
      label.id = this.label.id
      updateLabel(this.$store, label).then(response => {
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
