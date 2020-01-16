<template>
  <div class="h-full">
    <Data
      :baseData="baseData"
      :dataMethod="dataMethod"
      :columns="columns"
      :demo="demo"
    />
    <Builder :data="data" :columns="columns" :demo="demo" />
  </div>
</template>

<script>
import Data from "../components/data/Main"
import Builder from "../components/builder/Main"
import demos from "../demos"

const { data, dataMethod, columns } = demos.movies

export default {
  components: { Data, Builder },
  data: () => ({ baseData: data, dataMethod, columns, demo: "movies" }),
  computed: {
    data() {
      const { dataMethod } = this
      return { [dataMethod]: this.baseData[dataMethod] }
    },
  },
}
</script>
