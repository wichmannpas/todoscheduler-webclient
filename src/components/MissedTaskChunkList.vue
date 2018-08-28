<template>
  <ul
      ref="list"
      class="mdc-list mdc-list--dense mdc-list--two-line">
    <MissedTaskChunk
        v-for="chunk in missedTaskChunks"
        :key="chunk.id"
        :chunk="chunk" />
  </ul>
</template>

<script>
import { list } from 'material-components-web'

import MissedTaskChunk from '@/components/MissedTaskChunk'

export default {
  name: 'MissedTaskChunkList',
  components: {
    MissedTaskChunk
  },
  props: [
    'missedTaskChunks'
  ],
  data: function () {
    return {
      ui: {
        list: null
      }
    }
  },
  mounted: function () {
    if (this.ui.list === null) {
      this.ui.list = new list.MDCList(this.$refs.list)
    }
  }
}
</script>
