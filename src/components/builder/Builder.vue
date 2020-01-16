<template>
  <div id="builder-root" class="h-full">
    <div class="flex w-full pane-wrapper">
      <DataPane :columns="columns" />
      <EncodingPane
        :activeLayerIndex="activeLayerIndex"
        :layersBase="layersBase"
        :augmentedLayers="augmentedLayers"
        :columns="columns"
        @addLayer="addLayer"
        @selectLayer="activeLayerIndex = $event"
        @deleteLayer="deleteLayer"
        @updateEncoding="updateEncoding"
        @updateAggregation="updateAggregation"
      />
      <ConfigPane />
      <Chart :data="data" :layers="layers" />
    </div>
    <DownloadBar :layers="layers" />
  </div>
</template>

<script>
import deepmerge from "deepmerge"

import DataPane from "./DataPane"
import EncodingPane from "./EncodingPane"
import Chart from "./Chart"
import ConfigPane from "./ConfigPane"
import DownloadBar from "./DownloadBar"

import { mapObject, min } from "../../utility/functions"
import { validLayer, blankLayer } from "../../utility/layers"

import demos from "../../demos"

export default {
  components: {
    DataPane,
    EncodingPane,
    Chart,
    ConfigPane,
    DownloadBar,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    columns: {
      type: Object,
      required: true,
    },
    demo: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    layersBase: [blankLayer],
    activeLayerIndex: 0,
  }),
  watch: {
    demo: {
      handler(next) {
        // when demo is null, reset to base
        if (next === null) return (this.layersBase = [blankLayer])

        // when given a new demo, update layersBase to be that demo
        this.layersBase = demos[next].layersBase
      },
      immediate: true,
    },
  },
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
