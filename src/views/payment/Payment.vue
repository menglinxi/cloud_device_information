<template>
  <div>
      <div class='top-content'>
          <el-input placeholder="请输入搜索关键词..." clearable v-model="searchKey" style='width:800px;' size="small" @keyup.enter.native="getSearch">
          <el-select
            v-model='obj.companyId'
            placeholder="公司名"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable
            @change="getChannels('parent')">
            <el-option
              v-for="item in channelstree"
              :key="item.id"
              :label="item.key"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model='obj.pChannelId'
            placeholder="父渠道"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable
            @change="getChannels('child')"
            :disabled="obj.companyId.length == 0">
            <el-option
              v-for="item in pChannelList"
              :key="item.id"
              :label="item.key"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model='obj.cChannelId'
            placeholder="子渠道"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable
            :disabled="obj.pChannelId.length == 0">
            <el-option
              v-for="item in cChannelList"
              :key="item.id"
              :label="item.key"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model='searchId'
            placeholder="字段名"
            style='width: 100px;'
            slot='prepend'
            clearable>
            <el-option label="订单号" value="1"></el-option>
            <el-option label="游戏名称" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click='getSearch'></el-button>
        </el-input>
      </div>
      <div>
          <el-table
            :data='payList'
            border>
              <el-table-column
                v-for='(item, index) in colList'
                :key='index'
                :width='item.width'
                :prop='item.prop'
                :label='item.label'
                align="center">
              </el-table-column>
              <el-table-column
                prop='status'
                label='支付状态'
                width='100'
                align="center">
                  <template slot-scope="scope">
                      <el-tag type='success' size='small' v-if='scope.row.status == 1'>支付成功</el-tag>
                      <el-tag type='danger' size='small' v-if='scope.row.status == 0'>支付失败</el-tag>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination
            v-if='pager.pageCount > 10'
            :current-page="pager.pageNumber"
            layout="prev, pager, next"
            :total="pager.pageCount"
            @current-change='handlePage'>
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            companyList: [],
            pChannelList: [],
            cChannelList: [],
            obj: {
                companyId: '',
                pChannelId: '',
                cChannelId: '',
                gamename: '',
                orderid: '' 
            },
            searchId: '',
            payList: [],
            colList: [
                {
                    prop: 'userid',
                    label: '用户id',
                    width: '70'
                },
                {
                    prop: 'orderid',
                    label: '订单号',
                    width: ''
                },
                {
                    prop: 'gamecode',
                    label: '游戏代号',
                    width: '100'
                },
                {
                    prop: 'pkg',
                    label: '游戏包名',
                    width: ''
                },
                {
                    prop: 'gamename',
                    label: '游戏名称',
                    width: '140'
                },
                {
                    prop: 'app_channel',
                    label: '游戏渠道码',
                    width: '160'
                },
                {
                    prop: 'userchannel',
                    label: '用户渠道码',
                    width: '160'
                },
                {
                    prop: 'createtime',
                    label: '创建时间',
                    width: '160'
                },
                {
                    prop: 'money',
                    label: '支付金额',
                    width: '80'
                }
            ],
            select: '1',
            searchKey: '',
            pager: {
                pageCount: 1,
                pageNumber:1,
                pageSize: 15,
                recordCount: 1
            }
        }
    },
    computed: {
        ...mapState(['channelstree'])
    },
    methods: {
        getList(obj) {
            this.$api.Payment.payList(obj, res => {
                this.payList = res.pager.dataList.map((i) => {
                    i.code = i.status == '1' ? true : false
                    return i
                })
                this.pager = res.pager.pager
            })
        },
        changeStatus(item) {
            const id = item.orderid
            const status = item.status
            this.$api.Payment.payStatus(id, status, res => {
                this.$message.success('支付状态修改成功！')
            })
        },
        getData() {
            // 后端获取公司名称列表
            this.$api.UserMsg.company(res => {
                this.companyList = res.codes
                const obj = {
                    page: 1,
                    companyId: 0,
                    pChannelId: 0,
                    cChannelId: 0,
                    gamename: '',
                    orderid: '' 
                }
                this.getList(obj)
            })
        },
        getChannels(name) {
            // 后端获取渠道信息
            if(name == 'parent') {
              if(this.obj.companyId == '') {
                this.obj.pChannelId = ''
                this.obj.cChannelId = ''
                return
              }
              this.channelstree.forEach((i) => {
                    if(i.id == this.obj.companyId) {
                        this.pChannelList = i.child
                    }
                })
            //   let id = this.obj.companyId
            //   this.$api.UserMsg.channelOfCompany(id, res => {
            //     this.pChannelList = res.pager
            //   })
            }
            else if(name == 'child') {
              if(this.obj.pChannelId == '') {
                this.obj.cChannelId = ''
                return
              }
              this.pChannelList.forEach((i) => {
                    if(i.id == this.obj.pChannelId) {
                        this.cChannelList = i.child
                    }
                })
            //   let type = this.obj.pChannelId
            //   this.$api.UserMsg.subOfChannel(type, res => {
            //     this.cChannelList = res.pager
            //   })
            }
        },
        getSearch() {
            if(this.obj.companyId == '' && this.obj.pChannelId == '' && this.obj.cChannelId == '' && this.searchId == '' && this.searchKey == '') {
                const objn = {
                    page: 1,
                    companyId: 0,
                    pChannelId: 0,
                    cChannelId: 0,
                    gamename: '',
                    orderid: '' 
                }
                this.getList(objn)
                return
            }
            let obj = this.obj
            if(this.obj.companyId == '') {
                this.$message.error('请选择公司名称！')
                return
            }
            if(this.obj.pChannelId == '') {
                this.$message.error('请选择父渠道名称！')
                return
            }
            // if(this.searchId == '') {
            //     this.$message.error('请选择字段名！')
            //     return
            // }
            // else {
            //     if(this.searchKey == '') {
            //         this.$message.error('请输入搜索的关键词！')
            //         return
            //     }
            //     if(this.searchId == '1') {
            //         obj.orderid = this.searchKey
            //         obj.gamename = ''
            //     }
            //     else if(this.searchId == '2'){
            //         obj.gamename = this.searchKey
            //         obj.orderid = ''
            //     }
            // }
            if(this.obj.cChannelId == '') {
                obj.cChannelId = 0
            }
            this.getList(obj)
        },
        handlePage(e) {
            this.obj.page = e
            if(this.obj.companyId != '' || this.obj.pChannelId != '' || this.searchId != '' || this.searchKey != '') {
                this.getSearch()
            }
            else {
                const obj = {
                    page: e,
                    companyId: 0,
                    pChannelId: 0,
                    cChannelId: 0,
                    gamename: '',
                    orderid: '' 
                }
                this.getList(obj)
            }
        }
    },
    created() {
        // this.getData()
        const obj = {
            page: 1,
            companyId: 0,
            pChannelId: 0,
            cChannelId: 0,
            gamename: '',
            orderid: '' 
        }
        this.getList(obj)
    }
}
</script>

<style lang="scss" scoped>
.top-content{
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 20px;
}
</style>