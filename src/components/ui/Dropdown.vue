<template>
  <select
    :value="value"
    @input="$emit('input', $event)"
    class="bg-gray-200 px-3 py-2 cursor-pointer"
  >
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
}
</script>
