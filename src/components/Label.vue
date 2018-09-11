<template>
  <li
      @click="editLabel"
      class="mdc-list-item">
    <span class="mdc-list-item__text">
      <span
          class="mdc-list-item__primary-text">
        <span
            class="label"
            :style="{
              background: '#' + label.color,
              color: '#' + label.invertedColor()
            }">
          {{ label.title }}
        </span>
      </span>
      <span
          class="mdc-list-item__secondary-text">
        {{ label.description }}
      </span>
    </span>
    <span class="mdc-list-item__meta">
      <a
          @click="deleteLabel"
          class="label-action tooltip tooltip-left"
          data-tooltip="Delete Label">
        <i class="material-icons">
          clear
        </i>
      </a>
    </span>
  </li>
</template>

<script>
import { deleteLabel } from '@/api/label'

export default {
  name: 'Label',
  props: [
    'label'
  ],
  methods: {
    editLabel (event) {
      if (
        event.target.classList.contains('label-action') ||
        event.target.parentElement.classList.contains('label-action') ||
        event.target.parentElement.parentElement.classList.contains('label-action') ||
        event.target.parentElement.parentElement.parentElement.classList.contains('label-action')
      ) {
        // another action button was clicked, do not edit
        return
      }

      this.$emit('editLabel', this.label)
    },
    deleteLabel () {
      if (!confirm('Do you really want to delete this label?')) {
        return
      }

      deleteLabel(this.$store, this.label)
    }
  }
}
</script>
