<!-- 商家销量横向柱状图 -->
<template>
    <div class = "com-container">
        <div class="com-chart" ref="seller_ref"></div>
    </div>
</template>
<script>

export default {
    data () {
        return {
            chartInstance: null,
            allData: null,
            currentPage: 1,
            totalPage: 0,
            timeId: null
        }
    },
    created () {
    this.$socket.registerCallBack('sellerData', this.getData)
    },
    mounted () {
        this.initChart()
        // this.getData()
        this.$socket.send({
            action: 'getData',
            socketType: 'sellerData',
            chartName: 'seller',
            value: ''
        })
        window.addEventListener('resize', this.screenAdapter)
        // 页面加载完后主动屏幕适配
        this.screenAdapter()
    },
    destroyed () {
        clearInterval(this.timeId)
        // 组件销毁时，监听器取消
        window.removeEventListener('resize', this.screenAdapter)
        this.$socket.unregisterCallBack('sellerData')
    },
    methods: {
        // 初始化实例
        initChart () {
            this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
            // 对图表初始化配置的控制
            const initOption = {
                title: {
                    text: '▍ 商家销售统计',
                    left: 20,
                    top: 20
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '6%',
                    buttom: '3%',
                    // 一般grid距离不包括坐标轴文字
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        z: 0,
                        lineStyle: {
                            width: 30,
                            color: '#2D3443'
                        }
                    }
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 30,
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: 'white'
                            }
                        },
                        itemStyle: {
                            barBorderRadius: [0, 15, 15, 0],
                            // 颜色渐变，指明颜色渐变方向和占比
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                    offset: 0,
                                    color: '#5052EE'
                                }, {
                                    offset: 1,
                                    color: '#AB6EE5'
                                }
                            ])
                        }
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
            // 对图表对象进行鼠标监控
            this.chartInstance.on('mouseover', () => {
                clearInterval(this.timeId)
            })
            this.chartInstance.on('mouseout', () => {
                this.startInterval()
            })
        },
        // 获取服务器数据
        getData (ret) {
            // http://127.0.0.1:8888/api/seller
            // const { data: ret } = await this.$http.get('seller')
            this.allData = ret
            // 数据排序
            this.allData.sort((a, b) => {
                return a.value - b.value
            })
            // 每五个元素一页
            this.totalPage = this.allData % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
            // 数据更新
            this.upDataChart()
            // 启动定时器
            this.startInterval()
        },
        // 更新图表
        upDataChart () {
            // 分页
            const start = (this.currentPage - 1) * 5
            const end = this.currentPage * 5
            const showData = this.allData.slice(start, end)
            // data value
            const sellerNames = showData.map((item) => { return item.name })
            const sellerValues = showData.map((item) => { return item.value })
            const dataOption = {
                yAxis: {
                    data: sellerNames
                },
                series: [
                    {
                        data: sellerValues
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        // 换页定时器
        startInterval () {
            if (this.timeId) {
                clearInterval(this.timeId)
            }
            this.timeId = setInterval(() => {
                this.currentPage++
                if (this.currentPage >= this.totalPage) {
                    this.currentPage = 1
                }
                this.upDataChart()
            }, 3000)
        },
        // 窗口尺寸监听方法,完成屏幕适配
        screenAdapter () {
                const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
                // 分辨率大小相关配置项
                const adapterOption = {
                    title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                tooltip: {
                    axisPointer: {
                        lineStyle: {
                            width: titleFontSize
                        }
                    }
                },
                series: [
                    {
                        barWidth: titleFontSize,
                        itemStyle: {
                            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
                        }
                    }
                ]
                }
                this.chartInstance.setOption(adapterOption)
                // 需要手动调用resize才能有效果
                this.chartInstance.resize()
        }
    }
}
</script>
<style lang="less">
</style>
