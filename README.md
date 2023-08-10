# yq-facedetector

````
A front-end Vue component that interfaces with YQFaceDetector
 facial recognition, mainly used for web based facial recognition and preview, based on websocket
````


## Project setup
```
yarn add yq-facedetector

npm i yq-facedetector
```

### Example
```
import YqVideo from "yq-facedetector";

components:
 <yq-video ref="yqVideo" :width="320" :height="240"
                @comparison="handleCheck"
                @error="handleVideoError"/>
                
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
          //result
          this.detector = detector
          console.log("result", detector)
        }
        //anti
        if (anti) {
          this.anti = anti
          console.log("anti", anti)
        }
      }
    },
    handleVideoError(code,err){
      console.log('error',code,err)
    }

  }
```
