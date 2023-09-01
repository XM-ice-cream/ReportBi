<template>
	<div>
		<Form ref="loginForm" :model="form" :rules="rules">
			<FormItem prop="userName">
				<i-input v-model="form.userName" size="default" :placeholder="`${$t('pleaseEnter')}${$t('userName')}`" @keyup.native.enter="$triggerTab">
					<span slot="prepend">
						<Icon :size="16" type="ios-person"></Icon>
					</span>
				</i-input>
			</FormItem>
			<FormItem prop="password">
				<i-input
					type="password"
					v-model="form.password"
					size="default"
					:placeholder="`${$t('pleaseEnter')}${$t('password')}`"
					@keyup.native.enter="handleSubmit"
				>
					<span slot="prepend">
						<Icon :size="14" type="md-lock"></Icon>
					</span>
				</i-input>
			</FormItem>
			<!-- <FormItem prop="db">
				<Select class="query_more_select" v-model="form.db" @on-change="dbChange">
					<div slot="prefix" style="width: 20px; text-align: center">
						<i class="iconfont icon-net" />
					</div>
					<Option v-for="(item, index) in dbList" :value="item.id" :key="index">{{ item.name }} </Option>
				</Select>
			</FormItem> -->
			<FormItem>
				<Button @click="handleSubmit" size="default" type="primary" long class="login-button">
					<a href="#" class="price-btn">
						<span><Icon type="ios-loading" v-if="loginLoading" />{{ $t("login") }}</span>
					</a>
				</Button>
				<Row class="button-style">
					<i-col span="12">
						<span type="text" @click="addClick" style="float: left">注册账号：直接使用OA密码登录即可</span>
					</i-col>
				</Row>
			</FormItem>
		</Form>
		<forget-form ref="forgetForm" />
	</div>
</template>
<script>
import { sessionRead } from "@/libs/utils";
import forgetForm from "./forget-form.vue";
// 先引入axios
import axios from "axios";
export default {
	name: "LoginForm",
	components: {
		forgetForm,
	},
	props: {
		userNameRules: {
			type: Array,
			default: () => {
				return [{ required: true, message: "账号不能为空", trigger: "blur" }];
			},
		},
		passwordRules: {
			type: Array,
			default: () => {
				return [{ required: true, message: "密码不能为空", trigger: "blur" }];
			},
		},
		loginLoading: Boolean,
	},
	data() {
		return {
			// bg:bg,
			form: {
				userName: sessionRead("userName") || this.$store.state.account,
				password: "",
				db: "",
			},
			dbList: [],
		};
	},
	watch: {
		// "form.db"(newValue) {
		//   let dbSelectItem = this.dbList.find((o) => o.value === newValue) || {};
		//   let loginDom = document.getElementsByClassName("login");
		//   if (dbSelectItem.logo) {
		//     loginDom[0].style.backgroundImage = `url(${dbSelectItem.logo})`;
		//   } else {
		//     loginDom[0].style.backgroundImage = `url(${bg})`;
		//   }
		// },
	},
	created() {
		// 请求存储基础接口地址的json文件,获取保存的接口基础地址
		axios.get("./url.json?" + new Date().getTime()).then((res) => {
			this.dbList = res.data;
			let configip = window.localStorage.getItem("configip");
			let dbSelectItem = this.dbList.find((o) => o.value === configip) || {};
			if (dbSelectItem.value) {
				this.form.db = dbSelectItem.id;
				//报表ip
				window.localStorage.setItem("reportip", dbSelectItem.reportip || dbSelectItem.value); //报表接口ip
				window.localStorage.setItem("reportIp", dbSelectItem.reportIp); //报表项目ip
				window.localStorage.setItem("reportDesignIp", dbSelectItem.reportDesignIp); //报表设计项目ip
				window.localStorage.setItem("eapIp", dbSelectItem.eapIp); //EAP ip
			} else {
				//如果本地缓存的 configip 不在配置文件里 默认取配置文件第一条
				this.form.db = this.dbList[0].id;
				window.localStorage.setItem("configip", this.dbList[0].value);
				window.localStorage.setItem("reportip", this.dbList[0].reportip); //报表接口ip
				window.localStorage.setItem("reportIp", this.dbList[0].reportIp); //报表项目ip
				window.localStorage.setItem("reportDesignIp", this.dbList[0].reportDesignIp); //报表设计项目ip
				window.localStorage.setItem("eapIp", this.dbList[0].eapIp); //报表设计项目ip
			}
		});
	},
	computed: {
		rules() {
			return {
				userName: this.userNameRules,
				password: this.passwordRules,
			};
		},
	},
	methods: {
		dbChange(e) {
			let dbSelectItem = this.dbList.find((o) => o.id === e) || {};
			window.localStorage.setItem("configip", dbSelectItem.value);
			window.localStorage.setItem("reportip", dbSelectItem.reportip || dbSelectItem.value); //报表接口ip
			window.localStorage.setItem("reportIp", dbSelectItem.reportIp || dbSelectItem.value); //报表项目ip
			window.localStorage.setItem("reportDesignIp", dbSelectItem.reportDesignIp || dbSelectItem.value); //报表设计项目ip
			window.localStorage.setItem("eapIp", dbSelectItem.eapIp || dbSelectItem.value); //EAP 项目ip
		},
		forgetClick() {
			this.$refs.forgetForm.modalFlag = true;
		},
		addClick() {
			const title = "注册账号";
			const content = "<p>请联系管理员</p>";
			this.$Modal.info({
				title: title,
				content: content,
			});
		},
		handleSubmit() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.$emit("on-success-valid", {
						userName: this.form.userName,
						password: this.form.password,
					});
				}
			});
		},
	},
};
</script>
<style lang="less">
.login-button {
	& > span {
		display: block;
		width: 100%;
		height: 100%;
		margin: 0px;
		line-height: 46px;
	}
	.price-btn {
		color: #ffffff;
		position: relative;
		display: inline-block;
		overflow: hidden;
		/* padding: 15px 50px; */
		/* border-radius: 50px; */
		text-align: center;
		text-transform: capitalize;
		display: block;
		width: 100%;
		height: 100%;
		& > span {
			color: #ffffff;
			position: relative;
			z-index: 2;
			& > i {
				margin-right: 10px;
				animation: changeright 1s linear infinite;
			}
		}

		&:hover {
			color: #ffffff;
		}

		&:hover::before {
			animation: criss-cross-left 0.8s both;
			animation-direction: alternate;
		}
		&:hover::after {
			animation: criss-cross-right 0.8s both;
			animation-direction: alternate;
		}
		&::before,
		&::after {
			position: absolute;
			top: 50%;
			content: "";
			width: 20px;
			height: 20px;
			background-color: #27ce88;
			border-radius: 50%;
			color: #ffffff;
		}
		&::before {
			left: -20px;
			transform: translate(-50%, -50%);
		}
		&::after {
			right: -20px;
			transform: translate(50%, -50%);
		}
	}
	&:before {
	}
}
.login-button:hover {
	background-color: #27ce99;
	border: none;
}

.button-style {
	padding-top: 20px;
	color: #a5c3ff;
	cursor: pointer;
}
.button-style span:hover {
	color: #5eaaff;
}

@keyframes criss-cross-left {
	0% {
		left: -20px;
	}
	50% {
		left: 50%;
		width: 20px;
		height: 20px;
	}
	100% {
		left: 50%;
		width: 375px;
		height: 375px;
	}
}

@keyframes criss-cross-right {
	0% {
		right: -20px;
	}
	50% {
		right: 50%;
		width: 20px;
		height: 20px;
	}
	100% {
		right: 50%;
		width: 375px;
		height: 375px;
	}
}
@keyframes changeright {
	0% {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(180deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
