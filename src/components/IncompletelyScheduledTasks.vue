<template>
  <div
      v-if="ready">
    <div
        v-if="incompletelyScheduledTasks.length > 0"
        style="
          max-height: 12em;
          overflow-x: hidden;
          overflow-y: auto;">
      <div class="columns">
        <div class="column col-6 col-sm-12">
          <ul>
            <IncompletelyScheduledTask
              v-for="task in activeTasks"
              v-bind:key="task.id"
              v-bind:task="task" />
          </ul>
        </div>
        <div class="column col-6 col-sm-12">
          <div class="accordion">
            <input type="checkbox" id="accordion-futureTasks" name="accordion-checkbox" hidden>
            <label class="accordion-header c-hand" for="accordion-futureTasks">
              <strong>
                Future Tasks
              </strong>
            </label>
            <div class="accordion-body">
              <ul>
                <IncompletelyScheduledTask
                  v-for="task in futureTasks"
                  v-bind:key="task.id"
                  v-bind:task="task" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
      v-else
      class="loading loading-lg">
  </div>
</template>

<script>
import IncompletelyScheduledTask from '@/components/IncompletelyScheduledTask'

export default {
  name: 'IncompletelyScheduledTasks',
  components: {
    IncompletelyScheduledTask
  },
  computed: {
    ready () {
      return this.$store.state.task.ready
    },
    incompletelyScheduledTasks () {
      return this.$store.getters.incompletelyScheduledTasks
    },
    activeTasks () {
      return this.$store.getters.incompletelyScheduledTasks.filter(
        task => !task.startInFuture())
    },
    futureTasks () {
      return this.$store.getters.incompletelyScheduledTasks.filter(
        task => task.startInFuture())
    }
  }
}
</script>
