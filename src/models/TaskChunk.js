import { Decimal } from 'decimal.js-light'

import { objectToTask } from '@/models/Task'
import { isPastDay, naturalDay } from '@/utils'

function TaskChunk (id, task, day, dayOrder, duration, finished) {
  this.id = id
  this.task = task
  this.day = day
  this.dayOrder = dayOrder
  this.duration = Decimal(duration)
  this.finished = finished
}
TaskChunk.prototype.past = function () {
  return isPastDay(this.day)
}
TaskChunk.prototype.missed = function () {
  return !this.finished && this.past()
}
TaskChunk.prototype.naturalDay = function () {
  return naturalDay(this.day)
}

function objectToTaskChunk (chunk) {
  if (chunk instanceof TaskChunk) {
    return chunk
  }
  return new TaskChunk(
    chunk.id,
    objectToTask(chunk.task),
    chunk.day,
    chunk.day_order,
    chunk.duration,
    chunk.finished)
}

export {
  objectToTaskChunk,
  TaskChunk
}
