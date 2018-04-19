<template>
    <section>
        <el-row>
            <el-col :span='6'>
                <el-button @click='toShowDialog(0)' type='success' size='medium'><i class='el-icon-plus'></i>新建渠道</el-button>
            </el-col>
            <el-col :offset='12' :span='6'>
                <el-input v-model='searchMsg' placeholder="渠道名称搜索" size='medium' clearable @keyup.native.enter='searchChannel' @clear='getData'>
                    <el-button slot='append' @click='searchChannel'><i class='el-icon-search'></i></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data='currentList'
            ref="multipleTable"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
            prop="id"
            align="center"
            label="ID"
            width="60">
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="渠道名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="code"
            align="center"
            label="渠道码"
            show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column
            prop="status"
            align="center"
            label="状态">
                <template slot-scope='scope'>
                    <el-tag type="success" v-if='!scope.row.status'>可用</el-tag>
                    <el-tag type="warning" v-if='scope.row.status == "1"'>审核中</el-tag>
                    <el-tag type="danger" v-if='scope.row.status == "2"'>不可用</el-tag>
                </template>
            </el-table-column> -->
            <el-table-column
            prop="linkman"
            align="center"
            label="说明"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='操作' width='250' align="center">
                <template slot-scope='scope'>
                    <el-button @click='toShowDialog(1, scope.row)' size='mini' type='success'>编辑</el-button>
                    <el-button @click='toDel(scope.row.id)' size='mini' type='danger' plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if='pager.recordCount > 10' 
            :total="pager.recordCount"
            :page-size="pager.pageSize" 
            :current-page="pager.pageNumber" 
            layout="prev, pager, next" 
            @current-change='handlePage'>
        </el-pagination>
        <el-dialog :title='msgContent.title' :visible.sync="isShowContent" width='500px' @close='toCancel'>
            <el-form ref='form' label-width='100px'>
                <el-form-item label='渠道名称'>
                    <el-input v-model='msgContent.content.name' placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label='渠道码'>
                    <el-input v-model='msgContent.content.code' placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label='说明'>
                    <el-input v-model='msgContent.content.linkman' type='textarea' placeholder="非必填"></el-input>
                </el-form-item>
            </el-form>
            <div slot='footer'>
                <el-button @click='toSaveChannel' type='success'>保存</el-button>
                <el-button @click='isShowContent = false' type='text'>取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
export default {
    data() {
        return {
            currentList: [],
            searchMsg: '',
            isShowContent: false,
            msgContent: {
                title: '',
                content: {
                    name: '',
                    code: '',
                    linkman: ''
                }
            },
            pager: {
                pageNumber: 1,
                pageSize: 15,
                recordCount: 10
            },
            isAdd: true
        }
    },
    methods: {
        getData() {
            this.$api.Channel.list(this.pager.pageNumber, res => {
                const data = res.pager
                if(data){
                    this.currentList = data.dataList
                    this.pager = data.pager
                }
            })
        },
        searchChannel() {
            if(!this.searchMsg) {
                this.getData()
                return
            }
            this.$api.Channel.search(this.searchMsg, this.pager.pageNumber, res => {
                const data = res.pager
                if(data) {
                    this.currentList = data.dataList
                    this.pager = data.pager
                }
            })
        },
        toShowDialog(type, item) {
            this.isAdd = !type ? true : false
            this.msgContent.title = !type ? '新建渠道' : '编辑渠道'
            this.msgContent.content = !type ? {
                name: '',
                code: '',
                linkman: ''
            } : item
            this.isShowContent = true
        },
        toCancel() {
            this.isShowContent = false
            this.msgContent = {
                title: '',
                content: {
                    name: '',
                    code: '',
                    linkman: ''
                }
            }
            this.getData()
        },
        toSaveChannel() {
            if(!this.msgContent.content.name) {
                this.$message({
                    message: '渠道名称不能为空！',
                    type: 'error'
                })
                return
            }
            if(!this.isAdd) {
                this.$api.Channel.edit(this.msgContent.content, res => {
                    if(res.channel) {
                        this.$message({
                            message: '渠道修改成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1
                    }        
                    this.isShowContent = false
                })
            }
            else {
                this.$api.Channel.add(this.msgContent.content, res => {
                    if(res.channel) {
                        this.$message({
                            message: '渠道创建成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1
                    }   
                    this.isShowContent = false   
                })
            }
            
        },
        toDel(id) {
            this.$confirm('确定删除此渠道吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                this.$api.Channel.delete(id, res => {
                    if(res) {
                        this.$message({
                            message: '渠道删除成功',
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
