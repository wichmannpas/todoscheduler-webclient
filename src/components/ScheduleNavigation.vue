<template>
  <div>
    <div
        ref="chipSet"
        class="mdc-chip-set flex-align-center">
      <div
          @click="previousWeek"
          class="mdc-chip" tabindex="0">
        <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">
          navigate_before
        </i>
        <div class="mdc-chip__text">
          Previous week
        </div>
      </div>
      <div
          @click="currentWeek"
          class="mdc-chip"
          tabindex="0">
        <div class="mdc-chip__text">Current week</div>
      </div>
      <div
          @click="nextWeek"
          class="mdc-chip" tabindex="0">
        <div class="mdc-chip__text">
          Next week
        </div>
        <i
            ref="trailingChipIcon"
            class="material-icons mdc-chip__icon">
          navigate_next
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import { addDays, subDays } from 'date-fns'

import { MDCChipSet } from '@material/chips'

export default {
  name: 'ScheduleNavigation',
  props: [
    'firstDay'
  ],
  data: function () {
    return {
      ui: {
        chipSet: null
      }
    }
  },
  mounted: function () {
    if (this.ui.chipSet === null) {
      this.ui.chipSet = new MDCChipSet(this.$refs.chipSet)

      // the trailing icon removes the chip from the set by default, thus
      // the --trailing class must be added after initializing MDCChipSet
      this.$refs.trailingChipIcon.classList.add('mdc-chip__icon--trailing')
    }
  },
  methods: {
    previousWeek () {
      let firstDay = subDays(this.firstDay, 7)

      this.$emit('navigate', firstDay)
    },
    currentWeek () {
      this.$emit('navigate', null)
    },
    nextWeek () {
      let firstDay = addDays(this.firstDay, 7)

      this.$emit('navigate', firstDay)
    }
  }
}
</script>
