<template>
  <div class="search-list" v-show="searches.length">
      <transition-group name="list" tag="ul">
          <li class="search-item" v-for="item in searches" :key="item" @click="selectItem(item)" >
              <span class="text">{{item}}</span>
              <span class="icon" @click.stop="deleteOne(item)" >
                  <font-awesome-icon icon="minus" class="icon-delete"></font-awesome-icon>
              </span>
          </li>
      </transition-group>
  </div>
</template>

<script>
export default {
    props:{
        searches:{
            type:Array
        }
    },
    methods:{
        selectItem(item){
            this.$emit('select',item)
        },
        deleteOne(item){
            this.$emit('delete',item)
        }
    }

}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.search-list
    .search-item
        display :flex
        align-items :center
        height:35px
        overflow :hidden
        font-size:14px
        &.list-enter-active, &.list-leave-active
            transition: all 0.1s;
        &.list-enter, &.list-leave-to
            height: 0;
        .text
            flex:1
            color:$color-text
        .icon
            extend-click()
            .icon-delete
                font-size:$font-size-small
                color:$color-text
</style>