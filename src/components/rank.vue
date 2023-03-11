<template>
  <div class="com-container">
    <!-- bug!!! echarts里面满屏显示最好设置100vw&100vh，因为echarts需要具体宽高！！！ -->
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
data () {
  return {
    chartInstance: null,
    allData: null,
    startValue: 0, // 区域缩放起点
    endValue: 9,
    timerId: null
  }
},
created () {
    this.$socket.registerCallBack('rankData', this.getData)
  },
mounted () {
  this.initChart()
  // this.getData()
  this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
  window.addEventListener('resize', this.screenAdapter)
  this.screenAdapter()
},
destroyed () {
  window.removeEventListener('resize', this.screenAdapter)
  clearInterval(this.timerId)
  this.$socket.unregisterCallBack('rankData')
},
methods: {
  initChart () {
    this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
    const initOption = {
      title: {
        text: '▍地区销售排行',
        left: '20px',
        top: '20px'
      },
      grid: {
        top: '40%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      tooltip: {
        show: true
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar'
        }
      ]
    }
    this.chartInstance.setOption(initOption)
    this.chartInstance.on('mouseover', () => {
      clearInterval(this.timerId)
    })
    this.chartInstance.on('mouseout', () => {
      this.startInterval()
    })
  },
  getData (ret) {
    // const { data: ret } = await this.$http.get('rank')
    this.allData = ret
    this.allData.sort((a, b) => {
      return b.value - a.value
    })
    this.updateChart()
    this.startInterval()
  },
  updateChart () {
    // 颜色数据
    const colorArr = [
      ['#0BA82C', '#4FF778'],
      ['#2E72BF', '#23E5E5'],
      ['#5052EE', '#AB6EE5']
    ]
    // 数据分离
    const provinceArr = this.allData.map(item => {
      return item.name
    })
    const valueArr = this.allData.map(item => {
      return item.value
    })
    const dataOption = {
      xAxis: {
        data: provinceArr
      },
      // 平移效果
      dataZoom: {
        show: false,
        startValue: this.startValue,
        endValue: this.endValue
      },
      series: [
        {
          data: valueArr,
          // 设置bar颜色
          itemStyle: {
            color: arg => {
              let targetColorArr = null
              if (arg.value > 300) {
                targetColorArr = colorArr[0]
              } else if (arg.value > 200) {
                targetColorArr = colorArr[1]
              } else {
                targetColorArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[1]
                  }, {
                    offset: 1,
                    color: targetColorArr[0]
                  }
                ])
            }
          }
        }
      ]
    }
    this.chartInstance.setOption(dataOption)
  },
  screenAdapter () {
    const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: titleFontSize
        }
      },
      series: [
        {
          barWidth: titleFontSize,
          itemStyle: {
            barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
          }
        }
      ]
    }
    this.chartInstance.setOption(adapterOption)
    this.chartInstance.resize()
  },
  // 定时器方法
  startInterval () {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
    this.timerId = setInterval(() => {
      this.startValue++
      this.endValue++
      if (this.endValue > this.allData.length - 1) {
        this.startValue = 0
        this.endValue = 9
      }
      this.updateChart()
    }, 2000)
  }
}
}
</script>
<style lang="less">
</style>
