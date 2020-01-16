<template>
  <div class="bg-white min-h-full">
    <h2>Import data</h2>
    <div>
      <h3 class="py-2 text-center">First, how are you going to import the data?</h3>
      <div class="flex flex-wrap justify-around px-4 py-8 bg-gray-100">
        <div class="bg-white px-10 py-6 m-1 shadow-xl cursor-pointer">
          <div>Upload CSV</div>
        </div>
        <div class="bg-white px-10 py-6 m-1 shadow-xl cursor-pointer">
          <div>Enter URL to CSV file</div>
        </div>
        <div class="bg-white px-10 py-6 m-1 shadow-xl cursor-pointer">
          <div>Use sample dataset</div>
        </div>
      </div>
    </div>
    <button @click="$emit('done')">Go to builder</button>
  </div>
</template>

<script>
export default {
  props: {
    baseData: {
      type: Object,
      required: true,
    },
    dataMethod: {
      type: String,
      default: null,
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
}
</script>
