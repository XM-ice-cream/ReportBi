import * as filters from "./filters";
const importFilters = Vue => {
  Object.keys(filters).forEach(o => {
    Vue.filter(o, filters[o])
  })
}

export default importFilters