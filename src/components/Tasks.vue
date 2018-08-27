<template>
  <div
      v-if="ready">
    <NewTask />

    <MissedTaskChunks />

    <div class="mdc-list-group">
      <h3
          @click="show.openTasks = !show.openTasks"
          class="mdc-list-group__subheader c-hand">
        <i
            v-if="show.openTasks"
            class="material-icons headline-icon">expand_less</i>
        <i
            v-else
            class="material-icons headline-icon">expand_more</i>
        Open Tasks
      </h3>
      <TaskList
          v-if="show.openTasks"
          @scheduleTask="scheduleTask"
          :tasks="openTasks" />

      <h3
          @click="show.futureTasks = !show.futureTasks"
          class="mdc-list-group__subheader c-hand">
        <i
            v-if="show.futureTasks"
            class="material-icons headline-icon">expand_less</i>
        <i
            v-else
            class="material-icons headline-icon">expand_more</i>
        Future Tasks
      </h3>
      <TaskList
          v-if="show.futureTasks"
          @scheduleTask="scheduleTask"
          :tasks="futureTasks" />

      <h3
          @click="show.completelyScheduledTasks = !show.completelyScheduledTasks"
          class="mdc-list-group__subheader c-hand">
        <i
            v-if="show.completelyScheduledTasks"
            class="material-icons headline-icon">expand_less</i>
        <i
            v-else
            class="material-icons headline-icon">expand_more</i>
        Completely Scheduled Tasks
      </h3>
      <TaskList
          v-if="show.completelyScheduledTasks"
          @scheduleTask="scheduleTask"
          :tasks="completelyScheduledTasks" />
    </div>

    <ScheduleTaskDialog
        @close="scheduleDialogActive = false"
        v-if="scheduleDialogActive"
        v-bind:task="task" />
  </div>
  <Loading
      v-else />
</template>

<script>
import Loading from '@/components/Loading'
import MissedTaskChunks from '@/components/MissedTaskChunks'
import NewTask from '@/components/NewTask'
import ScheduleTaskDialog from '@/components/ScheduleTaskDialog'
import TaskList from '@/components/TaskList'

export default {
  name: 'Tasks',
  components: {
    Loading,
    MissedTaskChunks,
    NewTask,
    ScheduleTaskDialog,
    TaskList
  },
  data: function () {
    return {
      scheduleDialogActive: false,
      task: null,
      show: {
        openTasks: true,
        futureTasks: false,
        completelyScheduledTasks: false
      }
    }
  },
  computed: {
    ready () {
      return this.$store.state.task.ready
    },
    completelyScheduledTasks () {
      return this.$store.getters.completelyScheduledTasks
    },
    openTasks () {
      return this.$store.getters.incompletelyScheduledTasks.filter(
        task => !task.startInFuture())
    },
    futureTasks () {
      return this.$store.getters.incompletelyScheduledTasks.filter(
        task => task.startInFuture())
    }
  },
  methods: {
    scheduleTask (task) {
      if (this.scheduleDialogActive === true) {
        console.warn('not opening schedule dialog as it is already active')
        return
      }
      this.scheduleDialogActive = true
      this.task = task
    }
  }
}
</script>
