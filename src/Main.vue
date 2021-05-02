<template>
  <ul>
    <li v-for="item in items" :key="item"></li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: ["a", "b"]
    }
  },
})
</script>
