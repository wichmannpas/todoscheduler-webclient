import axios from 'axios'

import { API_URL } from '@/config'

import { ensureAuthToken, handleGenericErrors } from '@/api'

/**
 * Fetch the account of the authenticated user.
 */
function fetchUser () {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/base/user/').then((response) => {
      // TODO: deserialize
      return resolve(response.data)
    }).catch((error) => handleGenericErrors(error, resolve, reject))
  })
}

export {
  fetchUser
}
