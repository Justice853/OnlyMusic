<template>
  <div class="search-box">
      <input :placeholder="placeholder" v-model="query" type="text" class="box">
      <font-awesome-icon icon="times" class="fa" v-show="query"  @click="clear"></font-awesome-icon>
  </div>
</template>

<script>
import {debounce} from 'assets/js/util'
export default {
    props:{
        placeholder:{
            type:String,
            default:'搜索歌曲、歌手'
        }
    },
    data() {
        return {
            query:'',
            clickInfo:'搜索'
        }
    },
    created(){
        this.$watch('query',debounce((newQuery)=>{
            this.$emit('query',newQuery)
        },300))
    },
    methods:{
        clear(){
            this.query=''
        },
        setQuery (query) {
            this.query = query
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    height: 25px
    border-bottom: 1px solid rgb(235, 235, 235)
    .box
        flex: 1
        line-height: 25px
        background: $color-theme
        color: #fff
        font-size: $font-size-medium
        border: none
        outline: medium
        &::placeholder 
            color: rgba(255, 255, 255, 0.6)
    .fa
        position: absolute
        right: 12px
        font-size: 14px
        color: rgba(255, 255, 255, 0.8)
        border: none

</style>