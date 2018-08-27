<template>
  <li
      class="mdc-list-item">
    <span
        v-if="task.finished()"
        class="material-icons mdc-list-item__graphics">
      done_all
    </span>
    <span
        v-else-if="task.completelyScheduled()"
        class="material-icons mdc-list-item__graphics">
      done
    </span>
    <span
        v-else-if="task.startInFuture()"
        class="material-icons mdc-list-item__graphics">
      brightness_3
    </span>
    <span
        v-else
        class="material-icons mdc-list-item__graphics">
      close
    </span>
    <span class="mdc-list-item__text">
      <span
          class="mdc-list-item__primary-text">
        {{ task.name }}
      </span>
      <span
          class="mdc-list-item__secondary-text">
        <span
            v-if="task.start !== null && task.startInFuture()">
          starts {{ task.prettyStart() }}
          &bull;
        </span>
        takes {{ task.duration.toNumber() }}h
        <span
            v-if="task.unscheduledDuration().comparedTo(0) > 0 && task.unfinishedDuration().comparedTo(0) > 0">
          ({{ task.unscheduledDuration().toNumber() }}h unscheduled, {{ task.unfinishedDuration().toNumber() }}h remaining)
        </span>
        <span
            v-else-if="task.unscheduledDuration().comparedTo(0) > 0">
          ({{ task.unscheduledDuration().toNumber() }}h unscheduled)
        </span>
        <span
            v-else-if="task.unfinishedDuration().comparedTo(0) > 0">
          ({{ task.unfinishedDuration().toNumber() }}h unfinished)
        </span>
      </span>
    </span>
    <span class="mdc-list-item__meta">
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
          v-if="!task.completelyScheduled()"
          @click="$emit('scheduleTask', task)"
          class="task-schedule tooltip"
          data-tooltip="Schedule">
        <font-awesome-icon
            icon="play" />
      </a>
    </span>

    <EditTaskModal
        @close="editModalActive = false"
        v-if="editModalActive"
        v-bind:task="task"
    />

  </li>
</template>

<script>
import { completeTask } from '@/api/task'
import EditTaskModal from '@/components/EditTaskModal'

export default {
  name: 'Task',
  props: [
    'task'
  ],
  data: function () {
    return {
      editModalActive: false
    }
  },
  components: {
    EditTaskModal
  },
  methods: {
    completeTask () {
      completeTask(this.$store, this.task)
    }
  }
}
</script>
