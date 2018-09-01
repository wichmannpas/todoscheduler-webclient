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
  </li>
</template>

<script>
export default {
  name: 'Label',
  props: [
    'label'
  ],
  methods: {
    editLabel (event) {
      this.$emit('editLabel', this.label)
    }
  }
}
</script>
