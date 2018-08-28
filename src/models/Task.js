import { differenceInDays, isAfter } from 'date-fns'
import Decimal from 'decimal.js-light'
import {
  alias,
  createModelSchema,
  custom,
  date,
  identifier,
  primitive
} from 'serializr'

import { prettyDate } from '@/utils'

class Task {
  id = -1
  name = ''
  duration = Decimal(0)
  start = null
  deadline = null
  scheduledDuration = Decimal(0)
  finishedDuration = Decimal(0)

  /**
   * Returns the default schedule duration of the user if the
   * unscheduled duration is greater than the max duration
   * to schedule by default, the unscheduled duration else.
   */
  defaultScheduleDuration (user) {
    let unscheduledDuration = this.unscheduledDuration()
    if (
      user.defaultScheduleFullDurationMax.comparedTo(unscheduledDuration) >= 0 ||
      user.defaultScheduleDuration.comparedTo(unscheduledDuration) >= 0
    ) {
      return unscheduledDuration
    }

    return user.defaultScheduleDuration
  }

  unscheduledDuration () {
    return this.duration.sub(this.scheduledDuration)
  }
  completelyScheduled () {
    return this.scheduledDuration.comparedTo(this.duration) === 0
  }
  unfinishedDuration () {
    return this.duration.sub(this.finishedDuration)
  }
  finished () {
    return (this.completelyScheduled() &&
      this.finishedDuration.comparedTo(this.duration) === 0)
  }

  // TODO: use today argument (from store)
  startInFuture () {
    let today = new Date()

    return isAfter(this.start, today)
  }

  // TODO: use today argument (from store)
  deadlineInFuture () {
    let today = new Date()

    return isAfter(this.deadline, today)
  }

  // TODO: use today argument (from store)
  prettyStart () {
    return prettyDate(this.start)
  }

  // TODO: use today argument (from store)
  prettyDeadline () {
    return prettyDate(this.deadline)
  }

  // TODO: use today argument (from store)
  deadlineWarning () {
    let today = new Date()

    return !this.completelyScheduled() && differenceInDays(this.deadline, today) < 3
  }

  /**
   * Compare to another task.
   * returns negative values if < other
   * 0 if = other
   * positive values if > other
   */
  compareTo (other) {
    // first criterion: start
    if (this.start === null && other.start !== null) {
      return -1
    } else if (this.start !== null && other.start === null) {
      return 1
    } else if (this.start < other.start) {
      return -1
    } else if (this.start > other.start) {
      return 1
    }
    // start equals, use second criterion

    // second criterion: deadline
    if (this.deadline === null && other.deadline !== null) {
      return 1
    } else if (this.deadline !== null && other.deadline === null) {
      return -1
    } else if (this.deadline < other.deadline) {
      return -1
    } else if (this.deadline > other.deadline) {
      return 1
    }
    // deadline equals, use third criterion

    // third criterion: name
    return this.name.localeCompare(other)
  }
}

createModelSchema(Task, {
  id: identifier(),
  name: primitive(),
  duration: custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ),
  start: date(),
  deadline: date(),
  scheduledDuration: alias('scheduled_duration', custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  )),
  finishedDuration: alias('finished_duration', custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ))
})

export default Task
