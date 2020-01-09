<template>
  <div>
    <h2>Chart builder</h2>
    <div class="flex w-full">
      <DataPane />
      <section>
        <div>
          <h3>Layers</h3>
          <button @click="layers.push({})">Add layer</button>
          <div v-if="layers.length === 0">You don't have any layers</div>
          <div v-else>
            <div
              v-for="(layer, index) in layers"
              :key="index"
              @click="activeLayer = index"
            >
              Layer {{ index }} {{ index === activeLayer ? "(active)" : "" }}
            </div>
          </div>
        </div>
        <div>
          <h3>Customise layer</h3>
          <div></div>
        </div>
      </section>
      <Chart :data="data" :layers="layers" />
      <ConfigPane />
    </div>
  </div>
</template>

<script>
import DataPane from "../components/DataPane"
import Chart from "../components/Chart"
import ConfigPane from "../components/ConfigPane"

export default {
  components: { DataPane, Chart, ConfigPane },
  data: () => ({
    data: {
      url: "https://vega.github.io/editor/data/movies.json",
    },
    activeLayer: 0,
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
