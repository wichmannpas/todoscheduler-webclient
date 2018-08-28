import {
  differenceInDays,
  format,
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
  parse
} from 'date-fns'

function formatDayString (day) {
  if (day === null) {
    return null
  }
  return format(day, 'YYYY-MM-DD')
}

function parseDayString (day) {
  return parse(day)
}

function naturalDay (day) {
  if (isYesterday(day)) {
    return 'yesterday'
  } else if (isToday(day)) {
    return 'today'
  } else if (isTomorrow(day)) {
    return 'tomorrow'
  }

  // TODO: use today from store
  let today = new Date()
  let dayDelta = differenceInDays(day, today)
  if (dayDelta <= 6 && dayDelta >= 0) {
    return format(day, 'dddd')
  }
  let result = format(day, 'MMMM D')

  let year = format(day, 'YYYY')
  if (year !== format(today, 'YYYY')) {
    result += ', ' + year
  }

  return result
}

function prettyDate (day) {
  if (isToday(day)) {
    return 'today'
  } else if (isTomorrow(day)) {
    return 'tomorrow'
  }

  // TODO: use today from store
  let today = new Date()

  // ensure date is not modified
  today = new Date(today.getTime())
  // use start of day
  // TODO: use start of day in today supplied from store
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)

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

function isPastDay (day) {
  return isPast(new Date(format(day, 'YYYY-MM-DD') + 'T23:59:59'))
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
 *
 * The index is used to look up the items based on their ids.
 *
 * If an equal item exists, the new item is inserted *after* the
 * existing item.
 */
function insertIndex (items, newItem, index) {
  for (let i = 0; i < items.length; i++) {
    let item = index[items[i]]

    if (item.compareTo(newItem) > 0) {
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
  formatDayString,
  insertIndex,
  isPastDay,
  naturalDay,
  parseDayString,
  prettyDate,
  priorityString
}
