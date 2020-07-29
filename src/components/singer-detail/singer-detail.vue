<template>
<transition name="slide">
    <div class="singer-detail">
        <music-list :songs="listDetail" :title="title" :bg-image="bgImage"></music-list>
    </div>
</transition>
  

</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'assets/js/config'
import {createSong} from 'assets/js/song'
import MusicList from 'base/music-list/music-list'
export default {
    data() {
        return {
            listDetail:[],
        }
    },
    computed:{
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.avatar
        },
        ...mapGetters([
            'singer'    //getter相同名的singer属性
        ])
    },
    components:{
        MusicList
    },
    created(){
        this._getDetail()
    },
    methods:{
        _getDetail() {
             if(!this.singer.id){
                this.$router.push('/singer')
            }
            getSingerDetail(this.singer.id).then((res)=>{
                if(res.status === ERR_OK){
                    this.listDetail =this._normalizeSongs(res.data.hotSongs)
                }
            })
        },
        _normalizeSongs (list) {
            let ret = []
            list.forEach((item) => {
                ret.push(createSong(item))
            })
            return ret
        },
    },
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"

    .singer-detail
        position :fixed
        z-index :100
        top:0 //left:0; right:0; top:0; bottom:0; margin：auto;会使text居中，如果text没有宽高，则会继承父集的宽高
        left :0
        right:0
        bottom:0
    .slide-enter-active 
        transition: all 0.3s ease cubic-bezier(1.0, 0.5, 0.8, 1.0)
    .slide-leave-active 
        transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
    .slide-enter, .slide-leave-to
        transform: translateX(10px)
        opacity: 0



  

   



</style>