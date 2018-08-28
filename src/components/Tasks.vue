<template>
  <div
      v-if="ready">
    <NewTask />

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
          @editTask="editTask"
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
          @editTask="editTask"
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
          @editTask="editTask"
          @scheduleTask="scheduleTask"
          :tasks="completelyScheduledTasks" />
    </div>

    <EditTaskDialog
        @close="editDialogActive = false"
        v-if="editDialogActive"
        :task="editedTask" />
    <ScheduleTaskDialog
        @close="scheduleDialogActive = false"
        v-if="scheduleDialogActive"
        :task="scheduledTask" />
  </div>
  <Loading
      v-else />
</template>

<script>
import EditTaskDialog from '@/components/EditTaskDialog'
import Loading from '@/components/Loading'
import NewTask from '@/components/NewTask'
import ScheduleTaskDialog from '@/components/ScheduleTaskDialog'
import TaskList from '@/components/TaskList'

export default {
  name: 'Tasks',
  components: {
    EditTaskDialog,
    Loading,
    NewTask,
    ScheduleTaskDialog,
    TaskList
  },
  data: function () {
    return {
      editDialogActive: false,
      scheduleDialogActive: false,
      editedTask: null,
      scheduledTask: null,
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
    editTask (task) {
      if (this.editDialogActive === true) {
        console.warn('not opening edit dialog as it is already active')
        return
      }
      this.editDialogActive = true
      this.editedTask = task
    },
    scheduleTask (task) {
      if (this.scheduleDialogActive === true) {
        console.warn('not opening schedule dialog as it is already active')
        return
      }
      this.scheduleDialogActive = true
      this.scheduledTask = task
    }
  }
}
</script>
