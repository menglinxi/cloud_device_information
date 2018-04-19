import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import VueRouter from "vue-router";
import store from "./vuex/store";
import Vuex from "vuex";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import routes from "./routes";
import "font-awesome/css/font-awesome.min.css";
import "./assets/style.less";

import api from "./api";
import http from "./http";
import rules from "./rules";

import AMap from 'vue-amap';
import BgaBackTop from "bga-back-top-vue";
import ElTreeGrid from "element-tree-grid";
import utils from "./common/js/util";

Vue.use(AMap);
AMap.initAMapApiLoader({
    key: "ae7db9d3bfa41d83f2414eade8e613f9",
    plugin: [
        "AMap.Autocomplete",
        "AMap.Geocoder",
        "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        "AMap.ToolBar",
        "AMap.MapType",
        "AMap.PolyEditor",
        "AMap.CircleEditor",
        "AMap.Geolocation"
    ]
});

Vue.use(BgaBackTop);

Vue.component(ElTreeGrid.name, ElTreeGrid);

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.prototype.$http = http;
Vue.prototype.$rules = rules;
Vue.prototype.$api = api;
Vue.prototype.$utils = utils;

global.baseUrl = process.env.NODE_ENV == "development" ? "api" : "";
// NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    // mode: 'history',
    routes: routes
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    let aa = to.matched.some(item => {
        return item.meta.requiresAuth
    })
    if(aa) {
        if(store.state.loginUser.status == 'FAIL') {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
        else {
            next()
        }
    }
    else {
        next();
    }
});

router.afterEach(transition => {
    NProgress.done();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
