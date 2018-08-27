<template>
  <div class="app">
    <aside
        ref="drawer"
        class="mdc-drawer mdc-drawer--temporary mdc-typography">
      <nav class="mdc-drawer__drawer">
        <header class="mdc-drawer__header">
          <div class="mdc-drawer__header-content">
            TodoScheduler
          </div>
        </header>
        <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
          <a class="mdc-list-item mdc-list-item--activated" href="#">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
          </a>
          <a class="mdc-list-item" href="#">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
          </a>
        </nav>
      </nav>
    </aside>
    <header
        ref="topBar"
        class="mdc-top-app-bar mdc-top-app-bar--fixed">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a
            ref="menuButton"
            class="
                c-hand
                material-icons
                mdc-top-app-bar__navigation-icon">
            menu
          </a>
          <span class="mdc-top-app-bar__title">
            TodoScheduler
          </span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Bookmark this page" alt="Bookmark this page">bookmark</a>
        </section>
      </div>
    </header>

    <div>
      <router-view />
    </div>

    <div class="footer">
      <hr />
      <a href="https://github.com/wichmannpas/todoscheduler">
        TodoScheduler</a>
      is free software.
      &bull;
      <router-link :to="{ name: 'main' }">Home</router-link>
      <span v-if="useImprint">
        &bull;
        <router-link :to="{ name: 'imprint' }">Imprint</router-link>
      </span>
    </div>

    <div
        ref="snackbar"
        class="mdc-snackbar"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden="true">
      <div class="mdc-snackbar__text">
      </div>
      <div class="mdc-snackbar__action-wrapper">
        <button type="button" class="mdc-snackbar__action-button"></button>
      </div>
    </div>
  </div>
</template>

<script>
import { drawer, snackbar, topAppBar } from 'material-components-web'

import { USE_IMPRINT } from '@/config'
import { initSnackbar } from '@/snackbar'

export default {
  name: 'App',
  data: function () {
    return {
      ui: {
        drawer: null,
        snackbar: null,
        topBar: null
      }
    }
  },
  computed: {
    useImprint: function () {
      return USE_IMPRINT
    }
  },
  created: function () {
    window.handleMissingAuth = () => {
      if (this.$route.name !== 'landing') {
        console.warn('auth no longer active, redirecting to landing page')

        this.$router.push({
          name: 'landing'
        })
      }

      this.$store.commit('reset')
    }
  },
  mounted: function () {
    if (this.ui.topBar === null) {
      this.ui.topBar = new topAppBar.MDCTopAppBar(this.$refs.topBar)
    }

    if (this.ui.drawer === null) {
      this.ui.drawer = new drawer.MDCTemporaryDrawer(this.$refs.drawer)
      this.$refs.menuButton.addEventListener('click', () => {
        this.ui.drawer.open = true
      })
    }

    if (this.ui.snackbar === null) {
      this.ui.snackbar = new snackbar.MDCSnackbar(this.$refs.snackbar)
      initSnackbar(this.ui.snackbar)
    }
  }
}
</script>
