<template>
  <div class="com-page">
    <single-map></single-map>
  </div>
</template>
<script>
  import Map from '@/components/map'
export default {
  data () {
        return {}
    },
    // 组件注册
    methods: {},
    components: {
      // 哎呀呀这里不能直接用map命名！命名冲突
      'single-map': Map
    }
}
</script>
<style>
</style>
