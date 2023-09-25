import Viewer from "v-viewer";
import ".store/viewerjs@1.11.5/node_modules/viewerjs/dist/viewer.css";
//import "viewerjs/dist/viewer.css";
import video from "./video";
// import signalr from './singnalr'
import ButtonCustom from "@/components/button-custom";
import DrawerButton from "@/components/drawer-button";
import PageCustom from "@/components/page-custom";
import ModalCustom from "@/components/modal-custom";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import vSelectPage from "v-selectpage";
import {
    requestCenter
} from "@/libs/request";
import LemonIMUI from "lemon-imui";
import "lemon-imui/dist/index.css";
// import VueSuperSlide from "vue-superslide";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
// highlight.js代码高亮插件
import VueHighlightJS from "vue-highlightjs";
import "highlight.js/styles/atom-one-dark.css";
// Vue-cli生成的工程文件的src/main.js

const importPlugins = (Vue) => {
    // 注册通讯文件
    // Vue.use(signalr)
    // 注册图片查看插件
    Vue.use(Viewer);
    Viewer.setDefaults({
        defaultOptions: {
            zIndex: 9999,
        },
    });
    // 注册video播放器插件
    Vue.use(video, {
        lang: "zh-CN"
    });
    // 注册树型下拉组件
    Vue.component("treeselect", Treeselect);
    // 注册业务按钮组件
    Vue.component("button-custom", ButtonCustom);
    // 注册业务分页组件
    Vue.component("page-custom", PageCustom);
    // 注册业务弹框组件
    Vue.component("modal-custom", ModalCustom);
    // 注册业务抽屉按钮组件
    Vue.component("drawer-button", DrawerButton);
    // 注册下拉分页组件
    Vue.use(vSelectPage, {
        title: "",
        pageSize: 10,
        dataLoad: async (vue, url, params) => {
            const obj = {
                pageSize: params.pageSize || 10, // 每页显示数
                pageIndex: params.pageNumber || 1, // 当前页
                orderField: params.orderField || "CREATEDATE", // 排序字段
                ascending: params.ascending || false, // 排序类型true升序 false降序
                data: {
                    enabled: 1,
                    ...params,
                },
            };
            let searchValue = params.searchValue;
            let searchKey = params.searchKey;

            if (searchKey && vue.multiple) {
                obj.data[searchKey + "s"] = searchValue.split(",");
            } else if (searchKey) {
                obj.data[searchKey] = searchValue;
            } else {
                //不需要处理的字段
                let isAccKey = ["orderField", "systemFlag", "whiteApi"].concat(params.isAccKey || []);
                for (let item in params) {
                    if (!isAccKey.includes(item) && typeof params[item] === "string") {
                        let itemValue = params[item].trim();
                        obj.data[item] = itemValue ? itemValue + "∞" : itemValue;
                    }
                }
            }
            //删除 isFuzzyKey 字段
            delete obj.data.isAccKey;
            let res = await requestCenter({
                baseUrl: url,
                method: "post",
                data: obj,
            });
            return res.code === 200 && res.result ? res.result : {};
        },
    });
    // 注册聊天插件
    Vue.use(LemonIMUI);
    // 注册特效真是插件
    //   Vue.use(VueSuperSlide);
    // 注册vxe-table插件
    Vue.use(VXETable);
    // 注册VueHighlightJS
    Vue.use(VueHighlightJS);
};

export default importPlugins;