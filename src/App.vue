<template>
  <div class="app">
    <div class="container">
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
  </div>
</template>

<script>
import { USE_IMPRINT } from '@/config'

export default {
  name: 'App',
  computed: {
    useImprint: function () {
      return USE_IMPRINT
    }
  },
  created: function () {
    window.handleMissingAuth = () => {
      if (this.$route.name !== 'login') {
        console.warn('auth no longer active, redirecting to login page')

        this.$router.push({
          name: 'login'
        })
      }

      this.$store.commit('reset')
    }
  }
}
</script>
