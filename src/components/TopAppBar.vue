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
        <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
          <router-link
              @click.native="ui.drawer.open = false"
              :to="{ name: 'main' }"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>Home
          </router-link>
          <router-link
              @click.native="ui.drawer.open = false"
              :to="{ name: 'imprint' }"
              v-if="useImprint"
              class="mdc-list-item">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">location_city</i>Imprint
          </router-link>
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
            <Sync />
          </section>
        </section>
      </div>
    </header>
  </div>
</template>

<script>
import { drawer, topAppBar } from 'material-components-web'

import { USE_IMPRINT } from '@/config'
import Sync from '@/components/Sync'

export default {
  name: 'TopAppBar',
  components: {
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
    useImprint: function () {
      return USE_IMPRINT
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
  }
}
</script>
