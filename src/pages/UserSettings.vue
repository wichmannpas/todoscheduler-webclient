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
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'

export default {
  name: 'UserSettings',
  components: {
    UserForm
  }
}
</script>
