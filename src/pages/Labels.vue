<template>
  <div class="container">
    <h1>
      Labels
    </h1>

    <p>
      You can manage your labels on this page.
    </p>

    <NewLabel />

    <LabelList
        v-if="$store.state.label.ready"
        @editLabel="editLabel"
        :labels="labels" />
    <Loading v-else />

    <EditLabelDialog
        @close="editDialogActive = false"
        v-if="editDialogActive"
        :label="editedLabel" />
  </div>
</template>

<script>
import { fetchData } from '@/fetch'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import EditLabelDialog from '@/components/EditLabelDialog'
import LabelList from '@/components/LabelList'
import Loading from '@/components/Loading'
import NewLabel from '@/components/NewLabel'
import UserForm from '@/components/UserForm'

export default {
  name: 'Labels',
  components: {
    ChangePasswordForm,
    EditLabelDialog,
    LabelList,
    Loading,
    NewLabel,
    UserForm
  },
  created: function () {
    fetchData(this.$store, this.$router)
  },
  data: function () {
    return {
      editDialogActive: false,
      editedLabel: null
    }
  },
  computed: {
    labels () {
      return this.$store.getters.orderedLabels
    }
  },
  methods: {
    editLabel (label) {
      if (this.editDialogActive === true) {
        console.warn('not opening edit dialog as it is already active')
        return
      }
      this.editedLabel = label
      this.editDialogActive = true
    }
  }
}
</script>
