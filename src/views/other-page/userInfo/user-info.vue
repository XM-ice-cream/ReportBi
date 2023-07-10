<template>
	<div class="page-style user-info">
		<!--右侧展示栏-->
		<Card :bordered="false" dis-hover class="info-card">
			<template #title>
				{{ userInfo }}
			</template>
			<div style="width: fit-content; margin: 0px auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
				<div class="info-head">
					<avatar-custom :imgUrl="req.headIcon" :avatarSize="'120'"></avatar-custom>
					<upload-custom
						class="upload-head"
						title="更换头像"
						uploadIcon="md-cloud-upload"
						:uploadUrl="uploadHeadIcon"
						:uploadHeight="33"
						:multiple="uploadMultiple"
						@upload-success="uploadSuccess"
					>
						<p slot="button" class="upload-head"><Button type="primary" size="default" style="margin-top: 10px">修改</Button></p>
					</upload-custom>
				</div>
				<Form :label-width="170" :label-colon="false" label-position="left" style="display: inline-block">
					<FormItem :label="$t('account')">{{ req.account }}</FormItem>
					<FormItem :label="$t('userName')">{{ req.userName }}</FormItem>
					<FormItem :label="$t('phone')">{{ req.phone }}</FormItem>
					<FormItem :label="$t('email')">{{ req.email }}</FormItem>
					<FormItem :label="$t('superAdmin')">
						<i-switch size="large" v-model="req.superAdmin">
							<span slot="open">是</span>
							<span slot="close">否</span>
						</i-switch>
					</FormItem>
					<FormItem :label="$t('lastPasswordChangeTime')">{{ formatDate(req.lastPasswordChangeTime) }}</FormItem>
				</Form>
			</div>
		</Card>
		<Card :bordered="false" dis-hover class="pwd-card">
			<template #title>
				{{ updatePwd }}
			</template>
			<div style="width: 70%; margin: 0 auto">
				<Form ref="req" :model="req" :rules="ruleValidate" label-width="200" :label-colon="false">
					<FormItem>
						<Alert type="warning">{{ $t("userInfoTips") }}</Alert></FormItem
					>
					<FormItem :label="$t('oldPwd')" prop="oldPwd"><Input v-model="req.oldPwd" clearable /></FormItem>
					<FormItem :label="$t('newPwd')" prop="newPwd"><Input v-model="req.newPwd" clearable /></FormItem>
					<FormItem :label="$t('surePwd')" prop="surePwd"><Input v-model="req.surePwd" clearable /></FormItem>
					<FormItem style="text-align: center">
						<Button type="primary" size="default" @click="updateClick" style="margin-top: 10px">{{ updatePwd }}</Button>
					</FormItem>
				</Form>
			</div>
		</Card>
	</div>
</template>

<script>
import { updatepasswordReq, modifyReq, uploadHeadIcon } from "@/api/organize-manager/user-manager";
import { mapActions, mapMutations } from "vuex";
import { encryptDes, sha1_to_base64 } from "@/libs/des";
import { localSave, localReadObject, sessionRead } from "@/libs/utils";
import { errorType, formatDate } from "@/libs/tools";
import UploadCustom from "@/components/upload-custom";
import AvatarCustom from "@/components/avatar-custom";

export default {
	name: "user-info",
	components: { UploadCustom, AvatarCustom },
	data() {
		return {
			isReadonly: true,
			isUserInfo: 1,
			formatDate: formatDate,
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
				phone: this.$store.state.phone,
				email: this.$store.state.email,
				lastPasswordChangeTime: this.$store.state.lastPasswordChangeTime,
				superAdmin: this.$store.state.superAdmin,
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
.user-info .ivu-form-item-content {
	font-size: 14px;
}
.user-info .ivu-form .ivu-form-item-label {
	font-size: 14px;
	font-weight: bold;
}
.user-info .ivu-card-head {
	padding: 14px 30px;
	font-size: 16px;
}
</style>
<style scoped lang="less">
.user-info {
	background: #f5f7f9;
	.info-card {
		height: 50%;
		.info-head {
			margin-right: 50px;
			display: inline-block;
			.upload-custom {
				display: block;
			}
		}
		.upload-head {
			color: #27ce88;
			text-align: center;
			margin-left: 0;
			i {
				font-size: 32px;
				vertical-align: middle;
			}
		}
	}
	.pwd-card {
		height: calc(50% - 20px);
		margin-top: 20px;
	}
	:deep(.ivu-card-head:before) {
		content: " ";
		display: block;
		left: 10px;
		top: 15px;
		bottom: 10px;
		width: 12px;
		height: 12px;
		background: #27ce88;
		position: absolute;
		border-radius: 50%;
	}
}
</style>
