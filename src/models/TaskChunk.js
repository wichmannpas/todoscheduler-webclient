import Decimal from 'decimal.js-light'

import { isAfterDay, isBeforeDay, naturalDay } from '@/utils'
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
  seriesId = null
  day = new Date()
  dayOrder = -1
  duration = Decimal(0)
  finished = false

  task (store) {
    return store.state.task.tasks[this.taskId]
  }

  series (store) {
    if (this.seriesId === null) {
      return null
    }

    return store.state.taskchunkseries.taskChunkSeries[this.seriesId]
  }

  past (today) {
    return isBeforeDay(this.day, today)
  }
  missesDeadline (store) {
    if (this.task.deadline === null) {
      return false
    }
    let task = this.task(store)
    if (task.deadline === null) {
      return false
    }

    return isAfterDay(this.day, this.task(store).deadline)
  }
  missed () {
    return !this.finished && this.past()
  }
  naturalDay (today) {
    return naturalDay(this.day, today)
  }

  highlighted (store) {
    return store.state.taskchunk.highlightedChunks[this.id] === true
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
  seriesId: alias('series', primitive()),
  day: date(),
  dayOrder: alias('day_order', primitive()),
  duration: custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ),
  finished: primitive()
})

export default TaskChunk
