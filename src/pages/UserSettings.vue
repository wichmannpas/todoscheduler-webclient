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

    <h2>
      Configure this Client
    </h2>

    <p>
      By default, drag and drop is disabled on small screens and enabled on bigger screens.
      You can override this behavior here.
    </p>

    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input
            v-model="dragAndDrop"
            value="auto"
            class="mdc-radio__native-control"
            type="radio"
            id="settings-dragAndDrop-auto"
            name="settings-dragAndDrop" />
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="settings-dragAndDrop-auto">Automatically disable drag and drop on small screens</label>
    </div>
    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input
            v-model="dragAndDrop"
            value="always"
            class="mdc-radio__native-control"
            type="radio"
            id="settings-dragAndDrop-always"
            name="settings-dragAndDrop" />
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="settings-dragAndDrop-always">Always enable drag and drop</label>
    </div>
    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input
            v-model="dragAndDrop"
            value="never"
            class="mdc-radio__native-control"
            type="radio"
            id="settings-dragAndDrop-never"
            name="settings-dragAndDrop" />
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="settings-dragAndDrop-never">Never enable drag and drop</label>
    </div>
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
  },
  data () {
    let dragAndDrop = 'auto'

    let storedDragAndDrop = localStorage.getItem('drag-and-drop')
    if (storedDragAndDrop !== null) {
      dragAndDrop = storedDragAndDrop
    }

    return {
      dragAndDrop: dragAndDrop
    }
  },
  watch: {
    dragAndDrop (value) {
      localStorage.setItem('drag-and-drop', value)
    }
  }
}
</script>
