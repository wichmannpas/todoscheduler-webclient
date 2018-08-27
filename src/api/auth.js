import axios from 'axios'

import { API_URL } from '@/config'
import { ensureAuthToken, handleGenericErrors } from '@/api'

function login (username, password) {
  return new Promise(function (resolve, reject) {
    delete axios.defaults.headers.common['Authorization']

    axios.post(API_URL + '/auth/login/', {
      username: username,
      password: password
    }).then(
      function (response) {
        let authToken = response.data.token
        window.localStorage.setItem('authToken', authToken)
        resolve()
      }).catch(
      function (error) {
        let response = error.response
        let statusCode
        if (response !== undefined) {
          statusCode = response.status
        }
        if (statusCode === 401) {
          return reject(Error('invalid credentials'))
        }

        reject(error)
      })
  })
}

function logout () {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken) {
      // nothing to log out
      return resolve()
    }

    axios.delete(API_URL + '/auth/logout/').then(
      function (response) {
        if (response.status === 204) {
          return resolve()
        }
        reject(response.data)
      }).catch(error => handleGenericErrors(error, resolve, reject))

    delete axios.defaults.headers.common['Authorization']
  })
}

function register (username, password) {
  return new Promise(function (resolve, reject) {
    delete axios.defaults.headers.common['Authorization']

    axios.post(API_URL + '/auth/register/', {
      username: username,
      password: password
    }).then(
      function (response) {
        if (response.status === 201) {
          resolve()
        }
      }).catch(
      function (error) {
        let response = error.response
        let statusCode
        if (response !== undefined) {
          statusCode = response.status
        }
        if (statusCode === 400) {
          reject(Error('JSON' + JSON.stringify(response.data)))
        } else {
          reject(Error('connection error'))
        }
      })
  })
}

export {
  login,
  logout,
  register
}
