import { differenceInDays, format, parse } from 'date-fns'

import { TEXTAREA_MIN_ROWS, TEXTAREA_MAX_ROWS } from '@/config'

/**
 * Calculate the desired height of a textarea.
 */
function textareaRows (text) {
  if (text === null || text === undefined) {
    return TEXTAREA_MIN_ROWS
  }

  let lines = text.split('\n').length
  if (lines < TEXTAREA_MIN_ROWS) {
    return TEXTAREA_MIN_ROWS
  } else if (lines > TEXTAREA_MAX_ROWS) {
    return TEXTAREA_MAX_ROWS
  }
  return lines
}

/**
 * Set all values of a Date object with higher precision than day to zero.
 *
 * Date is modified in-place. For convenience, the date object is returned.
 */
function dayOfDate (date) {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date
}

function formatDayString (day) {
  if (day === null) {
    return null
  }
  return format(day, 'YYYY-MM-DD')
}

function parseDayString (day) {
  return parse(day)
}

function naturalDay (day, today) {
  day = dayOfDate(new Date(day.getTime()))
  let dayTime = day.getTime()

  let todayTime = today.getTime()
  let yesterdayTime = todayTime - 86400000
  let tomorrowTime = todayTime + 86400000
  if (yesterdayTime === dayTime) {
    return 'yesterday'
  } else if (todayTime === dayTime) {
    return 'today'
  } else if (tomorrowTime === dayTime) {
    return 'tomorrow'
  }

  let dayDelta = differenceInDays(day, today)
  if (dayDelta <= 6 && dayDelta >= 0) {
    return format(day, 'dddd')
  }
  let result = format(day, 'ddd, MMMM D')

  let year = format(day, 'YYYY')
  if (year !== format(today, 'YYYY')) {
    result += ', ' + year
  }

  return result
}

function prettyDate (day, today) {
  day = dayOfDate(new Date(day.getTime()))
  let dayTime = day.getTime()

  let todayTime = today.getTime()
  let tomorrowTime = todayTime + 86400000
  if (todayTime === dayTime) {
    return 'today'
  } else if (tomorrowTime === dayTime) {
    return 'tomorrow'
  }

  let dayDelta = differenceInDays(day, today)
  if (dayDelta <= 25 && dayDelta >= 0) {
    // use i18next with plural
    return 'in ' + dayDelta.toString() + ' day' + (dayDelta === 1 ? '' : 's')
  }
  let result = 'on ' + format(day, 'MMM. D')

  let year = format(day, 'YYYY')
  if (year !== format(today, 'YYYY')) {
    result += ' ' + year
  }

  return result
}

function isBeforeDay (day, other) {
  day = dayOfDate(new Date(day.getTime()))
  other = dayOfDate(new Date(other.getTime()))
  let dayTime = day.getTime()
  let otherTime = other.getTime()
  return dayTime < otherTime
}

function isAfterDay (day, other) {
  day = dayOfDate(new Date(day.getTime()))
  other = dayOfDate(new Date(other.getTime()))
  let dayTime = day.getTime()
  let otherTime = other.getTime()
  return dayTime > otherTime
}

function isToday (day, today) {
  day = dayOfDate(new Date(day.getTime()))
  let dayTime = day.getTime()
  let todayTime = today.getTime()
  return dayTime === todayTime
}

/**
 * Add the delta (in microseconds) to the string-formatted day.
 */
function dayDelta (day, delta) {
  let newDay = new Date(new Date(day).getTime() + delta)
  return formatDayString(newDay)
}

/**
 * Get the index at which to insert the id of a new item into an Array of
 * item ids based on the compareTo method.
 * The optional today argument is passed on as second parameter to compareTo.
 *
 * The index is used to look up the items based on their ids.
 *
 * If an equal item exists, the new item is inserted *after* the
 * existing item.
 */
function insertIndex (items, newItem, index, today) {
  for (let i = 0; i < items.length; i++) {
    let item = index[items[i]]

    if (item.compareTo(newItem, today) > 0) {
      return i
    }
  }

  return items.length
}

function priorityString (priority) {
  switch (priority) {
    case 0:
      return 'lowest'
    case 1:
    case 2:
      return 'lower'
    case 3:
    case 4:
      return 'low'
    case 5:
      return 'medium'
    case 6:
    case 7:
      return 'high'
    case 8:
    case 9:
      return 'higher'
    default:
      return 'highest'
  }
}

export {
  dayDelta,
  dayOfDate,
  formatDayString,
  insertIndex,
  isAfterDay,
  isBeforeDay,
  isToday,
  naturalDay,
  parseDayString,
  prettyDate,
  priorityString,
  textareaRows
}
