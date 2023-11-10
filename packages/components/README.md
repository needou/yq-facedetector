# jworker-components

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Compile and Minify for Production

```sh
yarn build
```



    drawFrame(){
      const videoElement = this.$refs.videoElement
      const canvasElement = this.$refs.canvasElement

      if (videoElement.paused || videoElement.ended) {
        return
      }

      const canvas = canvasElement.getContext('2d')
      canvasElement.width = this.getVideoWidth
      canvasElement.height = this.getVideoWidth
      // 清除画布
      canvas.clearRect(0, 0, canvasElement.width, canvasElement.height)
      // 绘制视频帧
      canvas.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)

      // 在标注状态下绘制标注
      if (this.runState=='run') {
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