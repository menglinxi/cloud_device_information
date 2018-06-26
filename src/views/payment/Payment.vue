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
        <el-date-picker
            v-model="searchTime"
            size='small'
            type="daterange"
            value-format="yyyy-MM-dd"
            @change='timeChange'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div>
          <el-table
            :data='payList'
            border
            v-loading='loading'>
              <el-table-column
                prop='userid'
                label='用户ID'
                align='center'
                width='80'>
                <template slot-scope="scope">
                  <div>
                  {{scope.row.userid}}
                  <el-popover
                      placement="right"
                      :width="popWid"
                      trigger="click">
                      <div>
                        <div style='text-align:center' v-if='!msgObj.username && !msgObj.email && !msgObj.virtualdevice && !msgObj.truedevice'>
                          暂无信息
                        </div>
                        <div v-if='msgObj.username || msgObj.email'>
                            <p class='title-bg'>基本信息</p>
                            <div class='line' v-for='(val, key, index) in msgObj' :key='index'>
                            <div class='line-name' v-if='key == "username" || key == "email"'>
                                {{key}}
                            </div>
                            <div class='line-val' v-if='key == "username" || key == "email"'>
                                {{val}}
                            </div>
                            </div>
                        </div>
                        <div v-if='msgObj.virtualdevice || msgObj.truedevice'>
                            <p class='title-bg'>设备信息</p>
                            <div class='main-msg'>
                            <div class='con' :class='[propNum == 2 ? "half-width" : "full-width"]' v-if='msgObj.virtualdevice'>
                                <p>虚拟设备信息</p>
                                <div class='line-con'>
                                <div class='line' v-for='(val, key, index) in msgObj.virtualdevice' :key='index'>
                                    <div class='line-name'>
                                    {{key}}
                                    </div>
                                    <div class='line-val'>
                                    {{val}}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div class='con' :class='[propNum == 2 ? "half-width" : "full-width"]' v-if='msgObj.truedevice'>
                                <p>真实设备信息</p>
                                <div>
                                <div class='line' v-for='(val, key, index) in msgObj.truedevice' :key='index'>
                                    <div class='line-name'>
                                    {{key}}
                                    </div>
                                    <div class='line-val'>
                                    {{val}}
                                    </div>
                                </div>
                                </div>
                            </div>                   
                            </div>
                        </div>
                      </div>
                      <i class='el-icon-info' style='color:#87CEFA; cursor: pointer;' slot="reference" @click='getUserMsg(scope.row.userid)'></i>
                  </el-popover>
                  </div>
                </template>
              </el-table-column>
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
                      <el-tag type='success' size='small' v-if='scope.row.status'>支付成功</el-tag>
                      <el-tag type='danger' size='small' v-if='!scope.row.status'>支付失败</el-tag>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination
            style='text-align: center; margin-top: 10px;'
            v-if='pager.recordCount > 15'
            :current-page="pager.pageNumber"
            layout="prev, pager, next"
            :page-size="pager.pageSize"
            :total="pager.recordCount"
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
            loading: false,
            searchTime: [],
            companyList: [],
            pChannelList: [],
            cChannelList: [],
            obj: {
                companyId: '',
                pChannelId: '',
                cChannelId: '',
                gamename: '',
                orderid: '',
                startTime: '',
                endTime: '',
                page: 1
            },
            searchId: '',
            payList: [],
            colList: [
                // {
                //     prop: 'userid',
                //     label: '用户id',
                //     width: '70'
                // },
                {
                    prop: 'orderid',
                    label: '订单号',
                    width: ''
                },
                {
                    prop: 'gamecode',
                    label: '游戏代号',
                    width: ''
                },
                {
                    prop: 'pkg',
                    label: '游戏包名',
                    width: ''
                },
                {
                    prop: 'gamename',
                    label: '游戏名称',
                    width: ''
                },
                {
                    prop: 'app_channel',
                    label: '游戏渠道',
                    width: ''
                },
                {
                    prop: 'channelName',
                    label: '用户渠道',
                    width: ''
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
                pageNumber: 1,
                pageCount: 1,
                pageSize: 15,
                recordCount: 1
            },
            msgObj: {
              name: 'aaa',
              game: '2222',
              bbb: '4444'
            },
            propNum: 0,
            popWid: 400,
            infoLoading: true
        }
    },
    computed: {
        ...mapState(['channelstree', 'channelList'])
    },
    watch: {
      propNum(val) {
        if(val == 2) {
          this.popWid = 800
        }
        else {
          this.popWid = 400
        }
      }
    },
    methods: {
      getList(obj) {
          this.loading = true
          this.$api.Payment.payList(obj, res => {
              let cobj = {}
              this.channelList.forEach((e) => {
                  cobj[e.id] = e.name
              })
              console.log('tee', this.channelList)
              console.log('obj', cobj)
              this.payList = res.pager.dataList.map((i) => {
                  i.status = i.status == 1 ? true : false
                  i.channelName = cobj[i.userchannelid]
                  return i
              })
              this.pager = res.pager.pager
              this.loading = false
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
                  orderid: '',
                  startTime: '',
                  endTime: ''
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
      getSearch(num) {
          // if(this.obj.companyId == '' && this.obj.pChannelId == '' && this.obj.cChannelId == '' && this.searchId == '' && this.searchKey == '') {
          //     if(this.searchTime.length != 0) {
          //         const objn = {
          //             page: !num ? 1 : this.obj.page,
          //             companyId: 0,
          //             pChannelId: 0,
          //             cChannelId: 0,
          //             gamename: '',
          //             orderid: '',
          //             startTime: this.searchTime[0],
          //             endTime: this.searchTime[1]
          //         }
          //         this.getList(objn)
          //         return
          //     }
          //     else {
          //         const objn = {
          //             page: 1,
          //             companyId: 0,
          //             pChannelId: 0,
          //             cChannelId: 0,
          //             gamename: '',
          //             orderid: '',
          //             startTime: '',
          //             endTime: ''
          //         }
          //         this.getList(objn)
          //         return
          //     }
          // }
          let obj = {
              page: this.obj.page,
              companyId: this.obj.companyId,
              pChannelId: this.obj.pChannelId,
              cChannelId: this.obj.cChannelId,
              gamename: this.obj.gamename,
              orderid: this.obj.orderid,
              startTime: this.obj.startTime,
              endTime: this.obj.endTime
          }
          // if(this.obj.companyId == '' && this.searchId == '') {
          //     this.$message.error('请选择查询内容')
          //     return
          // }
          if(this.searchId != '') {
              if(this.searchKey == '') {
                  this.$message.error('请填写搜索内容~~~')
                  return
              }
              else {
                  switch(this.searchId) {
                      case '1':
                          obj.orderid = this.searchKey;
                          obj.gamename = '';
                          break;
                      case '2':
                          obj.gamename = this.searchKey;
                          obj.orderid = '';
                          break;
                  }
              }
          }
          else {
              obj.orderid = '';
              obj.gamename = '';
          }
          obj.companyId = this.obj.companyId == '' ? 0 : this.obj.companyId
          obj.pChannelId = this.obj.pChannelId == '' ? 0 : this.obj.pChannelId
          obj.cChannelId = this.obj.cChannelId == '' ? 0 : this.obj.cChannelId
          obj.page = !num ? 1 : this.pager.pageNumber
          this.getList(obj)
      },
      handlePage(e) {
          this.obj.page = e
          if(this.obj.companyId != '' || this.obj.pChannelId != '' || this.searchId != '' || this.searchKey != '' || this.searchTime.length != 0) {
              this.getSearch(1)
          }
          else {
              const obj = {
                  page: e,
                  companyId: 0,
                  pChannelId: 0,
                  cChannelId: 0,
                  gamename: '',
                  orderid: '',
                  startTime: '',
                  endTime: ''
              }
              this.getList(obj)
          }
      },
      timeChange(e) {
          if(e == null) {
              this.obj.startTime = ''
              this.obj.endTime = ''
              return
          }
          this.obj.startTime = e[0]
          this.obj.endTime = e[1]
      },
      getUserMsg(id) {
        this.infoLoading = true
        this.$api.UserMsg.userInfo(id, res => {
          this.msgObj = res.userinfo
          this.propNum = 0
          if(res.userinfo.hasOwnProperty('virtualdevice')) {
            this.propNum ++
          }
          if(res.userinfo.hasOwnProperty('truedevice')) {
            this.propNum ++
          }
          this.infoLoading = false
        })
      }
    },
    created() {
        const obj = {
            page: 1,
            companyId: 0,
            pChannelId: 0,
            cChannelId: 0,
            gamename: '',
            orderid: '',
            startTime: '',
            endTime: ''
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
.title-bg{
  background-color: #eee;
  text-align: center;
  margin: 5px 0;
}
.line{
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  word-wrap:break-word;
  .line-name{
    text-align: left;
    width: 30%;
  }
  .line-val{
      text-align: right;
      width: 65%;
  }
}
.main-msg{
  display: flex;
  justify-content: center;
  .con{
    padding: 0 10px;
    border-left: 1px solid rgb(228, 228, 228);
    border-right: 1px solid rgb(228, 228, 228); 
    p{
      margin: 0;
      text-align: center;
      border-bottom: 1px rgb(228, 228, 228) solid;
    }
  }
}
.full-width{
  width: 100%;
}
.half-width{
  width: 50%;
}
</style>