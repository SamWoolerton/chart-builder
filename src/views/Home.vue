<template>
  <div>
    <h2>Chart builder</h2>
    <Chart :data="data" :layers="layers" />
  </div>
</template>

<script>
import Chart from "../components/Chart"

export default {
  components: { Chart },
  data: () => ({
    data: {
      url: "https://vega.github.io/editor/data/movies.json",
    },
    layers: [
      {
        mark: "bar",
        encoding: {
          x: {
            field: "MPAA_Rating",
            type: "nominal",
          },
          y: {
            aggregate: "average",
            field: "IMDB_Rating",
            type: "quantitative",
            scale: { domain: [0, 10] },
          },
        },
      },
    ],
  }),
}
</script>
