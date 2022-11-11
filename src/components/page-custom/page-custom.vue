<template>
	<div class="pageStyle">
		<div class="pageStyle_left">
			<Page class-name="custom-page" :total="total" :page-size="pageSize" :current="pageIndex" :page-size-opts="pageSizeList" :prev-text="prevText" :next-text="nextText" size="small" show-total show-sizer show-elevator simple @on-change="pageChange" @on-page-size-change="pageSizeChange">
				<slot>{{ pageShowTips }}</slot>
			</Page>
			<Select v-model="pageSize" size="small" class="custom-page" style="width: 90px" @on-change="pageSizeChange">
				<Option v-for="item in pageSizeList" :value="item" :key="item">
					{{ item + " " + $t("/page") }}
				</Option>
			</Select>
		</div>
		<div class="custom-page"><slot name="right"></slot>{{ pageShowTips }}</div>
	</div>
</template>
<script>
export default {
	name: "PageCustom",
	props: {
		elapsedMilliseconds: Number, //耗时
		total: Number, // 总条数
		totalPage: Number, // 总页数
		pageIndex: Number, // 当前页
		pageSize: Number, // 每页大小
		sizeList: {
			type: Array,
			default: () => {
				return [];
			},
		}, // 每页大小
	},
	data() {
		return {
			pageSizeList: this.sizeList.length ? this.sizeList : this.$config.pageSizeList,
			prevText: this.$t("prevText"),
			nextText: this.$t("nextText"),
		};
	},
	computed: {
		// 提示信息
		pageShowTips() {
			return this.total === 0 ? "" : `${this.$t("pageTips1")}${this.total}, ${this.$t("pageTips2")}${this.totalPage}${this.elapsedMilliseconds ? `, 耗时：${this.elapsedMilliseconds}ms` : ""}`;
		},
	},
	methods: {
		/**
		 * 选择跳转到第几页
		 * @param index Number 要跳转的页数
		 */
		pageChange(index) {
			this.$emit("on-change", index);
		},
		/**
		 * 选择一页有条数据
		 * @param index Number 返回的条数
		 */
		pageSizeChange(index) {
			this.$emit("on-page-size-change", index);
		},
	},
};
</script>
<style lang="less" scoped>
.pageStyle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.pageStyle_left {
		display: flex;
		align-items: center;
	}
}
</style>
