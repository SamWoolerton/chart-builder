// if there end up being many global components then import them automatically
// https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components

import Dropdown from "@/components/ui/Dropdown"

export default [{ Dropdown }].map(obj => {
  const [name, component] = Object.entries(obj)[0]
  return { name, component }
})
