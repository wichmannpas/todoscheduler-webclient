<template>
  <div
      ref="snackbar"
      class="mdc-snackbar"
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden="true">
    <div class="mdc-snackbar__text">
    </div>
    <div class="mdc-snackbar__action-wrapper">
      <button type="button" class="mdc-snackbar__action-button"></button>
    </div>
  </div>
</template>

<script>
import { MDCSnackbar } from '@material/snackbar'

import { initSnackbar } from '@/snackbar'

export default {
  name: 'Snackbar',
  data: function () {
    return {
      ui: {
        snackbar: null
      }
    }
  },
  mounted: function () {
    if (this.ui.snackbar === null) {
      this.ui.snackbar = new MDCSnackbar(this.$refs.snackbar)
      initSnackbar(this.ui.snackbar)
    }
  }
}
</script>
