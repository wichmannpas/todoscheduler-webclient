<template>
  <li>
    {{ task.name }}
    ({{ task.unscheduledDuration().toNumber() }}h)

    <EditTaskModal
        @close="editModalActive = false"
        v-if="editModalActive"
        v-bind:task="task"
    />

    <ScheduleTaskModal
        @close="scheduleModalActive = false"
        v-if="scheduleModalActive"
        v-bind:task="task"
    />

    <a class="task-edit tooltip"
        @click="editModalActive = true"
        data-tooltip="Edit task">
      <font-awesome-icon
          icon="pencil-alt" />
    </a>
    <a
        @click="completeTask()"
        class="tooltip"
        data-tooltip="Complete task">
      <font-awesome-icon
          icon="check" />
    </a>
    <a
        @click="scheduleModalActive = true"
        class="task-schedule tooltip"
        data-tooltip="Schedule">
      <font-awesome-icon
          icon="play" />
    </a>
  </li>
</template>

<script>
import { completeTask } from '@/api/task'
import EditTaskModal from '@/components/EditTaskModal'
import ScheduleTaskModal from '@/components/ScheduleTaskModal'

export default {
  name: 'IncompletelyScheduledTask',
  props: [
    'task'
  ],
  data: function () {
    return {
      editModalActive: false,
      scheduleModalActive: false
    }
  },
  components: {
    EditTaskModal,
    ScheduleTaskModal
  },
  methods: {
    completeTask () {
      completeTask(this.$store, this.task)
    }
  }
}
</script>
