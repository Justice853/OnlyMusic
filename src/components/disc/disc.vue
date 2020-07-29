<template>
  <transition name="slide">
      <music-list :songs="disclist" :title="title" :bg-image="bgImage" :htitle="htitle"></music-list>
  </transition>
</template>

<script>
import MusicList from 'base/music-list/music-list'
import {getListDetail} from 'api/song'
import {mapGetters} from 'vuex'
import {ERR_OK} from 'assets/js/config'
import {createRecommendListSong} from 'assets/js/song'
export default {
    data() {
        return {
            disclist:[],
            htitle:'歌单'
        }
    },
    created(){
        this._getListDetail(this.disc.id)
    },
    computed:{
        title(){
            return this.disc.name
        },
        bgImage(){
            return this.disc.picUrl
        },
        ...mapGetters([
            'disc'
        ])
    },
    methods:{
        _getListDetail(id){
            if (!id) {
                this.$router.push('/recommend')
                return
            }
            getListDetail(id).then((res)=>{
                if(res.data.code == ERR_OK){
                    this.disclist =res.data.playlist.tracks.map((item)=>{
                        return createRecommendListSong(item)
                    })
                }else{
                    console.error('歌单 获取失败！')
                }
            })
        }
    },
    components:{
        MusicList
    }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active 
        transition: all 0.3s ease cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-leave-active 
        transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
        transform: translate3d(100%,0,0)
</style>