<template>
  <li
      @click="editTask"
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
        <span
            :class="{
              warning: task.deadlineWarning() && task.deadlineInFuture(),
              error: !task.deadlineInFuture()
            }"
            v-else-if="task.deadline !== null">
          due {{ task.prettyDeadline() }}
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
          ({{ task.unfinishedDuration().toNumber() }}h remaining)
        </span>
      </span>
    </span>
    <span class="mdc-list-item__meta">
      <a
          v-if="!task.completelyScheduled()"
          @click="completeTask()"
          class="task-action tooltip tooltip-left"
          data-tooltip="Complete task">
        <font-awesome-icon
            icon="check" />
      </a>
      <a
          v-if="!task.completelyScheduled()"
          @click="scheduleTask"
          class="task-action tooltip tooltip-left"
          data-tooltip="Schedule">
        <font-awesome-icon
            icon="play" />
      </a>
    </span>
  </li>
</template>

<script>
import { completeTask } from '@/api/task'

export default {
  name: 'Task',
  props: [
    'task'
  ],
  methods: {
    editTask (event) {
      if (
        event.target.classList.contains('task-action') ||
        event.target.parentElement.classList.contains('task-action') ||
        event.target.parentElement.parentElement.classList.contains('task-action') ||
        event.target.parentElement.parentElement.parentElement.classList.contains('task-action')
      ) {
        // another action button was clicked, do not edit
        return
      }

      this.$emit('editTask', this.task)
    },
    scheduleTask () {
      this.$emit('scheduleTask', this.task)
    },
    completeTask () {
      completeTask(this.$store, this.task)
    }
  }
}
</script>
