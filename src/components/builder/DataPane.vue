<template>
  <section>
    <div>
      <div class="font-bold mb-2">Available data columns</div>
      <div>
        <drag
          v-for="col in cols"
          :key="col.field"
          :transfer-data="{ field: col.field }"
          class="bg-gray-200 px-3 py-1 mt-1 text-sm rounded-full"
        >
          <span class="mr-2 text-gray-700 text-xs">{{ col.prefix }}</span>
          <span>{{ col.field }}</span>
        </drag>
      </div>
    </div>
  </section>
</template>

<script>
import { Drag } from "vue-drag-drop"

export default {
  components: { Drag },
  props: {
    columns: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cols() {
      const prefixes = {
        quantitative: "123",
        nominal: "ABC",
        ordinal: "ABC",
      }

      return Object.entries(this.columns).map(([field, { type }]) => ({
        field,
        type,
        prefix: prefixes[type],
      }))
    },
  },
}
</script>
