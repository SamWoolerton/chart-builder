<template>
  <div>
    <div class="flex w-full pane-wrapper">
      <DataPane :columns="columns" />
      <section>
        <div>
          <h3>Layers</h3>
          <button @click="addLayer" class="my-2">Add layer</button>
          <div v-if="layersBase.length === 0">You don't have any layers</div>
          <select
            v-else
            :value="activeLayerIndex"
            @input="activeLayerIndex = +$event.target.value"
            class="bg-gray-200 px-3 py-2 cursor-pointer"
          >
            <option v-for="(layer, index) in layersBase" :key="index" :value="index">
              Layer {{ index + 1 }}
              {{ index === activeLayerIndex ? "(active)" : "" }}
            </option>
          </select>
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
            <SetEncoding
              :label="'Y axis'"
              :field="'y'"
              :encoding="activeLayer.encoding"
              :columns="columns"
              @updateField="updateEncoding"
              @updateAggregation="updateAggregation"
            />
            <SetEncoding
              :label="'X axis'"
              :field="'x'"
              :encoding="activeLayer.encoding"
              :columns="columns"
              @updateField="updateEncoding"
              @updateAggregation="updateAggregation"
            />
            <SetEncoding
              :label="'Colour'"
              :field="'color'"
              :encoding="activeLayer.encoding"
              :canBeBlank="true"
              :columns="columns"
              @updateField="updateEncoding"
              @updateAggregation="updateAggregation"
            />
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
import SetEncoding from "../components/custom/SetEncoding"

import { mapObject } from "../utility/functions"
import { validLayer, blankLayer } from "../utility/layers"

import { movies } from "../demos"

export default {
  components: { DataPane, Chart, ConfigPane, Dropdown, SetEncoding },
  data: () => ({
    ...movies,
    activeLayerIndex: 0,
  }),
  computed: {
    layerOptions() {
      return this.layersBase.map(
        (_layer, index) =>
          `Layer ${index + 1}${
            index === this.activeLayerIndex ? " (active)" : ""
          }`,
      )
    },
    mergedLayers() {
      // TODO: use Qim or equivalent to clean up this logic

      // replace encoding with values from column
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

      // if field is blank or undefined then undefined (filter invalid encodings out of spec)
      // if aggregate set and would be different to scale, unset scale
      return layers.map(({ mark, encoding }) => ({
        mark,
        encoding: mapObject(
          encoding,
          ([key, { aggregate, scale, field, ...rest }]) => [
            key,
            field === "" || field === undefined
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
      return this.mergedLayers.filter(validLayer)
    },
  },
  methods: {
    async addLayer() {
      const newLength = this.layersBase.push({ ...blankLayer })
      await this.$nextTick()
      this.activeLayerIndex = newLength - 1
    },
    updateEncoding({ field: type, value }) {
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
    updateAggregation({ field: type, value }) {
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
