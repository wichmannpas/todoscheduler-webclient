<template>
  <aside
      ref="dialog"
      class="mdc-dialog mdc-dialog--open"
      aria-labelledby="new-label-dialog-label"
      aria-describedby="new-label-dialog-description">
    <form
        @submit.prevent="createLabel">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2
              id="new-label-dialog-dialog-label"
              class="mdc-dialog__header__title">
            Create a New Label
          </h2>
        </header>
        <section
            id="new-label-dialog-description"
            class="
              mdc-dialog__body
              mdc-dialog__body--scrollable
              mdc-dialog__body--big">

          <LabelForm
              @submit="createLabel"
              v-model="label"
              :autofocus="true"
              :loading="loading"
              :errors="errors"
          />

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
            Create Label
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
import { MDCRipple } from '@material/ripple'

import { createLabel } from '@/api/label'
import Loading from '@/components/Loading'
import LabelForm from '@/components/LabelForm'

export default {
  name: 'NewLabelDialog',
  components: {
    LabelForm,
    Loading
  },
  data: function () {
    return {
      ui: {
        cancelButton: null,
        submitButton: null
      },
      loading: false,
      errors: [],
      label: {
        title: '',
        description: '',
        color: '777777'
      }
    }
  },
  mounted: function () {
    if (this.ui.cancelButton === null) {
      this.ui.cancelButton = new MDCRipple(this.$refs.cancel)
    }
    if (this.ui.submitButton === null) {
      this.ui.submitButton = new MDCRipple(this.$refs.submit)
    }
  },
  computed: {
    longDuration () {
      return this.label.duration > this.$store.state.user.user.workhoursWeekday.toNumber()
    }
  },
  methods: {
    createLabel () {
      this.loading = true

      createLabel(this.$store, this.label).then((label) => {
        this.loading = false
        Vue.set(this, 'errors', [])

        this.closeDialog()
      }).catch((response) => {
        this.loading = false

        Vue.set(this, 'errors', Object.keys(response))
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
