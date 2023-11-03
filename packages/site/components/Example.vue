<template>
  <div class="box">
<!--    <h2>本地人脸识别</h2>-->
    <div style="position: absolute;z-index: 200;left: 0;right: 0">
      <select v-model="device">
        <option :value="device.id" v-for="device in deviceList">{{device.label}}</option>
      </select>
      <button @click="start">开始</button>
      <button @click="capture">拍照</button>

      <button @click="stop">停止</button>
      <button @click="reload">重载</button>
    </div>
    <div style="width:640px;height: 480px;transform: scale(1); ">
      <yq-verify
          ref="yqVideo"
          :width="480"
          :height="480"
          @comparison="handleCheck"
          @error="handleVideoError"
      />
    </div>

    <div class="result" v-if="detector && detector.length>0">
      <h3>识别结果</h3>
      <ul>
        <li :key="n" v-for="(it,n) in detector">
          名称：{{it.fileName}}，分值:{{it.score.toFixed(2)}}
        </li>
      </ul>
      <div v-if="anti">
        <h3>活体信息</h3>
        <span>
          清晰度：{{anti.clarity.toFixed(2)}}，真实度:{{anti.reality.toFixed(2)}}，分值:{{anti.score.toFixed(2)}}
        </span>
      </div>
    </div>
    <div style="position: absolute;z-index: 1000;right: -300px;top: 0">
      <img :src="img" style="width: 300px" height="300px" />
    </div>
  </div>
</template>

<script>
import YqFacedetector from "@/lib/components";
import YqUtil from "@/lib/util";
import Vue from "vue";
Vue.use(YqFacedetector);

export default {
  name: 'Example',
  data(){
    return {
      device:'',
      deviceList:[],
      detector:[],
      img:null,
      anti:{},
      isRun:false
    }
  },
  mounted() {
    this.initDeviceList()
  },
  methods:{
    capture(){
      const data =  this.$refs.yqVideo.capturePicture()
      this.img = data
    },
    start(){
      this.isRun=true
      //const deviceId = 'c56ce923ae3ba16b37d7b93d72f4874d8c9e826a2150e9969162b98ad976d1f2'
      //console.log('=============device',deviceId)
      this.$refs.yqVideo.openDevice(this.device)
      this.$refs.yqVideo.start()

    },
    stop(){
      this.isRun=false
      this.detector=[]
      this.$refs.yqVideo.stop()
    },
    reload(){
      YqUtil.reloadDb('ws://localhost:19002')
    },
    handleCheck(detector,anti){
      if(this.isRun) {
        if (detector) {
          //识别结果
          this.detector = detector
          console.log("识别结果", detector)
        }
        //活体检测
        if (anti) {
          //输出活体识别
          this.anti = anti
          console.log("活体信息", anti)
        }
      }
    },
    handleVideoError(code,err){
      console.log('错误信息',code,err)
    },
    initDeviceList(){
      console.log('list-------')
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('list')
        //获取摄像头列表
        navigator.mediaDevices.enumerateDevices()
            .then((devices)=> {
              console.log(devices)
              let videoArr=[]
              devices.forEach((device)=> {
                if(device.kind == 'videoinput'){
                  videoArr.push({
                    'label': device.label,
                    'id': device.deviceId
                  })
                }
              })
              console.log('videoArr',videoArr)
              this.deviceList = videoArr
            })
            .catch((err)=> {

            })

      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box{
  position: relative;
  width: 640px;
  height: 480px;
  /*overflow: hidden;*/
}
.result{
  position: absolute;
  left: 50%;
  top: 30px;
  background-color: rgba(42,102,186,0.5);
  color: #fff;
  width: 200px;
  margin: 0 0 0 -100px;
  font-size: 12px;
}
h3 {
  margin: 0;
  padding: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
