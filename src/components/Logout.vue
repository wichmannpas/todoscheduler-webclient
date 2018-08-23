<template>
  <div class="logout">
    <a
        class="c-hand tooltip tooltip-right"
        data-tooltip="Logout"
        @click="logout">
      <font-awesome-icon
          icon="sign-out-alt" />
    </a>
  </div>
</template>

<script>
import { logout } from '@/api/auth'

export default {
  name: 'Logout',
  methods: {
    logout () {
      logout().then(() => {
        this.$router.push({
          name: 'login'
        })
        this.$store.commit('reset')
      })
    }
  }
}
</script>
