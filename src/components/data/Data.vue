<template>
  <div class="bg-white min-h-full">
    <h2>Import data</h2>
    <div>
      <h3 class="py-2 text-center">Select an import method</h3>
      <div class="flex flex-wrap justify-around px-4 py-8 bg-gray-100">
        <div class="bg-white px-10 py-6 m-1 shadow-xl font-bold">
          <div class="mb-2">Upload CSV or JSON file</div>
          <input type="file" @change="selectFile" />
        </div>
        <div class="bg-white px-10 py-6 m-1 shadow-xl font-bold">
          <div class="mb-2">Enter URL to CSV or JSON file</div>
          <input v-model="url" class="py-2 px-3 bg-gray-200" />
          <button @click="updateData('url', url)">Get data</button>
        </div>
        <div class="bg-white px-10 py-6 m-1 shadow-xl font-bold">
          <div class="mb-2">Use sample dataset</div>
        </div>
      </div>
    </div>
    <div v-if="dataMethod !== null">
      <div v-if="loading">Loading...</div>
      <div v-else-if="previewData.length === 0">Source had no data</div>
      <div v-else>
        <h3 class="my-4">Preview the data</h3>
        <div class="overflow-x-auto">
          <Table :data="previewData">
            <template v-slot:afterHeader="{ data: { index } }">
              <span class="bg-gray-200 cursor-pointer" @click="$emit('removeColumn', index)">X</span>
            </template>
            <template v-slot:beforeFirstRow>
              <tr>
                <td v-for="({ type }, column) in columns" :key="column">
                  <Dropdown
                    :options="['nominal', 'quantitative']"
                    :value="type"
                    @input="$emit('updateColumnType', { column, type: $event.target.value })"
                  />
                </td>
              </tr>
            </template>
          </Table>
        </div>
        <button
          @click="$emit('done')"
          class="mt-12 mx-auto block px-8 py-5 bg-blue-600"
        >Go to builder</button>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "../ui/Table"
import Dropdown from "../ui/Dropdown"

export default {
  components: { Table, Dropdown },
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
  }),
  computed: {
    data() {
      return this.baseData[this.dataMethod]
    },
  },
  methods: {
    updateData(method, value) {
      this.dataMethod = method
      this.$emit("updateData", { method, value })
    },
    selectFile(e) {
      this.updateData("file", e.target.files[0])
    },
  },
}
</script>
