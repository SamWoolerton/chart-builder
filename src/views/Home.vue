<template>
  <div>
    <div class="flex w-full pane-wrapper">
      <DataPane :columns="columns" />
      <section>
        <div>
          <h3>Layers</h3>
          <button @click="addLayer" class="my-2">Add layer</button>
          <div v-if="layersBase.length === 0">You don't have any layers</div>
          <div v-else>
            <div
              v-for="(layer, index) in layersBase"
              :key="index"
              @click="activeLayerIndex = index"
              class="cursor-pointer"
            >
              Layer {{ index + 1 }}
              {{ index === activeLayerIndex ? "(active)" : "" }}
            </div>
          </div>
        </div>
        <div class="mt-4">
          <h3>Customise layer {{ activeLayerIndex + 1 }}</h3>
          <div>
            <div>
              <div class="font-semibold text-lg">Mark</div>
              <Dropdown
                :options="['bar', 'line', 'area']"
                :value="activeLayer.mark"
                @input="updateEncoding('mark', $event)"
              />
            </div>
            <div class="mt-2">
              <div class="font-semibold text-lg">Y axis</div>
              <Dropdown
                :options="Object.keys(columns)"
                :value="activeLayer.encoding.y.field"
                @input="updateEncoding('y', $event)"
              />
              <div
                v-if="activeLayer.encoding.y.field && columns[activeLayer.encoding.y.field].type === 'quantitative'"
              >
                <div class="text-gray-700 font-semibold text-sm mt-2">Aggregation (optional)</div>
                <Dropdown
                  :options="['', 'count', 'average', 'sum']"
                  :value="activeLayer.encoding.y.aggregate"
                  @input="updateAggregation('y', $event)"
                />
              </div>
              <div
                v-if="activeLayer.encoding.y.field && columns[activeLayer.encoding.y.field].scale"
                class="text-gray-700 text-sm mt-1"
              >Domain scale set to {{ columns[activeLayer.encoding.y.field].scale.domain }}</div>
            </div>
            <div class="mt-2">
              <div class="font-semibold text-lg">X axis</div>
              <Dropdown
                :options="Object.keys(columns)"
                :value="activeLayer.encoding.x.field"
                @input="updateEncoding('x', $event)"
              />
              <div
                v-if="activeLayer.encoding.x.field && columns[activeLayer.encoding.x.field].type === 'quantitative'"
              >
                <div class="text-gray-700 font-semibold text-sm mt-2">Aggregation (optional)</div>
                <Dropdown
                  :options="['', 'count', 'average', 'sum']"
                  :value="activeLayer.encoding.x.aggregate"
                  @input="updateAggregation('x', $event)"
                />
              </div>
              <div
                v-if="activeLayer.encoding.x.field && columns[activeLayer.encoding.x.field].scale"
                class="text-gray-700 text-sm"
              >Domain scale set to {{ columns[activeLayer.encoding.x.field].scale.domain }}</div>
            </div>
            <div class="mt-2">
              <div class="font-semibold text-lg">Colour</div>
              <Dropdown
                :options="['', ...Object.keys(columns)]"
                :value="activeLayer.encoding.color && activeLayer.encoding.color.field || ''"
                @input="updateEncoding('color', $event)"
              />
              <div
                v-if="activeLayer.encoding.color && columns[activeLayer.encoding.color.field].type === 'quantitative'"
              >
                <div class="text-gray-700 font-semibold text-sm mt-2">Aggregation (optional)</div>
                <Dropdown
                  :options="['', 'count', 'average', 'sum']"
                  :value="activeLayer.encoding.color.aggregate"
                  @input="updateAggregation('color', $event)"
                />
              </div>
              <div
                v-if="activeLayer.encoding.color && columns[activeLayer.encoding.color.field].scale"
                class="text-gray-700 text-sm mt-1"
              >Domain scale set to {{ columns[activeLayer.encoding.color.field].scale.domain }}</div>
            </div>
          </div>
        </div>
      </section>
      <ConfigPane />
      <Chart :data="data" :layers="layers" />
    </div>
  </div>
</template>

<script>
import deepmerge from "deepmerge"

import DataPane from "../components/DataPane"
import Chart from "../components/Chart"
import ConfigPane from "../components/ConfigPane"
import Dropdown from "../components/ui/Dropdown"

import { mapObject } from "../utility/functions"

export default {
  components: { DataPane, Chart, ConfigPane, Dropdown },
  data: () => ({
    data: {
      url: "https://vega.github.io/editor/data/movies.json",
    },
    columns: {
      IMDB_Rating: { type: "quantitative", scale: { domain: [0, 10] } },
      US_Gross: { type: "quantitative" },
      Worldwide_Gross: { type: "quantitative" },
      Production_Budget: { type: "quantitative" },
      MPAA_Rating: { type: "nominal" },
      Title: { type: "nominal" },
    },
    activeLayerIndex: 0,
    layersBase: [
      {
        main: {
          mark: "bar",
          encoding: {
            x: "MPAA_Rating",
            y: "IMDB_Rating",
            color: "IMDB_Rating",
          },
        },
        config: {
          encoding: {
            y: {
              aggregate: "average",
            },
            color: {
              aggregate: "average",
            },
          },
        },
      },
    ],
  }),
  computed: {
    mergedLayers() {
      const processMain = ({ mark, encoding }) => ({
        mark,
        encoding: mapObject(encoding, ([key, value]) => [
          key,
          { field: value, ...this.columns[value] },
        ]),
      })

      const layers = this.layersBase.map(({ main, config }) =>
        deepmerge(processMain(main), config),
      )

      return layers.map(({ mark, encoding }) => ({
        mark,
        encoding: mapObject(
          encoding,
          ([key, { aggregate, scale, field, ...rest }]) => [
            key,
            field === ""
              ? undefined
              : {
                  ...rest,
                  field,
                  aggregate,
                  scale:
                    aggregate === undefined ||
                    aggregate === "average" ||
                    aggregate === "median"
                      ? scale
                      : undefined,
                },
          ],
        ),
      }))
    },
    activeLayer() {
      return this.mergedLayers[this.activeLayerIndex]
    },
    layers() {
      const validLayer = layer =>
        !!layer.mark && !!layer.encoding.x.field && !!layer.encoding.y.field
      return this.mergedLayers.filter(validLayer)
    },
  },
  methods: {
    addLayer() {
      this.layersBase.push({
        main: { encoding: {} },
        config: { encoding: { x: {}, y: {} } },
      })
    },
    updateEncoding(type, event) {
      const { value } = event.target
      if (type === "mark") {
        this.layersBase[this.activeLayerIndex].main.mark = value
      } else if (type === "x" || type === "y" || type === "color") {
        this.$set(
          this.layersBase[this.activeLayerIndex].main.encoding,
          type,
          value,
        )
      }
    },
    updateAggregation(type, event) {
      const { value } = event.target
      this.$set(
        this.layersBase[this.activeLayerIndex].config.encoding[type],
        "aggregate",
        value,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  min-width: 200px;
}

@media (max-width: 1199px) {
  section {
    flex-grow: 1;
  }

  .pane-wrapper {
    flex-wrap: wrap;
  }
}
</style>
