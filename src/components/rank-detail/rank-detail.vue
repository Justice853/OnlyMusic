<template>
  <transition name="slide">
    <music-list :songs="listDetail" :title="title" :bg-image="bgImage" :htitle="htitle"></music-list>
</transition>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import {ERR_OK} from 'assets/js/config'
import {createSong} from 'assets/js/song'
import MusicList from 'base/music-list/music-list'
export default {
    data() {
        return {
            listDetail:[],
            htitle:'歌单'
        }
    },
    components:{
        MusicList
    },
    created(){
        this._getSongList(this.topList.id)
        
    },
    computed: {
        title(){
            return this.topList.name
        },
        bgImage(){
            return this.topList.coverImgUrl
        },
         ...mapGetters([
            'topList'
        ])
    },
    methods:{
        _getSongList(id){
            if(!id){
                this.$router.push('/rank')
                return 
            }
            this.listDetail=this.topList.tracks.map((item)=>{
                return createSong(item)
            })
           
        },
       
    }
    
    
}
</script>

<style lang="stylus" scoped>
.slide-enter-active 
        transition: all 0.3s ease cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-leave-active 
        transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
        transform: translateX(10px)
        opacity: 0
</style>