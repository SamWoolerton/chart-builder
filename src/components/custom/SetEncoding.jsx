import { Drop } from "vue-drag-drop"
import Dropdown from "../ui/Dropdown"

export default {
  components: { Drop, Dropdown },
  props: {
    label: String,
    field: String,
    encoding: Object,
    canBeBlank: Boolean,
    columns: Object,
  },
  data: () => ({
    over: false,
  }),
  computed: {
    options() {
      const keys = Object.keys(this.columns)
      return this.canBeBlank ? ["", ...keys] : keys
    },
  },
  render() {
    const { label, field, encoding, options, columns } = this

    const validField = encoding[field] && encoding[field].field
    const selectedValue = validField || ""
    const aggregationOptions = ["", "count", "average", "sum"]

    const isQuant = validField && columns[validField].type === "quantitative"
    const showScale =
      validField &&
      columns[validField].scale &&
      [undefined, "average", "median"].includes(encoding[field].aggregate)

    const handler = name => e =>
      this.$emit(name, { field, value: e.target.value })

    return (
      <div class="mt-2">
        <div class="font-semibold text-lg">{label}</div>
        <Drop
          class={"drop-target " + (this.over ? "over" : "")}
          onDragover={() => (this.over = true)}
          onDragleave={() => (this.over = false)}
          onDrop={data => {
            this.over = false
            this.$emit("updateField", { field, value: data.field })
          }}
        >
          <Dropdown
            options={options}
            value={selectedValue}
            onInput={handler("updateField")}
          />
        </Drop>
        {isQuant && (
          <div>
            <div class="text-gray-700 font-semibold text-sm mt-2">
              Aggregation (optional)
            </div>
            <Dropdown
              options={aggregationOptions}
              value={encoding[field].aggregate}
              onInput={handler("updateAggregation")}
            />
          </div>
        )}
        {showScale && (
          <div class="text-gray-700 text-sm mt-1">
            Domain scale fixed at
            {" " + columns[validField].scale.domain.join(" to ")}
          </div>
        )}
      </div>
    )
  },
}
