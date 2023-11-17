<template>
  <div
      :style="{width:width+'px',height:height+'px'}"
      class="video-wrap"
  >
    <div class="video-info" :style="{height:height+'px',width:width+'px'} ">
      <video
          ref="videoElementRef"
          :width="getVideoWidth"
          :height="getVideoHeight"
          autoplay
          class="video-item"
      >
      </video>

    </div>
  </div>
</template>

<script setup>
import {compressImage} from "../util/util"
import RequestUtil from "../util/request-util"
import {ref,computed,onMounted,onBeforeUnmount} from 'vue'


const emits = defineEmits(['complete'])

const props = defineProps({
  host:{
    type:String,
    default: 'http://127.0.0.1:19001'
  },
  width: {
    type: Number,
    default: 640
  },
  height: {
    type: Number,
    default: 480
  },
  //人脸特征值大小
  detectorScore:{
    type: Number,
    default: 0.5
  },
  autoStart:{
    type: Boolean,
    default: true
  },
  deviceId:{
    type: String,
    default: ''
  }
})

const videoElementRef = ref()

const videoAspectRatio=ref(1.333)//摄像头比例
const isStop=ref(true)

const captureState=ref(true) //抓拍枚举

//计算是视频宽度
const getVideoWidth = computed(()=>{
  //const wd = props.height*props.videoAspectRatio
  //return wd
  return props.width
})
//计算视频高度
const getVideoHeight = computed(()=>{
  // const ht =props.height
  // return ht

  return props.height
})

/**
 * 打开摄像头
 * @param deviceId
 */
const openDevice = (deviceId)=>{
  const videoElement = videoElementRef.value
  let videoSetting=true
  if(deviceId){
    videoSetting= { deviceId: { exact: deviceId } }
  }
  // 请求访问摄像头和音频
  navigator.mediaDevices.getUserMedia({ video:videoSetting , audio: false }).then(stream => {
    const videoTrack = stream.getVideoTracks()[0]
    const settings = videoTrack.getSettings()
    const aspectRatio = settings.aspectRatio

    if(aspectRatio){
      videoAspectRatio.value = aspectRatio
    }

    // 将摄像头视频流绑定到视频元素
    videoElement.srcObject = stream
  }).catch(error => {

    console.error('Error accessing camera:', error)
  })
}

/**
 * 启动
 */
const start = ()=>{
  isStop.value = false
  const videoElement = videoElementRef.value
  if(videoElement){
    videoElement.play()
  }

}
/**
 * 停止
 */
const stop = ()=> {
  isStop.value = true
  //暂停摄像头
  const videoElement = videoElementRef.value
  if (videoElement) {
    videoElement.pause()
  }

}

/**
 * 抓取帧
 */
const capture = async ()=> {
  const videoElement = videoElementRef.value
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // 设置canvas的宽高与视频元素相同
  canvas.width = getVideoWidth.value
  canvas.height = getVideoHeight.value
  // 在canvas上绘制当前视频帧
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

  // 获取图像二进制数据
  //const imageData = canvas.toDataURL('image/jpeg',0.8).split(',')[1]
  const imageData = canvas.toDataURL('image/jpeg', 0.8)
  //压缩图像
  let newData = await compressImage(imageData, canvas.width, canvas.height,400, 400)

  const newDataCompose = newData.split(',')[1]
  //后台线程处理
  if(captureState.value) {
    comparison(newDataCompose)
  }

}

//人脸比对
const comparison = async (newData) => {
  captureState.value = false
  let params = {
    imageData: newData,
    enableAnti: false, //是否活体检测
    detectorScore: props.detectorScore //特征值筛选
  }
  //发送数据
  RequestUtil.post(props.host + '/featureComparison', params).then((msg)=>{

    if (msg.code == 0) {
      const data = msg.data
      console.log('识别结果', data)
      if (data) {
        showResult(data.detector,data.anti)
      }
    } else {
      //返回错误
      console.log('error', msg.code, msg.message)
    }
    captureState.value = true
  })


}
/**
 * 识别结果
 * @param detector
 * @param anti
 */
const showResult = async (detector, anti) => {
  if (detector && detector.length > 0) {
    //排序
    detector.sort((a, b) => b.score - a.score)

    const item = detector[0]
    if (item.score > props.detectorScore) {
      emits('complete',item)
    }

  }
}


/**
 * 释放
 */
const dispose = ()=>{

  window.clearInterval(window.FACE_FIND_TIMER)
  //暂停摄像头
  const videoElement = videoElementRef.value
  if (videoElement) {
    videoElement.pause()
    videoElement.srcObject = null
  }
  //释放摄像头
  navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
    mediaStream.getTracks().forEach((track) => {
      track.stop()
      console.log('释放摄像头')
    })
  })
}

onMounted(()=>{
  if(props.autoStart){
    //打开摄像头
    openDevice(props.deviceId)
  }
  //人脸查找定时器
  window.FACE_FIND_TIMER =  setInterval(()=>{
    if(!isStop.value) {
      capture()
    }
  },10)
})

onBeforeUnmount(() => {
  dispose()
})

defineExpose({
  start,
  stop
})
</script>
<style scoped>
.video-wrap{
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}
.video-info{
  border-radius: 5px;
  background-color: #2c3e50;
  overflow: hidden;
  position: relative;
}

</style>
