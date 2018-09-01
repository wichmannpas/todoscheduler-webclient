<template>
  <div class="container">
    <h1>
      User Settings
    </h1>

    <p>
      You can change the settings of your user account on this page.
    </p>

    <div v-if="$store.state.user.ready">
      <UserForm
          :user="$store.state.user.user" />

      <h2>
        Change Your Password
      </h2>

      <ChangePasswordForm
          :user="$store.state.user.user" />
    </div>
    <Loading v-else />
  </div>
</template>

<script>
import { fetchData } from '@/fetch'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import Loading from '@/components/Loading'
import UserForm from '@/components/UserForm'

export default {
  name: 'UserSettings',
  components: {
    ChangePasswordForm,
    Loading,
    UserForm
  },
  created: function () {
    fetchData(this.$store, this.$router)
  }
}
</script>
