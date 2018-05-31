<template>
    <div>
        <div class='top-banner'>
            <el-button size='small' type='success' plain @click='addData'>添加数据</el-button>
            <el-date-picker
                v-model="timeRange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change='handleDate'>
            </el-date-picker>
        </div>
        <el-table
            :data='dataList'
            width='100%'>
            <el-table-column prop='dates' label='日期' align='center'></el-table-column>
            <el-table-column prop='newusers' label='新增用户' align='center'></el-table-column>
            <el-table-column prop='money' label='总消费' align='center'></el-table-column>
            <el-table-column prop='channelName' label='渠道名' align='center'></el-table-column>
            <el-table-column prop='edit' label='操作' align='center'>
                <template slot-scope="scope">
                    <el-button @click='editData(scope.row)' size='mini' type='warning' icon='el-icon-edit'></el-button>
                    <el-button @click='delData(scope.row)' size='mini' type='danger' icon='el-icon-delete'></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if='pager.recordCount > 10'
            style='text-align:center; margin-top: 10px;'
            layout="prev, pager, next"
            :total="pager.recordCount"
            @current-change='handlePage'>
        </el-pagination>
        <el-dialog
            :visible.sync="showCon"
            :title='conTitle'
            width='500px'>
            <div>
                <div class='line'>
                    <div class='name'>日期：</div>
                    <el-date-picker
                        v-model="con.dates"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <div class='line'>
                    <div class='name'>渠道名：</div>
                    <el-select v-model='con.channelid' :disabled="conTitle != '新建数据'" filterable style='width: 220px'>
                        <el-option
                            v-for='i in channelList'
                            :key='i.id'
                            :label='i.name'
                            :value='i.id'>
                        </el-option>
                    </el-select>
                </div>
                <div class='line'>
                    <div class='name'>新增用户数：</div>
                    <el-input-number
                        controls-position="right"
                        v-model="con.newusers"
                        :min="0">
                    </el-input-number>
                </div>
                <div class='line'>
                    <div class='name'>充值流水：</div>
                    <el-input-number
                        controls-position="right"
                        v-model="con.money"
                        :min="0">
                    </el-input-number>
                </div>
            </div>
            <div slot='footer'>
                <el-button @click='saveData' size='small' plain type='primary'>保存</el-button>
                <el-button @click='cancelData' size='small' plain>取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { dateFormat } from '../../assets/js/util';

export default {
    data() {
        return{
            dataList: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            timeRange: [],
            pager: {
                pageNumber: 1,
                recordCount: 10
            },
            showCon: false,
            conTitle: '新建数据',
            con: {
                dates: new Date(new Date().getTime() - 3600*1000*24),
                channelid: '',
                newusers: 0,
                money: 0
            }
        }
    },
    computed: {
        ...mapState(['channelList'])
    },
    methods: {
        getList() {
            this.$api.PerChannel.list(this.pager.pageNumber, this.timeRange, res => {
                this.dataList = res.pager.dataList.map((e) => {
                    let channel = this.$store.getters.channelName(e.channelid)
                    e.channelName = channel[0].name
                    let date = e.dates.split(' ')[0]
                    console.log(date)
                    e.dates = date
                    return e
                })
                this.pager = res.pager.pager
            })
        },
        addData() {
            this.conTitle = '新建数据'
            this.showCon = true
            this.con = {
                dates: '',
                channelid: '',
                newusers: 0,
                money: 0
            }
        },
        editData(item) {
            this.conTitle = '编辑数据'
            this.showCon = true
            this.con = {
                dates: item.dates,
                channelid: item.channelid,
                newusers: item.newusers,
                money: item.money,
                id: item.id
            }
        },
        delData(item) {
            this.$confirm('确定删除' + item.dates + '的数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$api.PerChannel.delData(item.id, res => {
                    if(res) {
                        this.$message.success('删除成功~~~')
                    }
                    this.getList()
                })
            }).catch(() => {
                this.$message.info('取消删除~')
            })
        },
        saveData() {
            if(this.conTitle == '新建数据') {
                this.$api.PerChannel.addData(this.con, res => {
                    if(res) {
                        this.$message.success('添加成功 ~~~')
                    }
                    this.showCon = false
                    this.getList()
                })
            }
            else {
                this.$api.PerChannel.editData(this.con, res => {
                    if(res) {
                        this.$message.success('修改成功 ~~~')
                    }
                    this.showCon = false
                    this.getList()
                })
            }
        },
        cancelData() {
            this.showCon = false
            if(this.conTitle == '编辑数据') {
                this.getList()
            }
        },
        handleDate(e) {
            if(e == null) {
                this.timeRange = []
                this.getList()
            }
            else {
                this.getList()
            }
        },
        handlePage(e) {
            this.pager.pageNumber = e
            this.getList()
        }
    },
    created() {
        this.getList()
    }
}
</script>

<style lang='scss' scoped>
.top-banner{
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
}
.line{
    display: flex;
    margin: 10px 0;
    .name{
        width: 100px;
        text-align: right;
        margin-right: 30px;
        padding-top: 10px;
    }
}
</style>
