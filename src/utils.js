import {
  differenceInDays,
  format,
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
  parse
} from 'date-fns'
import Vue from 'vue'

function formatDayString (day) {
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
  if (dayDelta <= 7 && dayDelta >= 0) {
    return format(day, 'dddd')
  }
  return format(day, 'MMM. D, YYYY')
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
 * Get the index at which to insert a new item into an Array of
 * items based on the compareTo method.
 *
 * If an equal item exists, the new item is inserted *after* the
 * existing item.
 */
function insertIndex (items, newItem) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i]

    if (item.compareTo(newItem) > 0) {
      return i
    }
  }

  return items.length
}

/**
 * Update an item within an Array preserving the Array order.
 *
 * If the update of the item does not affect its position within
 * the Array, it is directly updated.
 * Otherwise, the item is removed from the Array and then re-added.
 *
 * It assumes the items to have an id property, and uses insertIndex
 * to determine the position based on the compareTo method.
 */
function updateWithOrder (arr, newItem) {
  let index = arr.findIndex(item => item.id === newItem.id)
  let newIndex = insertIndex(arr, newItem)

  if (newIndex !== index + 1) {
    // update affects ordering, delete and re-add item
    Vue.delete(
      arr,
      arr.findIndex(
        item => item.id === newItem.id))
    arr.splice(
      // re-calculate insert index as it might or might not be impacted
      // by deleting the previous version of the item
      insertIndex(arr, newItem),
      0,
      newItem)
  } else {
    // ordering is not affected, overwrite old task
    Vue.set(arr, index, newItem)
  }
}

export {
  dayDelta,
  formatDayString,
  insertIndex,
  isPastDay,
  naturalDay,
  parseDayString,
  updateWithOrder
}
