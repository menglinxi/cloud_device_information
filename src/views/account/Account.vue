<template>
    <section>
        <el-row>
            <el-col :span='6'>
                <el-button @click='toShowDialog(0)' type='success' size='small'><i class='el-icon-plus' style='margin-right: 10px'></i>新建账号</el-button>
                <el-button @click='uploadTxt(1)' type='warning' size='small' plain><i class='el-icon-tickets' style='margin-right: 10px'></i>导入TXT文件</el-button>
                <el-button v-if='tableName == "nochannel"' @click='toShowDialog(2)' type='primary' size='small'><i class='el-icon-more'></i>批量分配渠道</el-button> 
            </el-col>
            <el-col :offset='12' :span='6'>
                <el-input v-model='searchMsg' placeholder="账号名称搜索" size='small' clearable @keyup.native.enter='searchAccount'>
                    <el-select class='preIpt' v-model="chosedChannelId" slot="prepend" filterable clearable placeholder="请选择渠道" @change='searchAccount'>
                        <el-option
                        v-for="item in channelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button slot='append' @click='searchAccount'><i class='el-icon-search'></i></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-tabs v-model="tableName" @tab-click="changeTable" type="card">
            <el-tab-pane label="账户列表" name="channel"></el-tab-pane>
            <el-tab-pane label="未分配渠道" name="nochannel"></el-tab-pane>
        </el-tabs>
        <el-table :data='currentList'
            ref="multipleTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            v-if='tableName == "nochannel"'
            prop="id"
            type="selection"
            width="55"
            align="center">
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="账户名"
            width="220">
            </el-table-column>
            <el-table-column
            prop="pwd"
            align="center"
            label="密码"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="channelname"
            align="center"
            label="所属渠道"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="channelcode"
            align="center"
            label="渠道码"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="descs"
            align="center"
            label="说明"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="createtime"
            align="center"
            label="创建时间"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="updtime"
            align="center"
            label="修改时间"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='操作' width='250' align="center">
                <template slot-scope='scope'>
                    <el-button @click='toShowDialog(2, scope.row.id)' size='mini' type='primary' v-if='tableName == "nochannel"'>分配渠道</el-button>
                    <el-button @click='toShowDialog(1, scope.row)' size='mini' type='success'>编辑</el-button>
                    <el-button @click='toDel(scope.row.id)' size='mini' type='danger' plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if='pager.recordCount > 15 && tableName == "channel"'
            style='text-align: center; margin-top: 10px;'
            :total="pager.recordCount"
            :page-size="pager.pageSize" 
            :current-page="pager.pageNumber" 
            layout="prev, pager, next" 
            @current-change='handlePage'>
        </el-pagination>
        <el-dialog :title='msgContent.title' :visible.sync="isShowContent" width='500px' @close='toCancel'>
            <el-form ref='form' label-width='100px'>
                <el-form-item label='账户名' v-if='setChannel == "0"'>
                    <el-input v-model='msgContent.content.name' placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label='密码' v-if='setChannel == "0"'>
                    <el-input v-model='msgContent.content.pwd' placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label='所属渠道'>
                    <el-select  v-model="msgContent.content.channelid" filterable :placeholder="JSON.stringify(!setChannel == '0' ? '请选择或关键字搜索~(非必选)' : '请选择或关键字搜索~(必选)')">
                        <el-option
                        v-for="item in channelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='说明' v-if='setChannel == "0"'>
                    <el-input v-model='msgContent.content.descs' type='textarea' placeholder="非必填"></el-input>
                </el-form-item>
            </el-form>
            <div slot='footer'>
                <el-button @click='toSaveChannel' type='success' v-if='setChannel != "0"'>保存</el-button>
                <el-button @click='toSaveAccount' type='success' v-if='setChannel == "0"'>保存</el-button>
                <el-button @click='isShowContent = false' type='text'>取消</el-button>
            </div>
        </el-dialog>
        <input style='visibility: hidden' type='file' id='ipt' @change='uploadTxt(2)'/>
    </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            currentList: [],
            accountList: [],
            hasChannelList: [],
            noChannelList: [],
            tableName: "channel",
            searchMsg: '',
            isShowContent: false,
            setChannel: '0',
            msgContent: {
                title: '',
                content: {
                    name: '',
                    pwd: '',
                    channelid: '0',
                    descs: ''
                }
            },
            chosedChannelId: '',
            pager: {
                pageNumber: 1,
                pageSize: 15,
                recordCount: 10
            },
            isAdd: true,
            chosedId: []
        }
    },
    computed: {
        ...mapState(['channelList'])
    },
    methods: {
        getData() {
            this.$api.Account.list(this.pager.pageNumber, res => {
                const data = res.pager
                if(data){
                    this.setAccountList(data.dataList)
                    this.pager = data.pager
                    this.$store.dispatch('getChannel')
                }
            })
        },
        setAccountList(data) {  //区别开已分配或未分配渠道
            // this.hasChannelList = []
            this.accountList = []
            this.noChannelList = []
            data.forEach((i) => {
                if(!i.channelcode){
                    i.channelcode = ''
                    i.channelid = ''
                    i.channelname = ''
                    this.noChannelList.push(i)
                    this.accountList.push(i)
                }
                else {
                    this.accountList.push(i)
                    // this.hasChannelList.push(i)
                }
            });
            if(this.tableName == 'channel') {
                // this.currentList = this.hasChannelList
                this.currentList = this.accountList
            }
            else {
                this.currentList = this.noChannelList
            }
        },
        changeTable(e) {
            this.tableName = e.name
            if(e.name == 'channel') {
                // this.currentList = this.hasChannelList
                this.currentList = this.accountList
            }
            else if(e.name == "nochannel") {
                this.currentList = this.noChannelList

            }
        },
        searchAccount() {
            if(!this.chosedChannelId && this.searchMsg) {
                this.searchMsg = ''
                this.getData()
                return
            }
            else if(!this.searchMsg && !this.chosedChannelId) {
                this.getData()
                return
            }
            else if(!this.chosedChannelId && this.searchMsg) {
                this.$message({
                    type: 'error',
                    message: '请选择搜索渠道！'
                })
                return
            }
            this.$api.Account.search(this.searchMsg, this.pager.pageNumber, this.chosedChannelId, res => {
                const data = res.pager
                if(data) {
                    this.setAccountList(data.dataList)
                    this.pager = data.pager
                }
            })
        },
        handleSelectionChange(val){
            this.chosedId = []
            val.forEach((i) => {
                this.chosedId.push(i.id)
            })
        },
        toShowDialog(type, item) {
            if(type == 2) {
                this.setChannel = '1'
                this.msgContent.content.channelid = ''
                if(item) {
                    this.chosedId = []
                    this.chosedId.push(item)
                }
            }
            else {
                this.isAdd = !type ? true : false
                this.msgContent.title = !type ? '新建帐号' : '编辑帐号'
                this.msgContent.content = !type ? {
                    accountname: '',
                    pwd: '',
                    channelid: ''
                } : item
            }
            this.isShowContent = true
        },
        toCancel() {
            this.isShowContent = false
            this.msgContent = {
                title: '',
                content: {
                    name: '',
                    pwd: '',
                    channelid: '',
                    descs: ''
                }
            }
            this.setChannel = '0'
            this.getData()
        },
        toSaveAccount() {
            if(!this.msgContent.content.name) {
                this.$message({
                    message: '帐号名字不能为空！',
                    type: 'error'
                })
                return
            }
            else if(!this.msgContent.content.pwd) {
                this.$message({
                    message: '帐号密码不能为空！',
                    type: 'error'
                })
                return
            }
            if(!this.isAdd) {
                this.$api.Account.edit(this.msgContent.content, res => {
                    if(res.Account) {
                        this.$message({
                            message: '帐号修改成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1
                    }        
                    this.isShowContent = false
                })
            }
            else {
                this.$api.Account.add(this.msgContent.content, res => {
                    if(res.account) {
                        this.$message({
                            message: '帐号创建成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1
                    }   
                    this.isShowContent = false   
                })
            }
            
        },
        toSaveChannel() {
            if(!this.msgContent.content.channelid) {
                this.$message({
                    message: '渠道不能为空！',
                    type: 'error'
                })
                return
            }
            this.$api.Account.editChannel(this.chosedId, this.msgContent.content.channelid, res => {
                const data = res.pager
                if(data) {
                    this.$message({
                        message: '渠道分配成功',
                        type: 'success'
                    })
                }
            })
            this.setChannel = '0'
            this.isShowContent = false
        },
        toDel(id) {
            this.$confirm('确定删除此帐号吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                this.$api.Account.delete(id, res => {
                    if(res) {
                        this.$message({
                            message: '帐号删除成功',
                            type: 'success'
                        }) 
                        this.pager.pageNumber = 1
                        this.msgContent.isShowContent = false
                        this.getData() 
                    }                    
                })
            }).catch((err) => {
                this.$message({
                    message: '删除失败',
                    type: 'error'
                })
            })
        },
        handlePage(e) {
            this.pager.pageNumber = e
            this.getData()
        },
        uploadTxt(num) {
            console.log('txt', num)
            let ipt = document.getElementById('ipt');
            if(num == 1) {
                ipt.click();
            }
            else if(num == 2) {
                let file = ipt.files
                let formD = new FormData()
                formD.append('file', file[0])
                console.log(file, formD)
                this.$api.Account.uploadTxt(formD, res => {
                    this.$message.success('导入成功~~~')
                    this.getData()
                })
            }
        }
    },
    created() {
        this.getData()
    }
}
</script>

<style lang="scss">
.search-content{
    margin: 10px;
    text-align: right;
    .el-input{
        width: 300px;
    }
}
</style>
<style>
.preIpt{
    width: 130px;
}
.input-with-select .el-input-group__prepend {
background-color: #fff;
}
</style>
