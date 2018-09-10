<template>
  <div
      v-if="active"
      class="mdc-snackbar mdc-snackbar--active"
      :class="{
        'mdc-snackbar--multiline': multiline
      }"
      aria-live="assertive"
      aria-atomic="true">
    <div class="mdc-snackbar__text">
      {{ text }}
    </div>
  </div>
</template>

<script>
import { initSnackbar } from '@/snackbar'

export default {
  name: 'Snackbar',
  data: function () {
    return {
      active: false,
      text: '',
      timeout: null
    }
  },
  mounted: function () {
    initSnackbar(this)
  },
  computed: {
    multiline () {
      return this.text.length > 40
    }
  },
  methods: {
    show ({ message }) {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }

      this.active = true
      this.text = message

      this.timeout = setTimeout(() => {
        this.active = false
      }, 3000)
    }
  }
}
</script>
