<template>
    <div class="com-container">
      <div class="com-chart" ref="hot_ref"></div>
      <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
      <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
      <span class="cat-name" :style="comStyle">{{ catName }}</span>
    </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0, // 当前一级分类
      titleFontSize: 0
    }
  },
  created () {
    this.$socket.registerCallBack('hotproductData', this.getData)
  },
  computed: {
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  mounted () {
    this.initChart()
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotproductData',
      chartName: 'hotproduct',
      value: ''
    })
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unregisterCallBack('hotproductData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '▍热销商品占比',
          left: '20px',
          top: '20px'
        },
        legend: {
          top: '20%',
          icon: 'circle'
        },
        tooltip: {
          show: true
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData (ret) {
      // const { data: ret } = await this.$http.get('hotproduct')
      this.allData = ret
      // console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      // this.allData[0].name:女装
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        tooltip: {
          formatter: (arg) => {
            // console.log(arg)
            // 获取三级分类数据
            const thirdCategory = arg.data.children
            // 为什么用forEach
            let retStr = ``
            thirdCategory.forEach(item => {
              retStr += `
              ${item.name} : ${parseInt(item.value / arg.value * 100) + '%'}
              <br>`
            })
            return retStr
          }
        },
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 切页方法
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>
<style lang="less" scoped>
  .arr-left {
    color: white;
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .arr-right {
    color: white;
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .cat-name {
    color: white;
    position: absolute;
    left: 80%;
    bottom: 20%;
  }
</style>
