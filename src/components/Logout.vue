<template>
  <a
      class="c-hand"
      @click="logout">
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">exit_to_app</i>
    Log out
  </a>
</template>

<script>
import { logout } from '@/api/auth'

export default {
  name: 'Logout',
  methods: {
    logout () {
      logout().then(() => {
        this.$router.push({
          name: 'landing'
        })
        this.$store.commit('reset')
      })
    }
  }
}
</script>
