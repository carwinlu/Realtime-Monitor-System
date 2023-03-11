<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>
<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}// 省份矢量数据缓存
    }
  },
  created () {
    this.$socket.registerCallBack('mapData', this.getData)
  },
  // 用的一些方法要加在里面
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      // 中国地图矢量数据,因为地图数据就在static/map之下，而用this.$http访问的是8888端口（koa2后台），不是浏览器的8999端口，所以要用$.get
      const ret = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▍商家分布与销量排行',
          left: '20px',
          top: '20px'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          buttom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      // 省份配置
      this.chartInstance.on('click', async (arg) => {
        // arg.name得到省份中文名
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 判断是否有数据缓存再决定是否获取
        if (typeof provinceInfo.key === 'undefined') {
          this.mapData = {}
          return ''
        } else if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get('http://localhost:8999' + provinceInfo.path)
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        this.mapData[provinceInfo.key] = ret.data
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData (ret) {
      // 获取服务器数据后手动调用update
      // 获取散点数据
      // const { data: ret } = await this.$http.get('map')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 收集处理图表要的数据
      // 图例数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        // 一个类别的散点
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      // 收集处理随屏幕变化的图表数据
      const titleFondSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFondSize
          }
        },
        legend: {
          itemWidth: titleFondSize / 2,
          itemHeight: titleFondSize / 2,
          itemGap: titleFondSize / 2,
          textStyle: {
            fontSize: titleFondSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 图表自适应
      this.chartInstance.resize()
    },
    // 双击回中国地图
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
