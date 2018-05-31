<template>
    <div>
        <div class='top-banner'>
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
        </el-table>
        <el-pagination
            v-if='pager.recordCount > 10'
            style='text-align:center; margin-top: 10px;'
            layout="prev, pager, next"
            :total="pager.recordCount"
            @current-change='handlePage'>
        </el-pagination>
    </div>
</template>

<script>
import { mapState } from 'vuex'

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
            }
        }
    },
    computed: {
        ...mapState(['channelList'])
    },
    methods: {
        getList() {
            this.$api.PerChannel.list(this.pager.pageNumber, this.timeRange, res => {
                console.log(res.pager.dataList)
                this.dataList = res.pager.dataList.map((e) => {
                    let channel = this.$store.getters.channelName(e.channelid)
                    console.log(channel)
                    e.channelName = channel[0].name
                    let date = e.dates.split(' ')[0]
                    e.dates = date
                    console.log(date)
                    return e
                })
                this.pager = res.pager.pager
            })
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
    flex-direction: row-reverse;
    justify-content: space-between;
    padding: 10px 0;
}
</style>
