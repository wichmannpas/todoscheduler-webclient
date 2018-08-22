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
    }).catch((error) => handleGenericErrors(error, resolve, reject))
  })
}

export {
  fetchUser
}
