let snackbar

function initSnackbar (obj) {
  snackbar = obj
}

function showSnackbar (dataObj) {
  if (snackbar === undefined) {
    console.warn('could not show snackbar because it is not initialized')
    return
  }

  snackbar.show(dataObj)
}

export {
  initSnackbar,
  showSnackbar
}
