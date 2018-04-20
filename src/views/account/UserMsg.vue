<template>
  <div>
      <div class='top-banner'>
        <el-input placeholder="请输入搜索关键词..." clearable v-model="searchKey" style='width:800px;' size="small" @keyup.enter.native="getSearch">
          <el-select
            v-model='obj.companyid'
            placeholder="公司名"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model='obj.pchannelid'
            placeholder="父渠道"
            style='width: 140px; margin-right: 20px;'
            slot='prepend'
            clearable
            @change="getChannels('child')">
            <el-option
              v-for="item in pChannelList"
              :key="item.id"
              :label="item.name"
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
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select
            v-model='searchName'
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
        searchName: '',
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
  methods: {
    getData() {
      this.getCompany()
      this.getChannels('parent')
    },
    getCompany() {
      this.$api.UserMsg.company(res => {
        this.companyList = res.codes
      })
    },
    getChannels(name) {
      let type = 0
      if(name == 'child') {
        if(this.obj.pchannelid == '') {
          this.obj.channelid = ''
          return
        }
        type = this.obj.pchannelid
      }
      this.$api.UserMsg.channels(type, res => {
        if(name == 'parent') {
          this.pChannelList = res.pager
          let obj = this.obj
          if(type == 0) {
            obj = {
              channelid: 0,
              pchannelid: 0,
              companyid: 0,
              name: '',
              moblie: '',
              page: 1
            }
          }
          this.getList(obj)
        }
        else if(name == 'child') {
          this.cChannelList = res.pager
        }
      })
    },
    getList(obj) {
      this.$api.UserMsg.list(obj, res => {
        this.dataList = res.account.dataList
        this.pager = res.account.pager
      })
    },
    getSearch() {
      if(this.obj.companyid == '') {
        this.$message.error('请选择搜索的公司名')
        return
      }
      if(this.obj.pchannelid == '') {
        this.$message.error('请选择搜索的父渠道名')
        return
      }
      if(this.obj.channelid == '') {
        this.$message.error('请选择搜索的子渠道名')
        return
      }
      console.log(this.searchName)
      if(this.searchName == '') {
        this.$message.error('请选择搜索的字段名')
        return
      }
      if(this.searchKey == '') {
        this.$message.error('请输入搜索的关键词')
        return
      }
      if(this.searchName == 1) {
        this.obj.name = this.searchKey
        this.obj.moblie = ''
      }
      else if(this.searchName == 2) {
        this.obj.moblie = this.searchKey
        this.obj.name = ''
      }
      this.getList(this.obj)
    },
    handlePage(e) {
      this.pager.pageNumber = e
      let obj = {}
      if(this.obj.channelid == '' && this.obj.pchannelid == '' && this.obj.companyid == '' && this.obj.searchName == '' && this.obj.searchKey == '') {
        obj = {
          channelid: 0,
          pchannelid: 0,
          companyid: 0,
          name: '',
          moblie: '',
          page: e
        }
      }
      else {
        if(this.obj.companyid == '') {
        this.$message.error('请选择搜索的公司名')
        return
        }
        else if(this.obj.pchannelid == '') {
          this.$message.error('请选择搜索的父渠道名')
          return
        }
        else if(this.obj.channelid == '') {
          this.$message.error('请选择搜索的子渠道名')
          return
        }
        else if(this.searchName == '') {
          this.$message.error('请选择搜索的字段名')
          return
        }
        else if(this.searchKey == '') {
          this.$message.error('请输入搜索的关键词')
          return
        }
        else {
          obj = this.obj
        }
      }
      this.getList(obj)
    }
  },
  created() {
    this.getData()
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
