<template>
  <div class="app">
    <TopAppBar />

    <router-view />

    <Snackbar />
  </div>
</template>

<script>
import Snackbar from '@/components/Snackbar'
import TopAppBar from '@/components/TopAppBar'

export default {
  name: 'App',
  components: {
    Snackbar,
    TopAppBar
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
  }
}
</script>
