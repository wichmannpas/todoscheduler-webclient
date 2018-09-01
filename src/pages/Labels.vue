<template>
  <div class="container">
    <h1>
      Labels
    </h1>

    <p>
      You can manage your labels on this page.
    </p>

    <NewLabel />

    <div v-if="$store.state.label.ready">
      <div v-if="labels.length > 0">
        <EditableLabel
            v-for="label in labels"
            :key="label.title"
            :label="label"/>
      </div>
      <div v-else>
        <em>You have no labels yet.</em>
      </div>
    </div>
    <Loading v-else />
  </div>
</template>

<script>
import { fetchData } from '@/fetch'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import EditableLabel from '@/components/EditableLabel'
import Loading from '@/components/Loading'
import NewLabel from '@/components/NewLabel'
import UserForm from '@/components/UserForm'

export default {
  name: 'UserSettings',
  components: {
    ChangePasswordForm,
    EditableLabel,
    Loading,
    NewLabel,
    UserForm
  },
  created: function () {
    fetchData(this.$store, this.$router)
  },
  computed: {
    labels () {
      return this.$store.state.label.labels
    }
  }
}
</script>
