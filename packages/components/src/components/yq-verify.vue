<template>
  <div
      :style="{width:width+'px',height:height+'px'}"
      style="position: relative;overflow: hidden;transform: scale(1);background-color:#d0d0d0;"
  >
    <!--video-->
    <video
        ref="videoElement"
        :width="width"
        :height="height"
        autoplay
        style="object-fit: fill;"
        @play="play"
    >

    </video>
    <!--mask-->
    <canvas
        ref="canvasElement"
        :style="{width:width+'px',height:height+'px'}"
        style="position: absolute;left: 0;top: 0;z-index:100;"
    >

    </canvas>

  </div>
</template>

<script>
/**
 * yq本地人脸识别
 */
export default {
  name:'yq-verify',
  props: {
    host:{
      type:String,
      default: 'ws://localhost:19002'
    },
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 480
    },
    detectorScore:{
      type: Number,
      default: 0.3
    },
    autoStart:{
      type: Boolean,
      default: false
    },
    deviceId:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      deviceList:[],
      isRun: false,//是否运行
      socket: null,
      connected: false,
      isCapture:false,//是否抓取种
      isCheck:false, //是否识别中
      findFace:false, //是否找到人脸
      face:[] //人脸数据
    };
  },
  mounted() {
    if(this.autoStart){
      //打开摄像头
      this.openDevice(this.deviceId)
      //开始识别
      this.start()
    }
    this.connectWebSocket()
  },
  methods: {
    /**
     * 打开摄像头
     * @param deviceId
     */
    openDevice(deviceId){
      const videoElement = this.$refs.videoElement
      // 请求访问摄像头和音频
      navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } }, audio: false }).then(stream => {
        // 将摄像头视频流绑定到视频元素
        videoElement.srcObject = stream
      }).catch(error => {

        this.$emit('error',error)
        console.error('Error accessing camera:', error)
      })
    },
    /**
     * websocket
     */
    connectWebSocket() {
      this.socket = new WebSocket(this.host)

      this.socket.onopen = () => {
        console.log('WebSocket connection established.')
        this.connected = true
      }

      this.socket.onmessage = (event) => {
        //console.log('Received message:', event.data)
        const msg =JSON.parse(event.data)
        if(msg.func=='faceFind'){
          let faceTmp = []
          if(msg.code==0){
            if(msg.data && msg.data.face){
              faceTmp =  msg.data.face
              if(faceTmp && faceTmp.length>0){
                //是否找到人脸
                this.findFace = true
              }else{
                this.findFace = false
              }
            }
          }else{
            //返回错误
            this.$emit('error',msg.code,msg.message)
          }
          this.face = faceTmp
          this.isCapture = false
        }
        if(msg.func=='featureComparison'){
          if(msg.code==0){

            if(msg.data){
              //反馈结果
              this.$emit('comparison',msg.data.detector,msg.data.anti)
            }
          }else{
            //返回错误
            this.$emit('error',msg.code,msg.message)
          }
          this.isCheck = false
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket connection closed. Reconnecting...')
        this.connected = false
        window.FACE_CONNECT_TIMER = setTimeout(() => {
          this.connectWebSocket() // 自动重连
        }, 1000)
      }
    },
    /**
     * 发送消息
     * @param msg
     * @param func
     */
    sendMessage(msg,func) {
      if (this.connected) {
        msg.func = func
        this.socket.send(JSON.stringify(msg))
      } else {
        console.log('WebSocket not connected.')
      }
    },
    /**
     * 开始运行识别
     */
    startAnnotation() {
      this.isRun = true
    },
    /**
     * 清除识别
     */
    clearAnnotation() {
      this.isRun = false
      const canvasElement = this.$refs.canvasElement
      const canvas = canvasElement.getContext('2d')
      canvas.clearRect(0, 0, canvasElement.width, canvasElement.height)
    },
    /**
     * 绘制视频帧
     */
    drawFrame(){
      const videoElement = this.$refs.videoElement
      const canvasElement = this.$refs.canvasElement

      if (videoElement.paused || videoElement.ended) {
        return
      }
      const canvas = canvasElement.getContext('2d')
      canvasElement.width = this.width
      canvasElement.height = this.height
      // 清除画布
      canvas.clearRect(0, 0, canvasElement.width, canvasElement.height)
      // 绘制视频帧
      canvas.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)

      const imageData = canvas.toDataURL('image/jpeg',0.8)
      this.$emit('frame',imageData)

      // 在标注状态下绘制标注
      if (this.isRun) {
        //console.log('ok==========',this.face)
        // 清除画布
        if(this.face && this.face.length>0){

          for (let i = 0; i < this.face.length; i++) {
            let faceItem = this.face[i]
            // 绘制矩形
            canvas.fillStyle = "rgba(0, 0, 0, 0)"
            canvas.strokeStyle = 'red'
            canvas.lineWidth = 2
            canvas.strokeRect(faceItem.x, faceItem.y, faceItem.width, faceItem.height)
          }
        }else{
          canvas.clearRect(0, 0, canvasElement.width, canvasElement.height)
        }
        // canvas.font = '24px Arial'
        // canvas.fillStyle = 'red'
        // canvas.fillText('邓小华', 50, 50)
      }
      // 递归调用绘制下一帧
      requestAnimationFrame(this.drawFrame)
    },
    /**
     * 播放回调
     */
    play(){
      this.drawFrame()
    },
    /**
     * 启动
     */
    start(){
      this.startAnnotation()
      //this.capture(1)
      //人脸查找定时器
      window.FACE_FIND_TIMER =  setInterval(()=>{
        if(!this.isCapture) {
          this.capture()
          this.isCapture = true
        }
      },10)
      //人脸识别定时器
      window.FACE_COMPAR_TIMER =  setInterval(()=>{
        if(this.findFace && !this.isCheck) {
          this.capture(1)
          this.isCheck = true
        }
      },1000)

    },
    /**
     * 停止
     */
    stop(){

      this.clearAnnotation()
      window.clearInterval(window.FACE_FIND_TIMER)
      window.clearInterval(window.FACE_COMPAR_TIMER)

      const videoElement = this.$refs.videoElement
      if(videoElement){
        videoElement.pause()
      }
    },
    /**
     * 抓取帧
     * @param type
     */
    capture(type){
      const videoElement = this.$refs.videoElement
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 设置canvas的宽高与视频元素相同
      canvas.width = this.width
      canvas.height = this.height
      //console.log(canvas.width,canvas.height)
      // 在canvas上绘制当前视频帧
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

      // 获取图像二进制数据
      const imageData = canvas.toDataURL('image/jpeg',0.8).split(',')[1]

      if(type==1){
        let params = {
          imageData:imageData,
          enableAnti:true, //是否活体检测
          detectorScore:this.detectorScore //特征值筛选
        }
        this.sendMessage(params,'featureComparison')
      }
      else{
        let params = {
          imageData:imageData
        }
        this.sendMessage(params,'faceFind')
      }

    },
    /**
     * 抓取图像
     */
    capturePicture(){
      const videoElement = this.$refs.videoElement
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 设置canvas的宽高与视频元素相同
      canvas.width = this.width
      canvas.height = this.height
      //console.log(canvas.width,canvas.height)
      // 在canvas上绘制当前视频帧
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

      // 获取图像二进制数据
      const imageData = canvas.toDataURL('image/jpeg',0.8)

      return imageData
    },
    /**
     * 释放
     */
    dispose(){
      if(this.socket){
        this.socket.close()
      }
      window.clearTimeout(window.FACE_CONNECT_TIMER)
      window.clearInterval(window.FACE_FIND_TIMER)
      window.clearInterval(window.FACE_COMPAR_TIMER)
    }
  },
  destroyed() {
    this.dispose()
  }
}

</script>
