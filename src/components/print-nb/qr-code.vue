<template>
	<vueQrcode :value="value"></vueQrcode>
</template>

<script>
import vueQrcode from "@xkeshi/vue-qrcode";
export default {
	name: "Qrcode",
	components: {
		vueQrcode,
	},
	props: {
		value: {},
	},
};
</script>

<style lang="less" scoped></style>
