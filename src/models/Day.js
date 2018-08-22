import { isToday } from 'date-fns'
import { Decimal } from 'decimal.js-light'

import { formatDayString, isPastDay, naturalDay } from '@/utils.js'

function Day (day, maxDuration, taskChunks) {
  this.day = day
  this.dayString = formatDayString(day)
  maxDuration = Decimal(maxDuration)
  this.maxDuration = () => maxDuration
  this.taskChunks = taskChunks
}
Day.prototype.scheduledDuration = function () {
  return aggregateTaskChunkDuration(this.taskChunks)
}
Day.prototype.finishedDuration = function () {
  return aggregateTaskChunkDuration(
    this.taskChunks.filter(
      item => item.finished))
}
Day.prototype.remainingDuration = function () {
  return this.scheduledDuration().sub(this.finishedDuration())
}
Day.prototype.overloaded = function () {
  return this.scheduledDuration().toNumber() > this.maxDuration().toNumber()
}
Day.prototype.naturalDay = function () {
  return naturalDay(this.day)
}
Day.prototype.past = function () {
  return isPastDay(this.day)
}
Day.prototype.today = function () {
  return isToday(this.day)
}

function aggregateTaskChunkDuration (taskChunks) {
  let result = Decimal(0)
  for (let i = 0; i < taskChunks.length; i++) {
    result = result.add(taskChunks[i].duration)
  }
  return result
}

export {
  Day
}
