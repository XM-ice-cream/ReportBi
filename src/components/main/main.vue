<template>
	<Layout class="main" @click.native="clickMain">
		<Sider hide-trigger collapsible :width="200" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{ overflow: 'hidden' }">
			<!--  关闭手风琴模式  -->
			<!--      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage"-->
			<!--                 :menu-list="menuList">-->
			<side-menu ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
				<!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
				<div class="logo-con">
					<img v-show="!collapsed" :src="maxLogo" key="max-logo" />
					<img v-show="collapsed" :src="minLogo" key="min-logo" />
				</div>
			</side-menu>
		</Sider>
		<Layout class="main-layout-con">
			<Header class="header-con">
				<header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
					<user :message-unread-count="unreadCount" :user-avatar="userAvatar" :user-name="userName" />
					<language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px" :lang="local" />
					<error-store
						v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
						:has-read="hasReadErrorPage"
						:count="errorCount"
						style="margin-right: 10px"
					></error-store>
					<message style="margin-right: 10px" :size="18"></message>
					<lock-screen style="margin-right: 10px" :size="18"></lock-screen>
					<fullscreen v-model="isFullscreen" :size="18" style="margin-right: 10px" />
					<div style="margin-right: 10px; cursor: pointer">
						<Icon custom="iconfont icon-update" :size="18" title="刷新数据" @click="refreshView" />
					</div>
				</header-bar>
			</Header>
			<div class="tag-nav-wrapper">
				<tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
			</div>
			<Content class="content-wrapper">
				<div class="content-wrapper-div">
					<keep-alive :include="cacheList">
						<router-view v-if="isRefreshView" ref="refreshView" />
					</keep-alive>
					<ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
				</div>
			</Content>
		</Layout>
	</Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import ABackTop from "./components/a-back-top";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import Message from "./components/message";
import ErrorStore from "./components/error-store";
import { mapMutations, mapGetters } from "vuex";
import { getNewTagList, routeEqual, initMenuList, userLocalInfo } from "@/libs/utils";
import { objEqual } from "@/libs/tools";
import routers from "@/router/routers";
import minLogo from "@/assets/images/logo-min.png";
import maxLogo from "@/assets/images/logo.png";
import lockScreen from "./components/lockscreen/lockscreen.vue";
import { mapActions } from "vuex";

export default {
	name: "Main",
	components: {
		SideMenu,
		HeaderBar,
		Language,
		Message,
		TagsNav,
		Fullscreen,
		lockScreen,
		ErrorStore,
		User,
		ABackTop,
	},
	data() {
		return {
			collapsed: false,
			minLogo,
			maxLogo,
			isFullscreen: false,
			isRefreshView: true,
		};
	},
	computed: {
		...mapGetters(["errorCount"]),
		tagNavList() {
			return this.$store.state.tagNavList;
		},
		userAvatar() {
			return this.$store.state.avatarImgPath;
		},
		userName() {
			return this.$store.state.userName;
		},
		cacheList() {
			let list = [
				"ParentView",
				...(this.tagNavList.length ? this.tagNavList.filter((item) => !(item.meta && item.meta.notCache)).map((item) => item.name) : []),
			];
			//解决优化缓存菜单只剩下首页时，下一个打开的菜单存在缓存问题
			if (list.length === 1) list = [];
			console.log(list);
			return list;
		},
		menuList() {
			return this.$store.getters.menuList;
		},
		local() {
			return this.$store.state.local;
		},
		hasReadErrorPage() {
			return this.$store.state.hasReadErrorPage;
		},
		unreadCount() {
			return this.$store.state.unreadCount;
		},
	},
	methods: {
		...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal", "setHomeRoute", "closeTag"]),
		...mapActions(["handleLogin"]),
		turnToPage(route) {
			let { name, params, query } = {};
			if (typeof route === "string") name = route;
			else {
				name = route.name;
				params = route.params;
				query = route.query;
			}
			if (name.indexOf("isTurnByHref_") > -1) {
				window.open(name.split("_")[1]);
				return;
			}
			if (this.$route.name === name && objEqual(this.$route.query, query)) {
				return;
			}
			this.$router.push({
				name,
				params,
				query,
			});
		},
		handleCollapsedChange(state) {
			this.collapsed = state;
		},
		handleCloseTag(res, type, route) {
			if (type !== "others") {
				if (type === "all") {
					this.turnToPage(this.$config.homeName);
				} else {
					if (routeEqual(this.$route, route)) {
						this.closeTag(route);
					}
				}
			}
			this.setTagNavList(res);
		},
		handleClick(item) {
			let list = [];
			initMenuList(list, this.menuList);
			let menu = list.find((x) => x.name === item.name);
			if (menu) {
				userLocalInfo({ mId: menu.id });
				this.$store.commit("updateMenuId", menu.id);
			}
			this.turnToPage(item);
		},
		refreshView() {
			this.isRefreshView = false;
			this.$nextTick(() => {
				this.isRefreshView = true;
				setTimeout(() => {
					//刷新数据的时候是否重复刷新pageLoad
					let refreshView = this.$refs.refreshView;
					if (refreshView.pageLoad) {
						if (!refreshView.noRepeatRefresh) {
							refreshView.pageLoad();
						}
					} else if (refreshView.$refs.child?.pageLoad && !refreshView.$refs.child.noRepeatRefresh) {
						refreshView.$refs.child.pageLoad();
					}
				}, 200);
			});
		},
		clickMain() {
			let refreshView = this.$refs.refreshView;
			if (refreshView?.searchPoptipModal) {
				refreshView.searchPoptipModal = false;
			} else if (refreshView?.$refs.child?.searchPoptipModal) {
				refreshView.$refs.child.searchPoptipModal = false;
			}
		},
	},
	watch: {
		$route(newRoute) {
			let list = [];
			initMenuList(list, this.menuList);
			let menu = list.find((x) => x.name === newRoute.name);
			if (menu) {
				userLocalInfo({ mId: menu.id });
				this.$store.commit("updateMenuId", menu.id);
			}
			const { name, query, params, meta } = newRoute;
			this.addTag({
				route: { name, query, params, meta },
				type: "push",
			});
			this.setBreadCrumb(newRoute);
			this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
			this.$refs.sideMenu.updateOpenName(name);
		},
	},
	mounted() {
		/**
		 * @description 初始化设置面包屑导航和标签导航
		 */
		this.setTagNavList();
		this.setHomeRoute(routers);
		const { name, params, query, meta } = this.$route;
		this.addTag({
			route: { name, params, query, meta },
		});
		this.setBreadCrumb(this.$route);
		// 设置初始语言
		this.setLocal(this.$i18n.locale);
		// 如果当前打开页面不在标签栏中，跳到homeName页
		if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
			this.$router.push({
				name: this.$config.homeName,
			});
		}
		// window.onbeforeunload = function (e) {
		//   deleteToken()
		// }

		// 获取未读消息条数
		// this.getUnreadMessageCount()
	},
};
</script>

<style lang="less">
@import "./main.less";
</style>
