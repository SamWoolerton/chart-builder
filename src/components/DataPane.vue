<template>
  <section>
    <div>
      <div class="font-bold mb-2">Available data columns</div>
      <div>
        <div v-for="col in cols" :key="col.field">
          <span class="mr-2 text-gray-700 text-sm">{{ col.prefix }}</span>
          <span>{{ col.field }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
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
