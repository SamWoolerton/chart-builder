<template>
  <table>
    <thead>
      <th v-for="col in columns" :key="col">{{ col }}</th>
    </thead>
    <tbody>
      <slot name="before-body" />
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="(value, key) in row" :key="key">{{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  computed: {
    columns() {
      return Object.keys(this.data[0])
    },
  },
}
</script>
