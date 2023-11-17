<template>
  <div class="greetings">
    <yq-verify
        ref="yqVideo"
        :width="width"
        :height="height"
        :detectorScore="detectorScore"
        @complete="handleComplete"
    />
    <button>开始</button>
    <button>停止</button>
    <div>
      <h2>结果</h2>
      <p>{{result}}</p>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue"

const width = ref(600)

const height = ref(480)

const detectorScore = ref(0.5)

const result = ref({})

const handleComplete = (item)=>{
  result.value = item
}
</script>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
