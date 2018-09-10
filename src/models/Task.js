import { differenceInDays } from 'date-fns'
import Decimal from 'decimal.js-light'
import {
  alias,
  createModelSchema,
  custom,
  date,
  identifier,
  list,
  primitive
} from 'serializr'

import { isAfterDay, prettyDate, priorityString } from '@/utils'

class Task {
  id = -1
  name = ''
  duration = Decimal(0)
  priority = 5
  start = null
  deadline = null
  labelIds = []
  scheduledDuration = Decimal(0)
  finishedDuration = Decimal(0)

  /**
   * Merge data of other task into this task.
   */
  mergeTaskData (other) {
    this.duration = this.duration.add(other.duration)
    this.scheduledDuration = this.scheduledDuration.add(other.scheduledDuration)
    this.finishedDuration = this.finishedDuration.add(other.finishedDuration)
  }

  priorityString () {
    return priorityString(this.priority)
  }

  labels (store) {
    return this.labelIds.map(labelId => store.state.label.labels[labelId]).filter(label => label !== undefined)
  }

  /**
   * Returns the default schedule duration of the user if the
   * unscheduled duration is greater than the max duration
   * to schedule by default, the unscheduled duration else.
   */
  defaultScheduleDuration (user) {
    let unscheduledDuration = this.unscheduledDuration()
    if (
      unscheduledDuration.comparedTo(0) > 0 &&
      (user.defaultScheduleFullDurationMax.comparedTo(unscheduledDuration) >= 0 ||
       user.defaultScheduleDuration.comparedTo(unscheduledDuration) >= 0)
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

  startInFuture (today) {
    if (this.start === null) {
      return
    }
    return isAfterDay(this.start, today)
  }

  deadlineInFuture (today) {
    if (this.deadline === null) {
      return
    }
    return isAfterDay(this.deadline, today)
  }

  prettyStart (today) {
    return prettyDate(this.start, today)
  }

  prettyDeadline (today) {
    return prettyDate(this.deadline, today)
  }

  deadlineWarning (today) {
    return !this.completelyScheduled() && differenceInDays(this.deadline, today) < 3
  }

  /**
   * Compare to another task.
   * returns negative values if < other
   * 0 if = other
   * positive values if > other
   */
  compareTo (other, today) {
    // first criterion: deadline
    if (this.deadline === null && other.deadline !== null) {
      return 1
    } else if (this.deadline !== null && other.deadline === null) {
      return -1
    } else if (this.deadline < other.deadline) {
      return -1
    } else if (this.deadline > other.deadline) {
      return 1
    }
    // deadline equals, use second criterion

    // second criterion: start
    if (this.start === null && other.start !== null && other.startInFuture(today)) {
      return -1
    } else if (this.start !== null && this.startInFuture(today) && other.start === null) {
      return 1
    } else if (other.startInFuture(today) && this.start < other.start) {
      return -1
    } else if (this.startInFuture(today) && this.start > other.start) {
      return 1
    }
    // start equals, use third criterion

    // third criterion: priority
    if (this.priority > other.priority) {
      return -1
    } else if (this.priority < other.priority) {
      return 1
    }
    // priority equals, use fourth criterion

    // fourth criterion: name
    return this.name.localeCompare(other.name)
  }

  matchesFilter (filter) {
    let lowerFilter = filter.toLocaleLowerCase()
    return this.name.toLocaleLowerCase().indexOf(lowerFilter) >= 0
  }
}

createModelSchema(Task, {
  id: identifier(),
  name: primitive(),
  duration: custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ),
  priority: primitive(),
  start: date(),
  deadline: date(),
  labelIds: alias('labels', list(primitive())),
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
