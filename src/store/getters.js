import {getMenuByRouter, initMenuList} from '@/libs/utils'
import routers from '@/router/routers'

export default {
  menuList: state => getMenuByRouter(state.routeList, state.access),
  allRouteList: state => {
    let list = []
    const allList = [...routers, ...state.routeList]
    initMenuList(list, allList)
    return list
  },
  errorCount: state => state.errorList.length
}