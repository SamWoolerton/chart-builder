<template>
  <section>
    <div
      v-if="!selectedPreset && !selectedDemo && !anyValidLayers"
      class="mb-4"
    >
      <h3 class="text-xl">Quick start</h3>
      <div>
        <Dropdown
          :options="presetNames"
          :value="selectedPreset"
          @input="selectPreset"
        />
      </div>
    </div>

    <div>
      <h3 class="text-xl">Layers</h3>
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
          >{{ name }} {{ activeLayerIndex === index ? "(active)" : "" }}</option
        >
      </select>
      <div v-if="inactiveLayersErrors" class="text-red-600 text-sm">
        Some layers need attention
      </div>
      <button
        v-if="layersBase.length > 1"
        @click="$emit('deleteLayer', activeLayerIndex)"
      >
        Delete current layer
      </button>
    </div>

    <div class="mt-4">
      <h3 class="text-xl">
        Customise
        <span v-if="!editLayerName" @dblclick="editName">{{
          activeLayer.name
        }}</span>
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
          >Edit</span
        >
      </h3>
      <div v-if="!activeLayer.valid" class="mt-1 mb-4 text-red-700">
        This layer isn't valid yet.
      </div>

      <div class="mt-3">
        <div>
          <div class="font-semibold text-lg">Mark</div>
          <Dropdown
            :options="markOptions"
            :value="activeLayer.mark.type"
            @input="
              $emit('updateEncoding', {
                field: 'mark',
                value: { type: $event.target.value },
              })
            "
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

        <div class="mt-6">
          <button @click="$emit('clearLayer')">Clear layer</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Dropdown from "@/components/ui/Dropdown"
import SetEncoding from "./SetEncoding"

import { getEl } from "@/utility/functions"
import presets from "@/config/presets"

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
    selectedDemo: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    editLayerName: false,
    presetNames: Object.keys(presets),
    selectedPreset: null,
    markOptions: ["bar", "line", "area", "point", "tick", "boxplot"],
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
    anyValidLayers() {
      return this.augmentedLayers.some(({ valid }) => valid)
    },
  },
  methods: {
    selectPreset(event) {
      const { value } = event.target
      this.selectedPreset = value
      this.$emit("selectPreset", presets[value])
    },
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
