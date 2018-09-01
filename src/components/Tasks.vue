<template>
  <div
      v-if="ready">
    <NewTask />

    <TaskSearch />

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
        <em
            v-if="show.openTasks">
          ({{ openTasks.length }})
        </em>
      </h3>
      <TaskList
          v-if="show.openTasks"
          @editTask="editTask"
          @scheduleTask="scheduleTask"
          :tasks="openTasks" />

      <h3
          @click="show.activeTasks = !show.activeTasks"
          class="mdc-list-group__subheader c-hand">
        <i
            v-if="show.activeTasks"
            class="material-icons headline-icon">expand_less</i>
        <i
            v-else
            class="material-icons headline-icon">expand_more</i>
        Active Tasks
        <em
            v-if="show.activeTasks">
          ({{ activeTasks.length }})
        </em>
      </h3>
      <TaskList
          v-if="show.activeTasks"
          @editTask="editTask"
          @scheduleTask="scheduleTask"
          :tasks="activeTasks" />

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
        <em
            v-if="show.futureTasks">
          ({{ futureTasks.length }})
        </em>
      </h3>
      <TaskList
          v-if="show.futureTasks"
          @editTask="editTask"
          @scheduleTask="scheduleTask"
          :tasks="futureTasks" />

      <h3
          @click="show.finishedTasks = !show.finishedTasks"
          class="mdc-list-group__subheader c-hand">
        <i
            v-if="show.finishedTasks"
            class="material-icons headline-icon">expand_less</i>
        <i
            v-else
            class="material-icons headline-icon">expand_more</i>
        Finished Tasks
        <em
            v-if="show.finishedTasks">
          ({{ finishedTasks.length }})
        </em>
      </h3>
      <TaskList
          v-if="show.finishedTasks"
          @editTask="editTask"
          @scheduleTask="scheduleTask"
          :tasks="finishedTasks" />
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
import TaskSearch from '@/components/TaskSearch'

export default {
  name: 'Tasks',
  components: {
    EditTaskDialog,
    Loading,
    NewTask,
    ScheduleTaskDialog,
    TaskList,
    TaskSearch
  },
  data: function () {
    return {
      editDialogActive: false,
      scheduleDialogActive: false,
      editedTask: null,
      scheduledTask: null,
      show: {
        activeTasks: false,
        openTasks: true,
        futureTasks: false,
        finishedTasks: false
      }
    }
  },
  computed: {
    ready () {
      return this.$store.state.task.ready
    },
    activeTasks () {
      return this.$store.getters.activeTasks
    },
    finishedTasks () {
      return this.$store.getters.finishedTasks
    },
    futureTasks () {
      return this.$store.getters.futureTasks(this.$store.state.time.today)
    },
    openTasks () {
      return this.$store.getters.openTasks(this.$store.state.time.today)
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
