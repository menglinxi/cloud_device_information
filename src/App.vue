<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import {
    mapMutations
} from 'vuex';

export default {
    name: "app",
    methods: {
        ...mapMutations(['remove']),
        islogin() {
            this.$api.User.islogin(success => {
                // if(this.$store.state.loginUser.status == 'FAIL') {
                //     this.$message.error('请重新登录 ~~~ ')
                // }
                // else {
                //     this.$message.success('已登录！页面跳转中~~~')
                // }
            }, error => {
                this.remove()
                this.$router.push('/login')
            })
        }
    },
    created() {
        this.islogin()
    }
};
</script>

<style lang="scss">
    body {
        margin: 0px;
        padding: 0px;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
        Microsoft YaHei, SimSun, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
    }

    #app {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    section .el-row {
        margin-bottom: 10px;
    }

    .el-submenu [class^="fa"] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^="fa"] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .toolbar {
        background: #f2f2f2;
        padding: 10px;
        //border:1px solid #dfe6ec;
        margin: 10px 0px;
        .el-form-item {
            margin-bottom: 10px;
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.2s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .el-dialog__header {
        border-bottom: 1px solid #e0dbdb
    }

    .el-dialog__footer {
        border-top: 1px solid #e0dbdb
    }
</style>
