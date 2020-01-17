<template>
  <!-- dynamically pass through all attributes and event listeners -->
  <VSelect
    :items="options"
    v-bind="$attrs"
    v-on="$listeners"
    class="w-full sm:w-64"
    filled
  />
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
}
</script>
