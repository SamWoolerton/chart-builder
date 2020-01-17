<template>
  <div class="min-h-screen">
    <VContainer class="mt-6 mb-4">
      <h2 class="text-center">Chart builder</h2>
      <p class="text-lg text-center mt-3">
        Import your data or use samples | Easily build charts | Export for use
        in Power BI (or anywhere you can use Vega-Lite)
      </p>
    </VContainer>
    <div class="bg-gray-100">
      <VContainer class="bg-white py-6 px-6">
        <h3 class="mt-2 mb-4 text-center">Select an import method</h3>
        <div class="px-2 py-6 bg-gray-100">
          <div class="flex flex-wrap justify-around">
            <div class="bg-white px-10 py-6 m-2 shadow-xl">
              <div class="flex justify-center">
                <div class="rounded-full primary mt-2 mb-6 mx-auto p-4">
                  <v-icon color="white">mdi-upload</v-icon>
                </div>
              </div>
              <div class="mb-2 font-bold">Upload CSV or JSON file</div>
              <VFileInput
                @change="updateData('file', $event)"
                accept=".csv,.json,application/json,text/json,application/csv,text/csv"
                class="w-full md:w-64"
                label="File"
                filled
              />
            </div>
            <div class="bg-white px-10 py-6 m-2 shadow-xl">
              <div class="flex justify-center">
                <div class="rounded-full primary mt-2 mb-6 mx-auto p-4">
                  <v-icon color="white">mdi-web</v-icon>
                </div>
              </div>
              <div class="mb-2 font-bold">Enter URL to CSV or JSON file</div>
              <VTextField
                v-model="url"
                @enter="updateData('url', url)"
                label="URL"
                class="w-full sm:w-64"
                filled
              />
              <button
                @click="updateData('url', url)"
                class="primary mt-2 w-full py-3"
              >
                Get data
              </button>
            </div>
            <div class="bg-white px-10 py-6 m-2 shadow-xl">
              <div class="flex justify-center">
                <div class="rounded-full primary mt-2 mb-6 mx-auto p-4">
                  <v-icon color="white">mdi-magnify</v-icon>
                </div>
              </div>
              <div class="mb-2 font-bold">Use sample dataset</div>
              <Dropdown
                :options="sampleNames"
                :value="sample"
                @input="selectSample"
              />
            </div>
          </div>
        </div>
      </VContainer>

      <div v-if="dataMethod !== null || demo" class="pb-16 mt-6 bg-gray-100">
        <div v-if="loading">Loading...</div>
        <div v-else-if="previewData.length === 0">Source had no data</div>
        <div v-else>
          <VContainer class="bg-white py-6 px-4">
            <h3 class="mt-2 mb-4 text-center">Preview the data</h3>
            <div class="overflow-x-auto">
              <Table :data="previewData">
                <template v-slot:header="{ data: { col, index } }">
                  <div class="flex justify-between">
                    {{ col }}
                    <v-icon class="ml-2" @click="$emit('removeColumn', index)"
                      >mdi-delete-outline</v-icon
                    >
                  </div>
                </template>
                <template v-slot:beforeFirstRow>
                  <tr class="no-highlight-bg">
                    <td v-for="({ type }, column) in columns" :key="column">
                      <VSelect
                        :items="['nominal', 'quantitative', 'temporal']"
                        :value="type"
                        @input="
                          $emit('updateColumnType', {
                            column,
                            type: $event,
                          })
                        "
                        class="w-full"
                        filled
                      />
                    </td>
                  </tr>
                </template>
              </Table>
            </div>
          </VContainer>

          <button
            @click="$emit('done')"
            class="mt-12 mx-auto block px-8 py-5 bg-blue-600 text-white"
          >
            Start building
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/ui/Table"
import samples from "@/config/samples"

export default {
  components: { Table },
  props: {
    baseData: {
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
    loading: {
      type: Boolean,
      default: false,
    },
    previewData: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dataMethod: null,
    url: "",
    sample: null,
    samples,
  }),
  computed: {
    data() {
      return this.baseData[this.dataMethod]
    },
    sampleNames() {
      return this.samples.map(sample => sample.name)
    },
  },
  methods: {
    updateData(method, value) {
      this.dataMethod = method
      this.$emit("updateData", { method, value })
    },
    selectSample(sample) {
      this.sample = sample
      const { url } = this.samples.find(({ name }) => name === sample)
      this.updateData("url", url)
    },
  },
}
</script>
