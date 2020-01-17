<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <th v-for="(col, index) in columns" :key="col">
          <slot name="header" :data="{ col, index }">{{ col }}</slot>
        </th>
      </thead>
      <tbody>
        <slot name="beforeFirstRow" />
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="(value, key) in row" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
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
