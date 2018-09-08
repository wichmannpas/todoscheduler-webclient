<template>
  <div>
    <aside
        ref="drawer"
        class="mdc-drawer mdc-drawer--temporary mdc-typography">
      <nav class="mdc-drawer__drawer">
        <header class="mdc-drawer__header">
          <div class="mdc-drawer__header-content">
            TodoScheduler
          </div>
        </header>
        <nav class="mdc-drawer__content mdc-list">
          <router-link
              @click.native="ui.drawer.open = false"
              :to="{ name: 'main' }"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>Home
          </router-link>
          <router-link
              @click.native="ui.drawer.open = false"
              :to="{ name: 'dataPrivacyStatement' }"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">location_city</i>Data Privacy Statement
          </router-link>
          <router-link
              @click.native="ui.drawer.open = false"
              :to="{ name: 'legalStatement' }"
              v-if="useLegalStatement"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">location_city</i>Legal Statement
          </router-link>
        </nav>
        <nav class="mdc-drawer__content mdc-list">
          <router-link
              v-if="$store.state.user.authenticated"
              @click.native="ui.drawer.open = false"
              :to="{ name: 'labels' }"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">label</i>Manage Labels
          </router-link>
          <router-link
              v-if="$store.state.user.authenticated"
              @click.native="ui.drawer.open = false"
              :to="{ name: 'userSettings' }"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>User Settings
          </router-link>
          <Logout
              v-if="$store.state.user.authenticated"
              @click.native="ui.drawer.open = false"
              class="mdc-list-item" />
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
          <section
              class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
              role="toolbar">
            <Sync
                v-if="$store.state.user.authenticated" />
          </section>
        </section>
      </div>
    </header>
  </div>
</template>

<script>
import { MDCTemporaryDrawer } from '@material/drawer'
import { MDCTopAppBar } from '@material/top-app-bar'

import { USE_LEGAL_STATEMENT } from '@/config'
import Logout from '@/components/Logout'
import Sync from '@/components/Sync'

export default {
  name: 'TopAppBar',
  components: {
    Logout,
    Sync
  },
  data: function () {
    return {
      ui: {
        drawer: null,
        topBar: null
      }
    }
  },
  computed: {
    useLegalStatement: function () {
      return USE_LEGAL_STATEMENT
    }
  },
  mounted: function () {
    if (this.ui.topBar === null) {
      this.ui.topBar = new MDCTopAppBar(this.$refs.topBar)
    }

    if (this.ui.drawer === null) {
      this.ui.drawer = new MDCTemporaryDrawer(this.$refs.drawer)
      this.$refs.menuButton.addEventListener('click', () => {
        this.ui.drawer.open = true
      })
    }
  }
}
</script>
