<template>
<div class="m-header">
    <h1 class="text">就要音乐</h1>
    <router-link to="/user" class="mine" tag="div">
        <font-awesome-icon icon="bars" class="iconfont" />
    </router-link>
    <router-link to="/search" class="search" tag="div">
        <font-awesome-icon icon="search" class="iconfont" />
    </router-link>
</div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
    .m-header
        position:relative
        height:44px
        width:100%
        text-align :center;
        background:$color-theme
        .text
            line-height:44px;
            font-weight :bold;
            color:$color-text-l;
            letter-spacing :3px //letter-spacing 属性增加或减少字符间的空白（字符间距）。
        .mine
            position :absolute
            top:-1.5px
            left:0
            .iconfont
                display :block
                padding:11px
                font-size :22px
                color:$color-theme-l
        .search
            position :absolute
            top:0
            right:2px
            .iconfont
                display :block
                padding:12px
                font-size :18px
                color:$color-theme-l
            

</style>