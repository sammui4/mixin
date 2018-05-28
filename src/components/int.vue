<template>
  <div>
     
          <div v-if="download===true" wave>download</div>
          <div v-else v-wave>downloadno</div>

  </div>
</template>

<script>
import premission from '@/mixins/premission'
export default {
    mixins:[premission],
    created(){
        this.getdownload({
            name:'a'
        })
    }
}
</script>

<style>

</style>
