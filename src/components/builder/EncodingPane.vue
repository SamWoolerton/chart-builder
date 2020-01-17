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
      <h3 class="text-xl mb-2">Layers</h3>
      <div v-if="layersBase.length === 0">You don't have any layers</div>
      <Dropdown
        v-else
        :options="layerOptions"
        :value="activeLayerIndex"
        @input="selectLayer"
        class="w-full sm:w-full"
      />
      <div v-if="inactiveLayersErrors" class="text-red-600 text-sm">
        Some layers need attention
      </div>
      <div class="flex flex-wrap my-2">
        <button @click="$emit('addLayer')" class="primary mr-2 mt-2">
          Add layer
        </button>
        <button
          @click="$emit('clearLayer')"
          class="warning text-orange-100 mr-2 mt-2"
        >
          Clear layer
        </button>
        <button
          v-if="layersBase.length > 1"
          @click="$emit('deleteLayer', activeLayerIndex)"
          class="warning text-orange-100 mt-2"
        >
          Delete current layer
        </button>
      </div>
    </div>

    <div class="mt-4">
      <h3 class="text-xl">
        Customise
        <span v-if="!editLayerName" @dblclick="editName">{{
          activeLayer.name
        }}</span>
        <div v-else class="mt-1">
          <VTextField
            id="editLayerName"
            v-model="layersBase[activeLayerIndex].name"
            @blur="editLayerName = false"
            @keydown.enter="editLayerName = false"
            filled
          />
        </div>
        <v-icon v-if="!editLayerName" @click="editName" class="ml-2" small
          >mdi-pencil</v-icon
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
            :value="activeLayer.mark && activeLayer.mark.type"
            @input="
              $emit('updateEncoding', {
                field: 'mark',
                value: { type: $event },
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
      </div>
    </div>
  </section>
</template>

<script>
import SetEncoding from "./SetEncoding"

import { getEl } from "@/utility/functions"
import presets from "@/config/presets"

export default {
  components: {
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
    layerOptions() {
      return this.augmentedLayers.map(({ name }, index) => ({
        text: name + (index === this.activeLayerIndex ? " (active)" : ""),
        value: index,
      }))
    },
  },
  methods: {
    selectPreset(preset) {
      this.selectedPreset = preset
      this.$emit("selectPreset", presets[preset])
    },
    selectLayer(newLayer) {
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
