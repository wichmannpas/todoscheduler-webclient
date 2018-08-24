import Decimal from 'decimal.js-light'

import { isPastDay, naturalDay } from '@/utils'
import {
  alias,
  createModelSchema,
  custom,
  date,
  identifier,
  primitive
} from 'serializr'

class TaskChunk {
  id = -1
  taskId = -1
  day = new Date()
  dayOrder = -1
  duration = Decimal(0)
  finished = false

  task (store) {
    return store.getters.taskById(this.taskId)
  }

  past () {
    return isPastDay(this.day)
  }
  missed () {
    return !this.finished && this.past()
  }
  naturalDay () {
    return naturalDay(this.day)
  }

  /**
   * Compare to another task chunk.
   * returns negative values if < other
   * 0 if = other
   * positive values if > other
   */
  compareTo (other) {
    // first criterion: day
    if (this.day < other.day) {
      return -1
    } else if (this.day > other.day) {
      return 1
    }
    // day equals

    // second criterion: finished
    if (this.finished && !other.finished) {
      return -1
    } else if (!this.finished && other.finished) {
      return 1
    }
    // finished equals

    // third criterion: dayOrder
    if (this.dayOrder > other.dayOrder) {
      return 1
    } else if (this.dayOrder < other.dayOrder) {
      return -1
    }

    // all criterions equaled
    return 0
  }
}

createModelSchema(TaskChunk, {
  id: identifier(),
  taskId: alias('task', custom(
    val => { return { id: val } },
    val => val.id
  )),
  day: date(),
  dayOrder: alias('day_order', primitive()),
  duration: custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ),
  finished: primitive()
})

export default TaskChunk
