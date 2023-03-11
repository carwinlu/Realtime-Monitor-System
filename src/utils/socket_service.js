export default class SocketService {
  // 单例
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 连接服务端的socket对象
  ws = null
  // 存储回调函数
  callBackMapping = {}
  // 标识是否连接成功
  connected = false
  sendRetryCount = 0
  connectRetryCount = 0

  // 定义连接服务器方法
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      return alert('浏览器不支持websocket代码')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 事件监听
    this.ws.onopen = () => {
      console.log('连接服务端成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    this.ws.onclose = () => {
      this.connectRetryCount++
      console.log('连接服务端失败')
      this.connected = false
      setTimeout(() => {
        this.connected()
      }, this.connectRetryCount * 500)
    }
    this.ws.onmessage = (msg) => {
      console.log('从服务端获取数据')
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') { }
      }
    }
  }

  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  unregisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据方法
  send(data) {
    if (this.connected) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 300)
    }
  }
}
