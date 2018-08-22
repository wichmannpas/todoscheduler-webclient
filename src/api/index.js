import axios from 'axios'

import { fetchUser } from './user'

/**
 * Perform an API request in order to check the validity of the
 * available authentication token
 */
function checkAuth () {
  return new Promise(function (resolve, reject) {
    fetchUser().then(() => {
      resolve(true)
    }).catch(error => {
      if (error.message === 'no auth') {
        resolve(false)
      } else {
        reject(error)
      }
    })
  })
}

/**
 * Ensure that the axios default header configuration
 * contains the auth token if one is available.
 */
function ensureAuthToken () {
  let authToken = window.localStorage.getItem('authToken')
  if (authToken === null) {
    return false
  }
  axios.defaults.headers.common['Authorization'] = 'Token ' + authToken

  return true
}

/**
 * handle generic errors. Optional callback is called if the error is not generic.
 */
function handleGenericErrors (error, resolve, reject, callback) {
  let response = error.response
  if (response === null || response === undefined) {
    // connection problem
    if (reject !== undefined) {
      return reject(error)
    }

    throw error
  }

  if (response.status === 401) {
    // local auth token is not valid anymore, delete it
    window.localStorage.removeItem('authToken')

    if (reject !== undefined) {
      return reject(new Error('no auth'))
    }
  }

  if (callback !== undefined) {
    callback(error)
  } else {
    console.error(error)

    if (reject !== undefined) {
      reject(error)
    } else {
      throw error
    }
  }
}

export {
  checkAuth,
  ensureAuthToken,
  handleGenericErrors
}