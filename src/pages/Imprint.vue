<template>
  <div class="container">
    <h1>
      Imprint
    </h1>

    <h2>
      Information in accordance with § 5 TMG (German Telemedia Act)
    </h2>
    <p>
      This site is operated by:
    </p>
    <pre>{{ imprintAddress }}</pre>
    <p>
      No guarantees of any kind are provided.
      You use this service on your own accord.
      The operator might shut this instance down at any moment without notice.
    </p>
  </div>
</template>

<script>
import { IMPRINT_ADDRESS } from '@/config'

export default {
  name: 'Login',
  computed: {
    imprintAddress: function () {
      return IMPRINT_ADDRESS
    }
  }
}
</script>
