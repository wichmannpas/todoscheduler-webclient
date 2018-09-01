import axios from 'axios'
import { deserialize } from 'serializr'

import { API_URL } from '@/config'
import { ensureAuthToken, handleGenericErrors } from '@/api'
import User from '@/models/User'

/**
 * Fetch the account of the authenticated user.
 */
function fetchUser () {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/base/user/').then((response) => {
      return resolve(deserialize(User, response.data))
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

/**
 * Update the user settings.
 * data may contain arbitrary attributes of a user. These are:
 * * workhoursWeekday
 * * workhoursWeekend
 * * defaultScheduleDuration
 * * defaultScheduleFullDurationMax
 * * password
 *
 * Additional attributes are ignored
 */
function updateUser (data) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.patch(API_URL + '/base/user/', {
      workhours_weekday: data.workhoursWeekday,
      workhours_weekend: data.workhoursWeekend,
      default_schedule_duration: data.defaultScheduleDuration,
      default_schedule_full_duration_max: data.defaultScheduleFullDurationMax,
      password: data.password
    }).then((response) => {
      return resolve(deserialize(User, response.data))
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

export {
  fetchUser,
  updateUser
}
