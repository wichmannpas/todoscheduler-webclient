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
import MissedTaskChunk from '@/components/MissedTaskChunk'

export default {
  name: 'MissedTaskChunkList',
  components: {
    MissedTaskChunk
  },
  props: [
    'missedTaskChunks'
  ]
}
</script>
