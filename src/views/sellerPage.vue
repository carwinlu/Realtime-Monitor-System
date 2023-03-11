<!-- 针对/sellerPage路径,在这个组件中通过子组件注册的方式显示出seller.vue这个组件-->
<template lang="">
    <div class="com-page">
        <seller></seller>
    </div>
</template>
<script>
import Seller from '@/components/seller'
export default {
    data () {
        return {}
    },
    methods: {},
    components: {
        seller: Seller
    }
}
</script>
<style lang="less">
</style>
