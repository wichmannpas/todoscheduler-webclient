<template>
  <div>
    <div
        ref="search"
        class="mdc-text-field mdc-text-field--dense mdc-text-field--with-leading-icon full-width">
      <i
          ref="searchIcon"
          class="material-icons mdc-text-field__icon"
          role="button">
        search
      </i>
      <input
          v-model="searchString"
          id="search-string"
          type="text"
          class="mdc-text-field__input">
      <label
          for="search-string"
          class="mdc-floating-label">
        Search Tasks
        <span v-if="active && searchResults.length > 0">
          ({{ searchResults.length }} results)
        </span>
      </label>
      <div class="mdc-line-ripple"></div>
    </div>

    <TaskSearchResult
        v-if="active"
        :tasks="searchResults" />
  </div>
</template>

<script>
import { textField } from 'material-components-web'

import TaskSearchResult from '@/components/TaskSearchResult'

export default {
  name: 'TaskSearch',
  components: {
    TaskSearchResult
  },
  data: function () {
    return {
      searchString: '',
      ui: {
        searchInput: null,
        searchInputIcon: null
      }
    }
  },
  mounted: function () {
    if (this.ui.searchInput === null) {
      this.ui.searchInput = new textField.MDCTextField(this.$refs.search)
    }
    if (this.ui.searchInputIcon === null) {
      this.ui.searchInputIcon = new textField.MDCTextFieldIcon(this.$refs.searchIcon)
    }
  },
  computed: {
    searchResults () {
      return this.$store.getters.filteredTasks(this.searchString)
    },
    active () {
      return this.searchString.length > 0
    }
  }
}
</script>
