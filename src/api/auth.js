import axios from 'axios'

import { API_URL } from '@/config'

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
        console.error(error)
        let response = error.response
        let statusCode
        if (response !== undefined) {
          statusCode = response.status
        }
        if (statusCode === 400) {
          reject(Error('invalid credentials'))
        }

        reject(error)
      })
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
  register
}
