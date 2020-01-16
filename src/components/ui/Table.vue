<template>
  <table>
    <thead>
      <th v-for="(col, index) in columns" :key="col">
        {{ col }}
        <slot name="afterHeader" :data="{ index }" />
      </th>
    </thead>
    <tbody>
      <slot name="beforeFirstRow" />
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
