<template>
    <section>
        <el-row>
            <el-col :span='6'>
                <el-button @click="toShowDialog('0')" type='success' size='medium'><i class='el-icon-plus'></i>新建渠道</el-button>
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
            <el-table-column
            prop="pname"
            align="center"
            label="所属父渠道"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="companyname"
            align="center"
            label="所属公司"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='操作' width='250' align="center">
                <template slot-scope='scope'>
                    <el-dropdown @command='toShowDialog' trigger="click">
                        <el-button type='success' size='mini' @click="getRow(scope.row)">
                            <i class="el-icon-setting"></i>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="3">编辑</el-dropdown-item>
                            <el-dropdown-item command="1" v-if="ishow">新增子菜单</el-dropdown-item>
                            <el-dropdown-item command="2">删除</el-dropdown-item>
                        </el-dropdown-menu>
                     </el-dropdown>
                     
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
                <el-form-item label='设置顶级'>
                    <el-input v-model='msgContent.content.pname' :disabled="disabled" placeholder="为空默认为父级"></el-input>
                </el-form-item>
                <el-form-item label='渠道名称'>
                    <el-input v-model='msgContent.content.name' placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label='所属公司' v-if="ishow0">
                    <el-input v-model='msgContent.content.companyname' placeholder="所属公司" :disabled="disabled"></el-input>
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
            companyList:[],
            ishow:false,
            ishow0:true,
            disabled:true,
            data:[],
            defaultProps: {
                label: "name",
                id: "id"
            },
            Rowdata:{},
            currentList: [],
            searchMsg: '',
            isShowContent: false,
            msgContent: {
                title: '',
                content: {
                    name: '',
                    code: '',
                    linkman: '',
                    pname:'',
                    companyid:''
                }
            },
            pager: {
                pageNumber: 1,
                pageSize: 15,
                recordCount: 10
            },
            isAdd: '0',
            pnameList: {}
        }
    },
    methods: {
         handleNodeClick(data) {
        },
        getRow(rowdata){
            this.Rowdata=rowdata
            if(rowdata.pid==0){
                this.ishow=true
            }else{
                this.ishow=false
            }
        },
        
        toShowDialog(type){
            if(type=='0'){
                //新建渠道
                this.ishow0=false
                this.isShowContent = true
                this.msgContent.title = '新建渠道'
                this.isAdd='0'
            }else if(type=='1'&&this.Rowdata.pid==0){
                //創建子菜單
                this.isShowContent = true
                this.msgContent.content.pname=this.Rowdata.name
                this.isAdd='1'
                 this.msgContent.title = '新建子渠道'
                 
            }else if(type=='2'){
                //刪除
                this.isAdd='2'
                this.$confirm('确定删除此渠道吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消'
                    }).then(() => {
                        this.$api.Channel.delete(this.Rowdata.id, res => {
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
                        this.isShowContent = false
                    }).catch((err) => {
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        })
                    })
                
            }
            else if(type=='3'){
                //編輯  
                this.ishow=true
                this.isShowContent = true
                this.isAdd='3'
                 this.msgContent.title = '編輯'
                this.msgContent.content=Object.assign({},this.Rowdata)
               
            }
        },
        getData() {
            this.$api.Channel.list(this.pager.pageNumber, res => {
                const data = res.pager
                if(data){
                    this.currentList = data.dataList.map((i) => {
                        let pname = this.pnameList[Number(i.pid)]
                        let companyname=this.companyList[Number(i.companyid)]
                        if(pname) {
                            i.pname = pname
                        }
                        else {
                            i.pname = ' '
                        }
                        if(companyname) {
                            i.companyname = companyname
                        }
                        else {
                            i.companyname = ' '
                        }
                        return i
                    })
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
            console.log(this.isAdd)
            if(!this.msgContent.content.name) {
                this.$message({
                    message: '渠道名称不能为空！',
                    type: 'error'
                })
                return
            }
            if(this.isAdd=='3') {
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
            else if(this.isAdd=='0'){
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
            }else if(this.isAdd=='1'){             
                this.$api.Channel.addchild(this.Rowdata.id,this.msgContent.content, res => {
                    if(res.channel) {
                        this.$message({
                            message: '子渠道创建成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1                     
                    }
                    this.isShowContent = false   
                })
   
            }
            
        },
       getAllData(){
           let type = 0
           this.$api.Channel.allList(type,res => {
                const data = res.pager         
                if(data){
                    this.pnameList = {}
                    data.forEach((i) => {
                        this.pnameList[i.id] = i.name
                        
                    })

                }
            })
            this.getcompanylist()
       },
       getcompanylist(){
           this.$api.Channel.companylist(res => {
                const data = res.codes         
                if(data){                 
                    data.forEach((i) => {
                        this.companyList[i.id] = i.value           
                    })
                    
                }
            })
          
       },
        handlePage(e) {
            this.pager.pageNumber = e
            this.getData()
        }
    },
    created() {
        this.getData()
        this.getAllData()
        
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
