<template>
  <div class="container">
    <h1>
      Legal Statement
    </h1>

    <h2>
      Information in accordance with § 5 TMG (German Telemedia Act)
    </h2>
    <p>
      This site is operated by:
    </p>
    <pre>{{ address }}</pre>
    <p>
      No guarantees of any kind are provided.
      You use this service on your own accord.
      The operator might shut this instance down at any moment without notice.
      The data privacy statement applies.
    </p>
  </div>
</template>

<script>
import { OPERATOR_ADDRESS } from '@/config'

export default {
  name: 'LegalStatement',
  computed: {
    address: function () {
      return OPERATOR_ADDRESS
    }
  }
}
</script>
