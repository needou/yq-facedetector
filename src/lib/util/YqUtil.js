
function createWebSocketRequest(url, message, callback) {
    const socket = new WebSocket(url);

    // 连接成功时触发
    socket.addEventListener('open', () => {
        console.log('WebSocket 连接已建立');

        // 发送消息
        socket.send(message);
    });

    // 接收消息时触发
    socket.addEventListener('message', (event) => {
        console.log('接收到消息:', event.data);

        // 处理消息
        if (callback) {
            callback(event.data);
        }

        // 请求完成后关闭连接
        socket.close();
    });

    // 连接关闭时触发
    socket.addEventListener('close', (event) => {
        console.log('WebSocket 连接已关闭，代码：', event.code, '原因：', event.reason);
        if (callback) {
            callback(null,event)
        }
    });

    // 连接错误时触发
    socket.addEventListener('error', (event) => {
        console.error('WebSocket 连接出错', event);
        if (callback) {
            callback(null,event)
        }
    });
}

/**
 * 刷新特征库
 * @param url 服务地址
 * @param callback
 */
export const reloadDb =(url='ws://localhost:19002',callback)=>{
    //刷新本地特征库
    const messageToSend = {
        func:'buildRecognizer'
    }
    createWebSocketRequest(url, JSON.stringify(messageToSend), (response,error) => {
        //console.log('收到响应：', response);
        if(callback){
            callback(response,error)
        }
    });
}

/**
 * 获取可用的摄像头列表
 * @returns {*[]}
 */
export const getDeviceList = ()=>{

    let videoArr=[]
    // 检查浏览器是否支持媒体设备API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //获取摄像头列表
        navigator.mediaDevices.enumerateDevices()
            .then((devices)=> {

                devices.forEach((device)=> {
                    if(device.kind == 'videoinput'){
                        videoArr.push({
                            'label': device.label,
                            'id': device.deviceId
                        })
                    }
                })
            })
            .catch((err)=> {
                console.log(err)
            })

    }

    return videoArr

}


