<template>
  <div class="container">
    <h1>
      User Settings
    </h1>

    <p>
      You can change the settings of your user account on this page.
    </p>

    <UserForm
        :user="$store.state.user.user" />

    <h2>
      Change Your Password
    </h2>

    <ChangePasswordForm
        :user="$store.state.user.user" />
  </div>
</template>

<script>
import ChangePasswordForm from '@/components/ChangePasswordForm'
import UserForm from '@/components/UserForm'

export default {
  name: 'UserSettings',
  components: {
    ChangePasswordForm,
    UserForm
  }
}
</script>
