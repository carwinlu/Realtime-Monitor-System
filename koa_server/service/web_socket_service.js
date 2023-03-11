const path = require('path')
const fileUtils = require('../utils/file_utils')
// 创建websocket服务端对象，端口号9998
const WebSocket = require('ws')
const { stringify } = require('querystring')
const wss = new WebSocket.Server({
  port: 9998
})
// 服务端开启监听
module.exports.listen = () => {
  // 对客户端连接事件监听
  // client代表客户端连接的socket对象
  wss.on('connection', client => {
    console.log('有客户端连接成功')
    // 对客户端连接对象进行message事件监听
    // msg：客户端发给服务端的数据
    client.on('message', async msg => {
      console.log('有数据发来' + msg)
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        const ret = await fileUtils.getFileJsonData(filePath)
        // 获取数据后增加data字段，对应某个json文件内容
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        // 将接收到的数据转发给每个连接的客户端
        wss.clients.forEach(client => {
          client.send(JSON.stringify(JSON.parse(msg)))
        })
      }
      // 服务端向客户端发送数据
      // client.send('hello socket from backend')
    })
  })
}
