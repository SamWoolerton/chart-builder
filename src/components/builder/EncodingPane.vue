<template>
  <section>
    <div>
      <h3>Layers</h3>
      <button @click="$emit('addLayer')" class="my-2">Add layer</button>
      <div v-if="layersBase.length === 0">You don't have any layers</div>
      <select
        v-else
        :value="activeLayerIndex"
        @input="selectLayer"
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
        @click="$emit('deleteLayer', activeLayerIndex)"
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
            @input="$emit('updateEncoding', { field: 'mark', value: $event.target.value })"
          />
        </div>
        <SetEncoding
          :label="'Y axis'"
          :field="'y'"
          :encoding="activeLayer.encoding"
          :columns="columns"
          @updateField="$emit('updateEncoding', $event)"
          @updateAggregation="$emit('updateAggregation', $event)"
        />
        <SetEncoding
          :label="'X axis'"
          :field="'x'"
          :encoding="activeLayer.encoding"
          :columns="columns"
          @updateField="$emit('updateEncoding', $event)"
          @updateAggregation="$emit('updateAggregation', $event)"
        />
        <SetEncoding
          :label="'Colour'"
          :field="'color'"
          :encoding="activeLayer.encoding"
          :canBeBlank="true"
          :columns="columns"
          @updateField="$emit('updateEncoding', $event)"
          @updateAggregation="$emit('updateAggregation', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import Dropdown from "../ui/Dropdown"
import SetEncoding from "./SetEncoding"

import { getEl } from "../../utility/functions"

export default {
  components: {
    Dropdown,
    SetEncoding,
  },
  props: {
    activeLayerIndex: {
      type: Number,
      required: true,
    },
    layersBase: {
      type: Array,
      required: true,
    },
    augmentedLayers: {
      type: Array,
      required: true,
    },
    columns: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    editLayerName: false,
  }),
  computed: {
    activeLayer() {
      return this.augmentedLayers[this.activeLayerIndex]
    },
    inactiveLayersErrors() {
      return this.augmentedLayers.some(
        ({ valid }, index) => index !== this.activeLayerIndex && !valid,
      )
    },
  },
  methods: {
    selectLayer(event) {
      const { value: newLayer } = event.target
      this.$emit("selectLayer", +newLayer)
      this.editLayerName = false
    },
    async editName() {
      this.editLayerName = true
      await this.$nextTick()
      getEl("editLayerName").focus()
    },
  },
}
</script>