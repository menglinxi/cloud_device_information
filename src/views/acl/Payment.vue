<template>
  <div>
      <div class='top-content'>
          <el-input style='width: 450px;' placeholder="请根据字段名输入关键词进行搜索 ..." size='small' v-model='searchKey' @keyup.enter.native='getList'>
              <el-select v-model="select" slot="prepend" placeholder="请选择" style='width: 100px;'>
                <el-option label="订单号" value="1"></el-option>
                <el-option label="游戏名称" value="2"></el-option>
                </el-select>
              <el-button slot="append" icon="el-icon-search" @click='getList'></el-button>
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
                width='80'
                align="center">
                  <template slot-scope="scope">
                      <el-switch 
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        v-model='scope.row.code' 
                        @change='changeStatus(scope.row)'>
                      </el-switch>
                  </template>
              </el-table-column>
          </el-table>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            payList: [],
            colList: [
                {
                    prop: 'userid',
                    label: '用户id',
                    width: '80'
                },
                {
                    prop: 'orderid',
                    label: '订单号',
                    width: '160'
                },
                {
                    prop: 'pkg',
                    label: '游戏包名',
                    width: '150'
                },
                {
                    prop: 'money',
                    label: '支付金额',
                    width: '100'
                },
                {
                    prop: 'gamename',
                    label: '游戏名称',
                    width: ''
                },
                {
                    prop: 'gamecode',
                    label: '游戏代号',
                    width: '100'
                },
                {
                    prop: 'app_channel',
                    label: '游戏渠道码',
                    width: ''
                },
                {
                    prop: 'userchannel',
                    label: '用户渠道码',
                    width: ''
                },
                {
                    prop: 'createtime',
                    label: '创建时间',
                    width: '160'
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
    methods: {
        getList() {
            let orderid, gamename;
            if(this.select == '1') {
                orderid = this.searchKey
                gamename = ''
            }
            else {
                orderid = ''
                gamename = this.searchKey
            }
            this.$api.Payment.payList(this.pager.pageNumber, orderid, gamename, res => {
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
        }
    },
    created() {
        this.getList()
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