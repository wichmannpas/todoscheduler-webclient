<template>
  <div>
    <h1>
      TodoScheduler
    </h1>

    <Login />

    <hr />

    <Register />
  </div>
</template>

<script>
import Login from '@/components/Login'
import Register from '@/components/Register'

export default {
  name: 'LoginPage',
  components: {
    Login,
    Register
  }
}
</script>
