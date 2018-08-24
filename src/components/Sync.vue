<template>
  <div>
    <a
        class="c-hand tooltip tooltip-right"
        data-tooltip="Synchronize now"
        @click="sync">
      <font-awesome-icon
          icon="sync" />
    </a>
  </div>
</template>

<script>
import { fetchUser } from '@/api/user'

export default {
  name: 'Sync',
  methods: {
    sync () {
      fetchUser().then(user => {
        this.$store.commit('setUser', user)
      })

      // TODO: supply today from store
      this.$store.dispatch('fetchData', { ignoreReady: true })
    }
  }
}
</script>
