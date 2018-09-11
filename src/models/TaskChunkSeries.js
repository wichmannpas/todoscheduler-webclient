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

class TaskChunkSeries {
  id = -1
  taskId = -1
  duration = Decimal(0)
  start = new Date()
  end = null
  rule = ''
  intervalDays = null
  monthlyDay = null
  monthlyMonths = null
  monthlyweekdayWeekday = null
  monthlyweekdayNth = null

  task (store) {
    return store.state.task.tasks[this.taskId]
  }

  monthlyweekdayWeekdayPretty () {
    switch (this.monthlyweekdayWeekday) {
      case 0: return 'Monday'
      case 1: return 'Tuesday'
      case 2: return 'Wednesday'
      case 3: return 'Thursday'
      case 4: return 'Friday'
      case 5: return 'Saturday'
      case 6: return 'Sunday'
    }
  }

  description () {
    // TODO: use i18next to get proper plurals and formatting
    if (this.rule === 'interval') {
      return 'every ' + this.intervalDays.toString() + ' day(s)'
    } else if (this.rule === 'monthly') {
      return 'on ' + this.monthlyDay.toString() + '. every ' + this.monthlyMonths.toString() + ' month(s)'
    } else if (this.rule === 'monthlyweekday') {
      return 'on the ' + this.monthlyweekdayNth.toString() + '. ' + this.monthlyweekdayWeekdayPretty() + ' every ' + this.monthlyMonths.toString() + ' month(s)'
    }

    return 'invalid rule'
  }

  prettyStart (today) {
    return prettyDate(this.start, today)
  }

  prettyEnd (today) {
    return prettyDate(this.end, today)
  }
}

createModelSchema(TaskChunkSeries, {
  id: identifier(),
  taskId: alias('task_id', primitive()),
  duration: custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ),
  start: date(),
  end: date(),
  rule: primitive(),
  intervalDays: alias('interval_days', primitive()),
  monthlyDay: alias('monthly_day', primitive()),
  monthlyMonths: alias('monthly_months', primitive()),
  monthlyweekdayWeekday: alias('monthlyweekday_weekday', primitive()),
  monthlyweekdayNth: alias('monthlyweekday_nth', primitive())
})

export default TaskChunkSeries
