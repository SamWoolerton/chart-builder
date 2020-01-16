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
        <h3>Preview the data</h3>
        <div>
          <Table :data="previewData" />
        </div>
        <button @click="$emit('done')">Go to builder</button>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "../ui/Table"

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
