<template>
  <ul
      ref="list"
      class="mdc-list mdc-list--dense mdc-list--two-line"
      aria-orientation="vertical">
    <Label
        v-for="label in labels"
        :key="label.id"
        :label="label"
        @editLabel="editLabel"
        @scheduleLabel="scheduleLabel" />
  </ul>
</template>

<script>
import { MDCList } from '@material/list'

import Label from '@/components/Label'

export default {
  name: 'LabelList',
  components: {
    Label
  },
  props: [
    'labels'
  ],
  data: function () {
    return {
      ui: {
        list: null
      }
    }
  },
  mounted: function () {
    if (this.ui.list === null) {
      this.ui.list = new MDCList(this.$refs.list)
    }
  },
  methods: {
    editLabel (label) {
      this.$emit('editLabel', label)
    },
    scheduleLabel (label) {
      this.$emit('scheduleLabel', label)
    }
  }
}
</script>
