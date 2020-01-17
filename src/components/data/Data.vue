<template>
  <div class="bg-white min-h-screen">
    <h2>Import data</h2>
    <h3 class="py-2 text-center">Select an import method</h3>
    <div class="px-4 py-8 bg-gray-100">
      <VContainer>
        <div class="flex flex-wrap justify-around">
          <div class="bg-white px-10 py-6 m-1 shadow-xl">
            <div class="mb-2 font-bold">Upload CSV or JSON file</div>
            <VFileInput
              @change="updateData('file', $event)"
              accept=".csv,.json,application/json,text/json,application/csv,text/csv"
              class="w-full md:w-64"
              label="File"
              filled
            />
          </div>
          <div class="bg-white px-10 py-6 m-1 shadow-xl">
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
          <div class="bg-white px-10 py-6 m-1 shadow-xl">
            <div class="mb-2 font-bold">Use sample dataset</div>
            <Dropdown
              :options="sampleNames"
              :value="sample"
              @input="selectSample"
            />
          </div>
        </div>
      </VContainer>
    </div>
    <div v-if="dataMethod !== null || demo">
      <div v-if="loading">Loading...</div>
      <div v-else-if="previewData.length === 0">Source had no data</div>
      <div v-else>
        <VContainer>
          <h3 class="my-4">Preview the data</h3>
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
          Go to builder
        </button>
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
