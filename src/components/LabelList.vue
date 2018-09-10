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
import Label from '@/components/Label'

export default {
  name: 'LabelList',
  components: {
    Label
  },
  props: [
    'labels'
  ],
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
