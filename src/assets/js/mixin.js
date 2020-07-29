import {mapGetters} from 'vuex'
export const playListMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() { //keepalive触发
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal){
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist(){
            throw new Error('component must implement handlePlaylist method')
        }
    },
}

