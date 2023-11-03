<!-- CameraCapture.vue -->
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

export default {
  name:'baidu-verify',
  props: {
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 480
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
    };
  },
  mounted() {
    if(this.autoStart){
      //打开摄像头
      this.openDevice(this.deviceId)
      //开始识别
      this.start()
    }
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
     * 启动
     */
    start(){
      //人脸识别定时器
      window.FACE_COMPAR_TIMER =  setInterval(()=>{
          this.capture()
      },1000)

    },
    /**
     * 停止
     */
    stop(){
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
    capture(){
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
      //const imageData = canvas.toDataURL('image/jpeg',0.8).split(',')[1]
      const imageData = canvas.toDataURL('image/jpeg',0.8)

      this.$emit('capture',imageData)

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
      window.clearInterval(window.FACE_COMPAR_TIMER)
    }
  },
  destroyed() {
    this.dispose()
  }
}

</script>
