import Decimal from 'decimal.js-light'

import {
  alias,
  createModelSchema,
  custom,
  identifier
} from 'serializr'

class User {
  username = ''
  workhoursWeekday = Decimal(0)
  workhoursWeekend = Decimal(0)
  defaultScheduleDuration = Decimal(0)
  defaultScheduleFullDurationMax = Decimal(0)
}

createModelSchema(User, {
  username: identifier(),
  workhoursWeekday: alias('workhours_weekday', custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  )),
  workhoursWeekend: alias('workhours_weekend', custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  )),
  defaultScheduleDuration: alias('default_schedule_duration', custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  )),
  defaultScheduleFullDurationMax: alias('default_schedule_full_duration_max', custom(
    val => { return val.toFixed() },
    val => { return new Decimal(val) }
  ))
})

export default User
