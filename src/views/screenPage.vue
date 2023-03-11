<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="../../public/static/img/header_border_dark.png" alt="">
      </div>
      <span class="logo">
        <img src="../../public/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">企业销售实时监控系统</span>
      <div class="title-right">
        <span class="datetime">{{ datetime }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <!-- 缩小 compress -->
            <span :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"
              @click="changeSize('trend')"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"
              @click="changeSize('seller')"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <SMap ref="map"></SMap>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"
              @click="changeSize('map')"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"
              @click="changeSize('rank')"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"
              @click="changeSize('hot')"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"
              @click="changeSize('stock')"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/hot.vue'
import SMap from '@/components/map.vue'
import Rank from '@/components/rank.vue'
import Seller from '@/components/seller.vue'
import Stock from '@/components/stock.vue'
import Trend from '@/components/trend.vue'
export default {
  created() {
    this.$socket.registerCallBack('fullScreen', this.recvData)
  },
  destroyed() {
    this.$socket.unregisterCallBack('fullScreen')
  },
  data() {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  components: {
    Hot,
    SMap,
    Rank,
    Seller,
    Stock,
    Trend
  },
  methods: {
    changeSize(chartName) {
      // // 改变fullscreen数据
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // // 调用每个图表组件的screenAdapter()
      // // this.$refs[chartName].screenAdapter()
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter()
      // })
      // 发送数据到服务端，并转发到每个浏览器
      const targetValue = !this.fullScreenStatus[chartName]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    recvData(data) {
      // 去除图表需要状态及名称
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    }
  },
  computed: {
    datetime: function () {
      const myDate = new Date()

      return myDate.toLocaleString()
    }
  }
}
</script>
<style lang="less" scoped>
// 全屏样式
.fullscreen {
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0px !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  >div {
    img {
      width: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 30px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 128px;
    }
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;

  .screen-left {
    height: 100%;
    width: 27.6%;

    #left-top {
      height: 53%;
      position: relative;
    }

    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      height: 46%;
      position: relative;
    }

    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
