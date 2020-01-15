<template>
  <div>
    <Builder :data="data" :columns="columns" :demo="demo" />
  </div>
</template>

<script>
import Builder from "../components/builder/Main"
import demos from "../demos"

const { data, columns } = demos.movies

export default {
  components: { Builder },
  data: () => ({ data, columns, demo: "movies" }),
}
</script>
