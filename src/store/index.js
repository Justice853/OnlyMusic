import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './action'
import * as getters from './getter'
import mutations from './mutations'
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})

