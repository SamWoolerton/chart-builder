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
            @input="$event => { activeLayerIndex = +$event.target.value; editLayerName = false }"
            class="bg-gray-200 px-3 py-2 cursor-pointer"
          >
            <option
              v-for="({ name }, index) in augmentedLayers"
              :key="index"
              :value="index"
            >{{ name }} {{ activeLayerIndex === index ? "(active)" : "" }}</option>
          </select>
          <div v-if="inactiveLayersErrors" class="text-red-600 text-sm">Some layers need attention</div>
          <button
            v-if="layersBase.length > 1"
            @click="deleteLayer(activeLayerIndex)"
          >Delete current layer</button>
        </div>
        <div class="mt-4">
          <h3>
            Customise
            <span v-if="!editLayerName" @dblclick="editName">{{ activeLayer.name }}</span>
            <input
              v-else
              id="editLayerName"
              v-model="layersBase[activeLayerIndex].name"
              @blur="editLayerName = false"
              @keydown.enter="editLayerName = false"
            />
            <span
              v-if="!editLayerName"
              @click="editName"
              class="cursor-pointer bg-gray-200 px-2 py-1"
            >Edit</span>
          </h3>
          <div>
            <div>
              <div class="font-semibold text-lg">Mark</div>
              <Dropdown
                :options="['bar', 'line', 'area']"
                :value="activeLayer.mark"
                @input="
                  updateEncoding({ field: 'mark', value: $event.target.value })
                "
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

import { getEl, mapObject, min } from "../utility/functions"
import { validLayer, blankLayer } from "../utility/layers"

import demos from "../demos"

export default {
  components: { DataPane, Chart, ConfigPane, Dropdown, SetEncoding },
  data: () => ({
    ...demos.movies,
    activeLayerIndex: 0,
    editLayerName: false,
  }),
  computed: {
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

      const layers = this.layersBase.map(({ name, main, config }) =>
        deepmerge.all([{ name }, processMain(main), config]),
      )

      // if field is blank or undefined then undefined (filter invalid encodings out of spec)
      // if aggregate set and would be different to scale, unset scale
      return layers.map(({ name, mark, encoding }) => ({
        name,
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
    augmentedLayers() {
      return this.mergedLayers.map(layer => ({
        ...layer,
        valid: validLayer(layer),
      }))
    },
    activeLayer() {
      return this.augmentedLayers[this.activeLayerIndex]
    },
    inactiveLayersErrors() {
      return this.augmentedLayers.some(
        ({ valid }, index) => index !== this.activeLayerIndex && !valid,
      )
    },
    layers() {
      return (
        this.augmentedLayers
          .filter(({ valid }) => valid)
          // eslint-disable-next-line
          .map(({ valid, name, ...layer }) => layer)
      )
    },
  },
  methods: {
    async addLayer() {
      const length = this.layersBase.length
      this.layersBase.push({ ...blankLayer, name: `Layer ${length}` })
      await this.$nextTick()
      this.activeLayerIndex = length
    },
    deleteLayer(index) {
      // have to update active layer before removing current layer as it throws an error otherwise
      const newMaxIndex = this.layersBase.length - 2
      this.activeLayerIndex = min(index, newMaxIndex)
      this.layersBase.splice(index, 1)
    },
    updateEncoding({ field: type, value }) {
      if (type === "mark") {
        this.$set(this.layersBase[this.activeLayerIndex].main, "mark", value)
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
    async editName() {
      this.editLayerName = true
      await this.$nextTick()
      getEl("editLayerName").focus()
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
