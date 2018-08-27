<template>
  <div>
    <button
        ref="newTask"
        @click="dialogActive = true"
        class="mdc-button">
      <i class="material-icons mdc-button__icon" aria-hidden="true">add</i>
      New Task
    </button>

    <NewTaskDialog
        @close="dialogActive = false"
        v-if="dialogActive" />
  </div>
</template>

<script>
import { ripple } from 'material-components-web'

import NewTaskDialog from '@/components/NewTaskDialog'

export default {
  name: 'NewTask',
  data: function () {
    return {
      ui: {
        newTaskButton: null
      },
      dialogActive: false
    }
  },
  components: {
    NewTaskDialog
  },
  mounted: function () {
    if (this.ui.newTaskButton === null) {
      this.ui.newTaskButton = new ripple.MDCRipple(this.$refs.newTask)
    }
  }
}
</script>
