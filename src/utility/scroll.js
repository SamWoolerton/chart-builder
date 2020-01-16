// @ts-nocheck

import { getEl } from "../utility/functions"

export const smoothScrollTo = el => {
  const { offsetTop } = getEl(el)

  const options = {
    behavior: "smooth",
    left: 0,
    top: offsetTop,
  }

  if ("scrollBehavior" in document.documentElement.style) {
    window.scrollTo(options)
  } else {
    // old behaviour, not smooth scroll
    window.scrollTo(options.left, options.top)
  }

  return true
}
