<template>
	<div class="page-style user-info">
		<Split v-model="split">
			<!--左侧导航栏-->
			<div slot="left" class="split-pane">
				<Card :padding="0" :bordered="false" dis-hover>
					<CellGroup @on-click="cellClick">
						<Cell :name="1" :selected="cellSelected === 1">{{ userInfo }}</Cell>
						<Cell :name="2" :selected="cellSelected === 2">{{ updatePwd }}</Cell>
					</CellGroup>
				</Card>
			</div>
			<!--右侧展示栏-->
			<div slot="right" class="split-pane">
				<Card v-show="isUserInfo === 1" :bordered="false" dis-hover>
					<p slot="title">{{ userInfo }}</p>
					<Form :label-width="80" :label-colon="false">
						<FormItem :label="$t('headIcon')" class="user-head">
							<avatar-custom :imgUrl="req.headIcon" :avatarSize="'146'"></avatar-custom>
							<upload-custom
								:uploadUrl="uploadHeadIcon"
								:uploadHeight="33"
								:multiple="uploadMultiple"
								@upload-success="uploadSuccess"
								class="upload-head"
								title="更换头像"
							></upload-custom>
						</FormItem>
						<FormItem :label="$t('account')">{{ req.account }}</FormItem>
						<FormItem :label="$t('userName')">{{ req.userName }}</FormItem>
						<FormItem :label="$t('roleName')" v-if="false">{{ req.roleName }}</FormItem>
						<FormItem :label="$t('organizeName')" v-if="false">{{ req.organizeName }}</FormItem>
						<FormItem :label="$t('phone')">{{ req.phone }}</FormItem>
						<FormItem :label="$t('email')">{{ req.email }}</FormItem>
					</Form>
				</Card>
				<Card :bordered="false" v-show="isUserInfo === 2" dis-hover>
					<p slot="title">{{ updatePwd }}</p>
					<Form ref="req" :model="req" :rules="ruleValidate" label-position="top" :label-colon="false" class="pwd-form">
						<FormItem style="color: rgba(0, 0, 0, 0.45)">{{ $t("userInfoTips") }}</FormItem>
						<FormItem :label="$t('oldPwd')" prop="oldPwd"><Input v-model="req.oldPwd" clearable /></FormItem>
						<FormItem :label="$t('newPwd')" prop="newPwd"><Input v-model="req.newPwd" clearable /></FormItem>
						<FormItem :label="$t('surePwd')" prop="surePwd"><Input v-model="req.surePwd" clearable /></FormItem>
						<Button type="primary" size="default" @click="updateClick" style="margin-top: 10px">{{ updatePwd }}</Button>
					</Form>
				</Card>
			</div>
		</Split>
	</div>
</template>

<script>
import { updatepasswordReq, modifyReq, uploadHeadIcon } from "@/api/organize-manager/user-manager";
import { mapActions, mapMutations } from "vuex";
import { encryptDes, sha1_to_base64 } from "@/libs/des";
import { localSave, localReadObject, sessionRead } from "@/libs/utils";
import { errorType } from "@/libs/tools";
import UploadCustom from "@/components/upload-custom";
import AvatarCustom from "@/components/avatar-custom";

export default {
	name: "user-info",
	components: { UploadCustom, AvatarCustom },
	data() {
		return {
			split: 0.15,
			isReadonly: true,
			isUserInfo: 1,
			cellSelected: 1,
			userInfo: this.$t("user-info"),
			updatePwd: this.$t("updatePwd"),
			uploadHeadIcon: uploadHeadIcon(), // 图片上传headers
			uploadHeaders: {}, // 图片上传headers
			uploadMultiple: false, // 是否上传多张图片
			uploadData: [], // 要展示的图片
			req: {
				id: this.$store.state.id,
				headIcon: this.$store.state.avatarImgPath,
				account: this.$store.state.account,
				userName: this.$store.state.userName,
				roleName: "",
				organizeName: "",
				phone: this.$store.state.phone,
				email: this.$store.state.email,
				oldPwd: "",
				newPwd: "",
				surePwd: "",
			},
			ruleValidate: {
				oldPwd: [{ required: true, message: this.$t("pleaseEnter") + this.$t("oldPwd"), trigger: "blur" }],
				newPwd: [{ required: true, message: this.$t("pleaseEnter") + this.$t("newPwd"), trigger: "blur" }],
				surePwd: [{ required: true, message: this.$t("pleaseEnter") + this.$t("surePwd"), trigger: "blur" }],
			},
		};
	},
	methods: {
		...mapActions(["handleLogOut"]),
		...mapMutations(["updateAvatarImgPath", "setUserInfo"]),
		// 点击索引条选择触发
		cellClick(name) {
			this.cellSelected = this.isUserInfo = name;
		},
		// 点击修改密码按钮触发
		updateClick() {
			this.$refs.req.validate((validate) => {
				if (validate) {
					if (this.req.newPwd !== this.req.surePwd) {
						this.$Msg.warning(this.$t("surePwdError"));
					} else {
						const obj = {
							id: this.req.id,
							oldPassword: sha1_to_base64(encryptDes(this.req.oldPwd.trim(), "baize#66", "lxeP@ssx")),
							newPassword: sha1_to_base64(encryptDes(this.req.newPwd.trim(), "baize#66", "lxeP@ssx")),
						};
						updatepasswordReq(obj).then((res) => {
							if (res.code === 200) {
								this.resetCalcel();
								this.$Msg.success(this.$t("success"));
								this.handleLogOut();
								this.$router.push({ name: "login" });
							} else this.$Msg.error(errorType(this, Number(res.result)));
						});
					}
				}
			});
		},
		// 图片上传成功触发
		uploadSuccess(data) {
			this.req.headIcon = data.response.message;
			this.updateHeadIcon(this.req.headIcon);
			this.updateAvatarImgPath(this.req.headIcon);
			const localObj = localReadObject(`${sessionRead("userName")}Obj`);
			localObj.userInfo.headIcon = this.req.headIcon;
			localSave(`${localObj.userName}Obj`, localObj);
		},
		// 修改用户头像
		updateHeadIcon(name) {
			let obj = {
				id: this.req.id,
				name: null,
				headIcon: name,
				phone: null,
				email: null,
				companyId: null,
				departmentId: null,
				systemFlags: null,
				roles: null,
				enabled: 1,
				remark: null,
			};
			modifyReq(obj).then((res) => {
				if (res.code === 200) {
					this.$Msg.success(this.$t("update") + this.$t("success"));
				} else this.$Msg.error(`${res.code} ${res.result}`);
			});
		},
		// 清空缓存信息
		resetCalcel() {
			this.req.oldPwd = "";
			this.req.newPwd = "";
			this.req.surePwd = "";
		},
	},
};
</script>

<style>
.user-info .ivu-cell-title {
	font-size: 14px;
}
.user-info .ivu-form .ivu-FormItem-label {
	font-size: 14px;
}
.user-info .ivu-FormItem-content {
	font-size: 14px;
}
.user-info .ivu-card-head {
	border: none;
	padding: 10px 40px;
}
</style>
<style scoped lang="less">
.user-info {
	.user-head {
		position: absolute;
		left: 40%;
		transform: translateX(-50%);
		.upload-head {
			position: absolute;
			bottom: -42px;
			left: 43%;
			transform: translateX(-50%);
			cursor: pointer;
		}
	}
	.ivu-cell {
		margin-bottom: 10px;
	}
	.ivu-cell-selected {
		border-right: 3px solid;
		font-weight: bold;
	}
	.split-pane {
		padding: 20px 0;
	}
	.ivu-card-head p,
	.ivu-card-head-inner {
		font-size: 20px;
	}
}
.pwd-form {
	width: 30%;
	padding-left: 40px;
}
</style>
