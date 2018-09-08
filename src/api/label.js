import axios from 'axios'
import { deserialize } from 'serializr'

import { API_URL } from '@/config'
import { ensureAuthToken, handleGenericErrors } from '@/api'
import Label from '@/models/Label'

function fetchLabels () {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.get(API_URL + '/label/label/').then(function (response) {
      resolve(
        response.data.map(raw => deserialize(Label, raw)))
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function createLabel (store, label) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.post(API_URL + '/label/label/', {
      title: label.title,
      description: label.description,
      color: label.color
    }).then(function (response) {
      if (response.status === 201) {
        let label = deserialize(Label, response.data)
        store.commit('addLabel', label)
        resolve(label)
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function updateLabel (store, label) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.put(API_URL + '/label/label/' + label.id.toString() + '/', {
      title: label.title,
      description: label.description,
      color: label.color
    }).then(function (response) {
      if (response.status === 200) {
        store.commit('updateLabel', deserialize(Label, response.data))
        resolve()
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

function deleteLabel (store, label) {
  return new Promise(function (resolve, reject) {
    if (!ensureAuthToken()) {
      reject(new Error('no auth'))
    }

    axios.delete(API_URL + '/label/label/' + label.id.toString() + '/').then(response => {
      if (response.status === 204) {
        store.commit('deleteLabel', label.id)
        resolve()
      } else {
        reject(response.data)
      }
    }).catch(error => handleGenericErrors(error, resolve, reject))
  })
}

export {
  createLabel,
  deleteLabel,
  fetchLabels,
  updateLabel
}
