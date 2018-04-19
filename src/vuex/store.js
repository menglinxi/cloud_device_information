import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
export default new Vuex.Store({
    actions: {
        getChannel({commit}) {
            Vue.prototype.$api.Channel.allList(result => {
                if(result.pager) {
                    commit('saveChannelList', result.pager)
                }
            })
        }
    },
    mutations: {
        save(state, user) {
            state.loginUser = user;
        },
        remove(state) {
            state.loginUser = {
                name: '',
                id: 0,
                mobile: '',
                roles: [],
                status: 'FAIL',
                permissions: []
            }
        },
        updateAvatar(state, key) {
            state.loginUser.headKey = key;
        },
        saveChannelList(state, list) {
            state.channelList = list
        }
    },
    getters: {
        hasRole: (state, getters) => (role) => {
            return state.loginUser.roles.filter(r => r === role).length > 0;
        },
        hasPermission: (state, getters) => (permission) => {
            return state.loginUser.permissions.filter(p => p === permission).length > 0;
        }
    },
    state: {
        loginUser: {
            name: '',
            id: 0,
            mobile: '',
            roles: [],
            status: 'FAIL',
            permissions: []
        },
        channelList: []
    },
    strict: process.env.NODE_ENV !== 'production',
    plugins: [createPersistedState()]
})
