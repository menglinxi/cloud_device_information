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
      </div>
      <el-table
        :data='dataList'
        border>
        <el-table-column
          v-for='(item, index) in colList'
          :key='index'
          :prop='item.prop'
          :label='item.label'
          :width='item.width'
          align="center">
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
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
      return{
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
          {
            prop: 'accountid',
            label: '用户ID',
            width: '120'
          },
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
          moblie: ''
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
            page: 1,
            channelid: 0,
            pchannelid: 0,
            companyid: 0,
            name: '',
            moblie: ''
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
        this.channelstree.forEach((i) => {
          if(i.id == this.obj.companyid) {
            this.pChannelList = i.child
          }
        })
      }
      else if(name == 'child') {
        this.pChannelList.forEach((i) => {
          if(i.id == this.obj.pchannelid) {
            this.cChannelList = i.child
          }
        })
      }
    },
    getList(obj) {
      this.$api.UserMsg.list(obj, res => {
        this.dataList = res.account.dataList
        this.pager = res.account.pager
      })
    },
    getSearch() {
      if(this.obj.companyid == '' && this.obj.pchannelid == '' && this.obj.channelid == '' && this.searchId == '' && this.searchKey == '') {
          const objn = {
              page: 1,
              companyid: 0,
              pchannelid: 0,
              channelid: 0,
              gamename: '',
              orderid: '' 
          }
          this.getList(objn)
          return
      }
      let obj = this.obj
      if(this.obj.companyid == '') {
        this.$message.error('请选择搜索的公司名')
        return
      }
      if(this.obj.pchannelid == '') {
        this.$message.error('请选择搜索的父渠道名')
        return
      }
      // if(this.searchId == '') {
      //   this.$message.error('请选择搜索的字段名')
      //   return
      // }
      // if(this.searchKey == '') {
      //   this.$message.error('请输入搜索的关键词')
      //   return
      // }
      // if(this.searchId == 1) {
      //   obj.name = this.searchKey
      //   obj.moblie = ''
      // }
      // else if(this.searchId == 2) {
      //   obj.moblie = this.searchKey
      //   obj.name = ''
      // }
      if(obj.channelid == '') {
        obj.channelid = 0
      }
      this.getList(obj)
    },
    handlePage(e) {
      this.pager.pageNumber = e
      if(this.obj.companyid == '' || this.obj.pchannelid == '' || this.obj.searchId == '' || this.obj.searchKey == '') {
        this.getSearch()
      }
      else {
        const obj = {
          page: e,
          channelid: 0,
          pchannelid: 0,
          companyid: 0,
          name: '',
          moblie: ''
        }
        this.getList(obj)
      }
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
        moblie: ''
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
