<template>
  <div class="box">
    <div style="position: absolute;z-index: 200;left: 0;right: 0">
      <button @click="start">启动</button>
      <button @click="stop">停止</button>
      <button @click="reload">重载</button>
    </div>
    <div style="width:640px;height: 480px;transform: scale(1); ">
      <yq-video ref="yqVideo" :width="640" :height="480"
                @comparison="handleCheck"
                @error="handleVideoError"/>
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
  </div>
</template>

<script>
import YqFacedetector from "@/lib/index";
import Vue from "vue";
// 使用 YqVideo 和 Demo 组件
Vue.use(YqFacedetector);

export default {
  name: 'Example',
  components: [],
  data(){
    return {
      detector:[],
      anti:{},
      isRun:false
    }
  },
  methods:{
    start(){
      this.isRun=true
      this.$refs.yqVideo.start()
    },
    stop(){
      this.isRun=false
      this.detector=[]
      this.$refs.yqVideo.stop()
    },
    reload(){
      this.$refs.yqVideo.refreshDb()
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
  overflow: hidden;
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
