<template>
  <div>
    <button
        ref="newLabel"
        @click="dialogActive = true"
        class="mdc-button full-width">
      <i class="material-icons mdc-button__icon" aria-hidden="true">add</i>
      New Label
    </button>

    <NewLabelDialog
        @close="dialogActive = false"
        v-if="dialogActive" />
  </div>
</template>

<script>
import { ripple } from 'material-components-web'

import NewLabelDialog from '@/components/NewLabelDialog'

export default {
  name: 'NewLabel',
  data: function () {
    return {
      ui: {
        newLabelButton: null
      },
      dialogActive: false
    }
  },
  components: {
    NewLabelDialog
  },
  mounted: function () {
    if (this.ui.newLabelButton === null) {
      this.ui.newLabelButton = new ripple.MDCRipple(this.$refs.newLabel)
    }
  }
}
</script>
