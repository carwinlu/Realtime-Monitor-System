<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▍' + showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selecterTypes" :key="item.key" @click="handleSelect(item.key)" :style="marginStyle">{{item.text}}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false, // 显示可选项
      choiceType: 'map',
      titleFontSize: 0// 标题字体
    }
  },
  created () {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    // 发起数据请求
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('trendData')
  },
  // 标题选择
  computed: {
    selecterTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
    if (!this.allData) {
        return '没有标题'
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 标题样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize / 1.6 + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          buttom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: '20px',
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // ret 就是服务端发送给客户端的图表数据
    getData (ret) {
      // const { data: ret } = await this.$http.get('trend')
      this.allData = ret
      this.upDateChart()
    },
    upDateChart () {
      // 半透明颜色值
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      // 全透明颜色值
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      // 处理数据
      // xAxistimeArr:category
      const timeArr = this.allData.common.month
      // yAxis data
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              }, {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr,
          show: true
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize * 2,
          itemHeigtht: this.titleFontSize * 2,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 选择图表
    handleSelect (currentType) {
      this.choiceType = currentType
      this.upDateChart()
      this.showChoice = false
    }
  }
}
</script>
<style lang="less" scoped>
  .title{
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color:white;
    cursor: pointer;
    font-weight: bold;
  }

  .title-icon{
      margin: left 10px;
      /* 鼠标手势变化 */
      cursor: pointer;
    }
    .select-con{
      background: #222733;
    }
</style>
