<template>
    <div
        class="
          column
          col-3
          col-md-6
          col-sm-12"
        v-bind:class="[
          { 'past-day': day.past() },
          { 'current-day': day.today() },
          { 'overloaded-day': day.overloaded() }
        ]">
      <div class="header">
        {{ day.naturalDay() }}
        <span class="float-right">
        <span class="
          fa fa-clock-o
          tooltip tooltip-left"
              data-tooltip="Max duration for day">
        </span>&nbsp;{{ day.maxDuration().toNumber() }}h
      </span>
      </div>
      <div class="body">
        <TaskChunk
          v-for="chunk in day.taskChunks"
          v-bind:key="chunk.id"
          v-bind:chunk="chunk"/>
      </div>
      <div class="footer">
        <span class="float-right">
          <span class="fa fa-clock-o tooltip"
                data-tooltip="Remaining/total scheduled duration">
          </span>&nbsp;{{ day.remainingDuration().toNumber() }}h/{{ day.scheduledDuration().toNumber() }}h
        </span>
      </div>
    </div>
</template>

<script>
import TaskChunk from '@/components/TaskChunk'

export default {
  name: 'Day',
  props: [
    'day'
  ],
  components: {
    TaskChunk
  }
}
</script>
