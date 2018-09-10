<template>
  <div>
    <p>
      Search for a task to merge into this task.
      Upon merge, all chunks of the other task will be associated with this task.
    </p>

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
          id="merge-search-string"
          type="text"
          @keyup="success = false"
          @keyup.escape="clearSearch"
          class="mdc-text-field__input">
      <label
          for="merge-search-string"
          class="mdc-floating-label">
        Search Task for Merging
      </label>
      <span
          v-if="active"
          class="textfield-clear material-icons"
          @click="clearSearch">clear</span>
      <div class="mdc-line-ripple"></div>
    </div>

    <TaskSearchResult
        v-if="active"
        @editTask="mergeTask"
        :tasks="searchResults"
        :enableActions="false" />

    <p
        v-if="success"
        class="success">
      The task was successfully merged.
    </p>

    <Loading
        v-if="loading" />
  </div>
</template>

<script>
import { MDCTextField, MDCTextFieldIcon } from '@material/textfield'

import Loading from '@/components/Loading'
import TaskSearchResult from '@/components/TaskSearchResult'
import { mergeTask } from '@/api/task'

export default {
  name: 'MergeTask',
  props: [
    'task'
  ],
  components: {
    Loading,
    TaskSearchResult
  },
  data: function () {
    return {
      loading: false,
      success: false,
      searchString: '',
      ui: {
        searchInput: null,
        searchInputIcon: null
      }
    }
  },
  mounted: function () {
    if (this.ui.searchInput === null) {
      this.ui.searchInput = new MDCTextField(this.$refs.search)
    }
    if (this.ui.searchInputIcon === null) {
      this.ui.searchInputIcon = new MDCTextFieldIcon(this.$refs.searchIcon)
    }
  },
  computed: {
    searchResults () {
      return this.$store.getters.filteredTasks(this.searchString).filter(task => task.id !== this.task.id)
    },
    active () {
      return this.searchString.length > 0
    }
  },
  methods: {
    clearSearch () {
      this.searchString = ''
    },
    mergeTask (task) {
      if (!confirm(
        'Do you really want to merge “' +
        task.name +
        '” into this task? ' +
        'Information stored specifically with that task, such as its title, ' +
        'deadline, or notes, will be lost.')
      ) {
        return
      }

      this.clearSearch()
      this.loading = true
      mergeTask(
        this.$store,
        this.task,
        task
      ).then(() => {
        this.success = true
        setTimeout(() => {
          this.success = false
        }, 3000)
      }).finally(
        () => {
          this.loading = false
        })
    }
  }
}
</script>
