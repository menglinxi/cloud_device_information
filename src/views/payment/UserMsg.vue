<template>
  <div>
      <div class='top-banner'>
        <el-input placeholder="请输入搜索关键词..." clearable v-model="searchKey" style='width:800px;' size="small" @keyup.enter.native="getSearch">
          <el-select
            v-model='obj.companyid'
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
            v-model='obj.pchannelid'
            placeholder="父渠道"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable
            @change="getChannels('child')"
            :disabled="obj.companyid.length == 0">
            <el-option
              v-for="item in pChannelList"
              :key="item.id"
              :label="item.key"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model='obj.channelid'
            placeholder="子渠道"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable
            :disabled="obj.pchannelid.length == 0">
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
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
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
      <el-table
        :data='dataList'
        border
        v-loading='loading'>
        <el-table-column
          v-for='(item, index) in colList'
          :key='index'
          :prop='item.prop'
          :label='item.label'
          :width='item.width'
          align="center">
        </el-table-column>
        <el-table-column
          prop='status'
          label='用户状态'
          align='center'
          width='100'>
          <template slot-scope="scope">
            <el-tag size='small' type='success' v-if='!scope.row.isstop'>启用中</el-tag>
            <el-tag size='small' type='danger' v-if='scope.row.isstop'>已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label='操作'
          width='100'>
          <template slot-scope="scope">
            <el-button size='mini' type='success' plain v-if='scope.row.isstop' @click='userStatus(scope.row, 0)'>启用</el-button>
            <el-button size='mini' type='danger' plain v-if='!scope.row.isstop' @click='userStatus(scope.row, 1)'>停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style='text-align: center; margin-top: 10px;'
        v-if='pager.recordCount > 10'
        :current-page="pager.pageNumber"
        layout="prev, pager, next"
        :page-size="pager.pageSize"
        :total="pager.recordCount"
        @current-change='handlePage'>
      </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
      return{
        loading: false,
        searchTime: [],
        companyList: [],
        pChannelList: [],
        cChannelList: [],
        nameList: [
          {
            id: 1,
            name: '用户名'
          },
          {
            id: 2,
            name: '手机号码'
          }
        ],
        searchId: '',
        searchKey: '',
        dataList: [],
        colList: [
          {
            prop: 'id',
            label: 'ID',
            width: '60'
          },
          // {
          //   prop: 'accountid',
          //   label: '用户ID',
          //   width: '120'
          // },
          {
            prop: 'username',
            label: '用户名',
            width: ''
          },
          {
            prop: 'pwd',
            label: '密码',
            width: '160'
          },
          {
            prop: 'qq',
            label: 'QQ号码',
            width: '180'
          },
          {
            prop: 'wx',
            label: '微信号',
            width: '180'
          },
          {
            prop: 'mobile',
            label: '手机号',
            width: '180'
          },
          {
            prop: 'channelcode',
            label: '渠道码',
            width: '180'
          },
          {
            prop: 'createtime',
            label: '创建时间',
            width: '180'
          }
        ],
        obj: {
          page: 1,
          channelid: '',
          pchannelid: '',
          companyid: '',
          name: '',
          mobile: '',
          startTime: '',
          endTime: ''
        },
        pager: {
          pageCount: 1,
          pageNumber: 1,
          pageSize: 15,
          recordCount: 3
        }
      }
  },
  computed: {
    ...mapState(['channelstree'])
  },
  methods: {
    getData() {
      // 后端获取公司名称列表
      this.$api.UserMsg.company(res => {
        this.companyList = res.codes
          const obj = {
            page: this.pager.pageNumber,
            channelid: 0,
            pchannelid: 0,
            companyid: 0,
            name: '',
            mobile: ''
          }
        this.getList(obj)
      })
    },
    getChannels(name) {
      // 后端获取渠道信息
      // if(name == 'parent') {
      //   if(this.obj.companyid == '') {
      //     this.obj.channelid = ''
      //     this.obj.pchannelid = ''
      //     return
      //   }
      //   let id = this.obj.companyid
      //   this.$api.UserMsg.channelOfCompany(id, res => {
      //     this.pChannelList = res.pager
      //   })
      // }
      // else if(name == 'child') {
      //   if(this.obj.pchannelid == '') {
      //     this.obj.channelid = ''
      //     return
      //   }
      //   let type = this.obj.pchannelid
      //   this.$api.UserMsg.subOfChannel(type, res => {
      //     this.cChannelList = res.pager
      //   })
      // }
      if(name == 'parent') {
        if(this.obj.companyid == '') {
          this.obj.channelid = ''
          this.obj.pchannelid = ''
          return
        }
        this.channelstree.forEach((i) => {
          if(i.id == this.obj.companyid) {
            this.pChannelList = i.child
          }
        })
      }
      else if(name == 'child') {
        if(this.obj.pchannelid == '') {
          this.obj.channelid = ''
          return
        }
        this.pChannelList.forEach((i) => {
          if(i.id == this.obj.pchannelid) {
            this.cChannelList = i.child
          }
        })
      }
    },
    getList(obj) {
      this.loading = true
      this.$api.UserMsg.list(obj, res => {
        this.dataList = res.account.dataList
        this.pager = res.account.pager
        this.loading = false
      })
    },
    getSearch(num) {
      let obj = {
            page: this.obj.page,
            companyid: this.obj.companyid,
            pchannelid: this.obj.pchannelid,
            channelid: this.obj.channelid,
            name: this.obj.name,
            mobile: this.obj.mobile,
            startTime: this.obj.startTime,
            endTime: this.obj.endTime
        }
      if(this.obj.companyid != '') {
        if(this.obj.pchannelid == '') {
          this.$message.error('请选择父渠道！')
          return
        }
      }
      // if(this.obj.companyid == '' && this.searchId == '') {
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
                  case 1:
                      obj.name = this.searchKey;
                      obj.mobile = '';
                      break;
                  case 2:
                      obj.mobile = this.searchKey;
                      obj.name = '';
                      break;
              }
          }
      }
      else {
          obj.name = '';
          obj.mobile = '';
      }
      obj.companyid = this.obj.companyid == '' ? 0 : this.obj.companyid
      obj.pchannelid = this.obj.pchannelid == '' ? 0 : this.obj.pchannelid
      obj.channelid = this.obj.channelid == '' ? 0 : this.obj.channelid
      obj.page = !num ? 1 : this.pager.pageNumber
      this.getList(obj)
    },
    handlePage(e) {
      this.pager.pageNumber = e
      if(this.searchTime.length != 0 ||  this.obj.companyid != '' || this.obj.pchannelid != '' || this.obj.searchId != '' || this.obj.searchKey != '') {
        this.getSearch(1)
      }
      else {
        const obj = {
          page: e,
          channelid: 0,
          pchannelid: 0,
          companyid: 0,
          name: '',
          mobile: '',
          startTime: '',
          endTime: ''
        }
        this.getList(obj)
      }
    },
    userStatus(item, num) {
      let text = ''
      switch(num) {
        case 0:
          text= '确定停用' + item.username + '用户？';
          break;
        case 1:
          text= '确定启用' + item.username + '用户？';
          break;
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$api.UserMsg.changeStatus(item.id, num, res => {
          if(res) {
            this.$message.success('状态修改成功')
          }
          else {
            this.$message.errror('状态修改失败')
          }
          this.getList(this.obj)
        })
      }).catch(() => {
        this.$message.info('已取消修改~')
      })
    },
    timeChange(e) {
      if(e == null) {
        this.obj.startTime = ''
        this.obj.endTime = ''
        return
      }
      this.obj.startTime = e[0]
      this.obj.endTime = e[1]
    }
  },
  created() {
    // this.getData()
    const obj = {
        page: 1,
        channelid: 0,
        pchannelid: 0,
        companyid: 0,
        name: '',
        mobile: '',
        startTime: '',
        endTime: ''
      }
    this.getList(obj)
  }
}
</script>

<style lang="scss" scoped>
.top-banner{
  display: flex;
  flex-direction: row-reverse;
  padding: 10px 0;
  margin: 10px 0;
}
</style>
