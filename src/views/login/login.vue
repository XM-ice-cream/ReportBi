<template>
	<div class="login">
		<!-- <div ref="vantaRef" style="width: 100%; height: 100%"></div> -->
		<!-- <img src="../../assets/images/login-logo2.png" alt="" class="login-logo logoOpacity" /> -->
		<div class="login-con">
			<Card icon="log-in" title="Report BI System" :bordered="false" :dis-hover="true">
				<div class="form-con">
					<login-form @on-success-valid="handleSubmit" :loginLoading="loginLoading"></login-form>
				</div>
			</Card>
		</div>
		<div class="footer">
			<span>Hostar</span>
			<span>UI版本标识:{{ projectVersion }}</span>
			<span @click="handleSpeak('鸿仕达开发团队真牛逼，各个都是帅哥美女，颜值报表，技术精湛，学富五车，能说会道，前能提刀上马，后能运筹帷幄，恰似天仙坠人间，不惹人间片尘埃')"> @BI开发团队[点击查看详情] </span>
		</div>
		<ResetPassword ref="resetPassword" @update-pwd-success="autoLogin" />
	</div>
</template>

<script>
import LoginForm from "@/components/login-form";
import { mapActions } from "vuex";
import { userLocalInfo } from "@/libs/utils";
import { errorType, speak } from "@/libs/tools";
import ResetPassword from "./resetPassword";
import * as Three from "three";
import RINGS from "vanta/src/vanta.clouds";

export default {
	components: { LoginForm, ResetPassword },
	name: "login",
	data() {
		return {
			loginLoading: false,
			projectVersion: localStorage.getItem("projectVersion"),
		};
	},
	methods: {
		...mapActions(["handleLogin", "handleLogOut"]),
		// 修改密码成功后自动登陆
		autoLogin(payload) {
			this.loginLoading = true;
			setTimeout(() => this.handleSubmit(payload), 200);
		},
		handleSubmit({ userName, password }) {
			this.loginLoading = true;
			this.handleLogin({ userName, password })
				.then((res) => {
					let localObj = userLocalInfo();
					localObj.locked = 0;
					localObj.browserCheck = 0;
					userLocalInfo(localObj);
					this.loginLoading = false;
					if (res.result.needChangePassword) {
						this.$refs.resetPassword.modal = true; //改密码
						this.$refs.resetPassword.req.oldPwd = password; //旧密码
					} else {
						this.$router.push({ name: this.$config.homeName }, () => {});
					}
				})
				.catch((error) => {
					this.loginLoading = false;
					if (error.error === "invalid_grant") this.$Msg.error(errorType(this, { errorCode: error.error_description }));
					else if (error.error === "invalid_scope") this.$Msg.error(this.$t("invalidScope"));
					else if (error.error === '"invalid_client"') this.$Msg.error(this.$t("invalidClient"));
					else {
						if (error.status === 400) {
							this.$Msg.error(this.$t("loginTips4"));
						} else if (error.status === 0) {
							this.$Msg.error("服务器错误");
						} else {
							this.$Msg.error(errorType(this, error));
						}
						this.handleLogOut();
					}
				});
		},
		// 语音播报的函数
		handleSpeak(text) {
			if (!!window.ActiveXObject || "ActiveXObject" in window) {
				this.$Msg.error("IE浏览器不支持本功能");
			} else speak({ text });
		},
		// 语音停止
		handleStop() {
			speak({ closeSpeakTime: 1 });
		},
		openPage(item) {
			let routeData = this.$router.resolve({ name: item });
			window.open(routeData.href, "_blank");
		},
	},
	beforeDestroy() {
		if (this.vantaEffect) {
			this.vantaEffect.destroy();
		}
	},
	mounted() {
		// this.vantaEffect = RINGS({
		// 	el: this.$refs.vantaRef,
		// 	THREE: Three,
		// });
		// // 这里重新设置样式
		// this.vantaEffect.setOptions({
		// 	el: ".vanta-canvas",
		// 	mouseControls: true,
		// 	touchControls: true,
		// 	gyroControls: false,
		// 	minHeight: 200.0,
		// 	minWidth: 200.0,
		// 	backgroundColor: 0xffffff,
		// 	sunColor: 0xff9919,
		// 	skyColor: 0x68b8d7,
		// 	cloudColor: 0xcbd1e8,
		// 	cloudShadowColor: 0x183550,
		// 	sunGlareColor: 0xff6633,
		// 	sunlightColor: 0xff9933,
		// 	speed: 1,
		// });
	},
};
</script>

<style lang="less">
.login-con {
	width: 410px !important;

	.ivu-form-item {
		margin-bottom: 40px;
	}

	.ivu-btn {
		font-size: 22px !important;
		height: 46px !important;
		padding: 0px;
		border: none;
		background: linear-gradient(45deg, #38fbfe, #5b56e3);
	}

	.ivu-card {
		background: transparent;
	}

	.ivu-card-head {
		padding: 30px 16px 25px 16px !important;
		letter-spacing: 3px;
		text-align: center;
		border: none;

		> p {
			font-size: 20px;
			color: #fff;
			height: 30px;
			line-height: 30px;
			> span {
				color: #fff;
				font-size: 26px;
				font-weight: bold;
			}
		}
	}

	.ivu-card-body {
		padding: 15px 24px 0 24px;
	}

	.ivu-input {
		height: 45px;
		padding: 4px 7px;
		border: none;
		border-radius: 5px;
		color: #fff;
		background-color: #1f293cc4;
	}

	.ivu-input-group-prepend,
	.ivu-input-group-append {
		padding: 4px 15px;
		color: #fff;
		background-color: #1f293cc4;
		border: none;
		border-radius: 5px;
	}

	.ivu-select-small.ivu-select-single .ivu-select-selection {
		height: 38px;
		border-radius: 5px;
		line-height: 36px;
		color: #fff;
		border: none;
		background-color: #1f293cc4;
	}
	.ivu-select .ivu-select-dropdown {
		width: auto;
		background-color: #0e1d3c;
		border: 1px solid #13404b;
		border-top: none;
	}

	.ivu-input:-webkit-autofill,
	.ivu-input:-webkit-autofill:hover,
	.ivu-input:-webkit-autofill:focus,
	.ivu-input:-webkit-autofill:active {
		-webkit-transition-delay: 99999s;
		-webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
	}

	.ivu-form-item-error-tip {
		padding-top: 8px;
	}
}
</style>
<style scoped lang="less">
@import "./login.less";

.login-logo {
	position: absolute;
	left: 240px;
	width: 350px;
	top: 50%;
	transform: translateY(-50%);
}

.ql {
	position: absolute;
	right: 9px;
	top: 53px;
	transform: translateY(-50%);
}

.footer {
	width: 100%;
	font-weight: 400;
	line-height: 35px;
	padding: 0 20px 0 49px;
	position: absolute;
	bottom: 0;
	text-align: center;

	a,
	span {
		margin-right: 24px;
		font-size: 14px;
		color: #fff;

		&:hover {
			color: #7fc693;
		}
	}

	.microsoft_r {
		cursor: pointer;
		position: absolute;
		right: 10px;
		bottom: 0;
	}
}

.top_con {
	padding: 0 20px 0 49px;
	position: absolute;
	top: 10px;

	a,
	span {
		cursor: pointer;
		color: #fff;
		opacity: 1;
		margin-right: 24px;
		font-size: 18px;

		&:hover {
			opacity: 1;
		}
	}
}

.video {
	width: 100%;
	top: 0;
	position: relative;
}

@media screen and (max-width: 1366px) {
	.login-logo {
		width: 18%;
	}
}
</style>
