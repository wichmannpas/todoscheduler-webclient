import Decimal from 'decimal.js-light'

import {
  alias,
  createModelSchema,
  custom,
  date,
  identifier,
  primitive
} from 'serializr'

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
