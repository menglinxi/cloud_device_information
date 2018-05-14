<template>
    <div>
        <div class='line'>
            <div>
                <div class='title'>{{missionName}}  任务数据详情</div>
                <el-button @click='backList' size="small" plain type='primary'>返回列表</el-button>
            </div>
            <div id='echart'>请刷新页面~~</div>
        </div>
        <div class='set-content'>
            <div class='top-line'>
                <el-tag type="warning" style='float: left;' :class='[isShowDay? "mt20" : ""]'><i class='el-icon-star-on'></i> 请在折线图点选要进行的数据 ~ ~</el-tag>
                <div v-if='isShowDay' class='day-content'>
                    <div class='data-con'>
                        <div>
                            <div class='data-text'>
                                <i class='el-icon-tickets'></i>
                                {{curSetIndex == 0 ? '无前一天数据，当前为第一天数据：' : dayData.yDate + '(即第' + curSetIndex + '天)的数据：'}}
                            </div>
                            <div class='data-text' style=' margin-top: 22px;'>
                                <i class='el-icon-edit'></i>
                                设置{{dayData.date}}(即第{{curSetIndex + 1}}天)的数据：
                            </div>
                        </div>
                        <div>
                            <el-input size='mini' disabled style='width:150px;' v-model='dayData.yd'>
                                <span slot='prepend'>留存量(d)</span>
                            </el-input>
                            <el-input size='mini' style='width:150px; margin-top: 10px;' v-model='dayData.d'>
                                <span slot='prepend'>留存量(d)</span>
                            </el-input>
                        </div>
                        <div>
                            <el-input size='mini' disabled style='width:190px;' v-model='dayData.ydpn'>
                                <span slot='prepend'>付费用户数(dpn)</span>
                            </el-input>
                            <el-input size='mini' style='width:190px; margin-top: 10px;' v-model='dayData.dpn'>
                                <span slot='prepend'>付费用户数(dpn)</span>
                            </el-input>
                        </div>
                        <div>
                            <el-input size='mini' disabled style='width:180px;' v-model='dayData.ydpm'>
                                <span slot='prepend'>付费金额(dpm)</span>
                            </el-input>
                            <el-input size='mini' style='width:180px; margin-top: 10px;' v-model='dayData.dpm'>
                                <span slot='prepend'>付费金额(dpm)</span>
                            </el-input>
                        </div>
                        <div style="padding: 20px 0; display: flex;">
                            <el-button size='mini' type='primary' plain @click='saveDay'>保存</el-button>
                            <el-button size='mini' @click='cancelDay'>取消</el-button>
                        </div>
                    </div>
                </div>
            </div>            
            <el-upload
                :class='[isShowDay? "mt20" : ""]'
                class="upload-demo"
                action="datatask/uploadexl"
                :on-success="getNewData"
                :show-file-list=false
                :data='curTaskId'>
                <el-button size="mini" type='success' plain>导入excel数据</el-button>
            </el-upload>
            <el-input size="mini" placeholder="请输入开始日期进行搜索..." v-model='searchKey' style="width: 180px; margin-left: 20px;" :class='[isShowDay? "mt20" : ""]'></el-input>
        </div>
        <el-table
            :data='filterPlan'
            border
            width='100%'
            height="400">
            <el-table-column
                width='150'
                prop="isedit"
                align="center"
                label='操作'
                fixed>
                <template slot-scope="scope">
                    <el-button size="mini" type='primary' plain @click='setCharts(scope.row.id)' v-if='!scope.row.isedit' icon='el-icon-edit'></el-button>
                    <el-button size="mini" type='warning' disabled plain v-if='scope.row.isedit'>编辑中</el-button>
                    <el-button size='mini' type='danger' plain icon='el-icon-delete' @click='delData(scope.row.id)'></el-button>
                </template>
            </el-table-column>
            <el-table-column
                v-for='(item,index) in dataCols'
                :key='index'
                :label="item.label"
                :prop='item.name'
                :width="item.width"
                :fixed='item.fixed'
                align="center">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
// import dataList from '../../../static/dataList/list'
import echarts from 'echarts'
import { dateFormat } from '../../assets/js/util'

export default {
  props: {
      dataList: Array,
      missionName: String
  },
  data() {
      return {
          dayPlan: '0',
          searchKey: '',
          planData: [],
          dataCols: [],
          isShowDay: false,
          dList: [],
          dpnList: [],
          dpmList: [],
          dateList: [],
          dayData: {
              yDate: '2018-04-03',
              yd: 0,
              ydpn: 0,
              ydpm: 0,
              date: '2018-04-04',
              d: 0,
              dpn: 0,
              dpm: 0
          },
          curSetIndex: 0,   //当前设置的数据的index
          curShowListId: 0,  //当前折线图展示数据的index
          curTaskId: {
              taskid: 0
          }
      }
  },
  computed: {
      filterPlan() {
          let key = this.searchKey
          let list = this.planData
          if(key) {
              list = list.filter((i) => {
                  return i.id == key || i.startdate.indexOf(key) > -1
              })
          }
          return list
      }
  },
  watch: {
      dataList(val) {
          this.planData = val
          this.curTaskId.taskid = val[0].taskid
          this.curShowListId = val[0].id
          console.log(this.planData)
          this.setTable()
      }
  },
  methods: {
      setTable() {
            this.planData = this.planData.map((i) => {
                i.isedit = false
                i.startdate = i.startdate.substring(0, 10)
                return i
            })
            this.setCols()
            this.setCharts(this.curShowListId)            
      },
      setCols() {
        this.dataCols = []
        let longestIndex = 0
        let longestCols = []
        this.planData.forEach((i, index) => {
            let cols = Object.keys(i)
            if(cols.length > longestCols.length) {
                longestIndex = index
                longestCols = cols
            }
        })
        let cols = Object.keys(this.planData[longestIndex]).filter((i) => {
            return i != 'isedit'
        })
        this.planData = this.planData.map((i) => {
            const il= Object.keys(i).length
            const cl= longestCols.length
            const sd = (il - 4)/3
            if(il < cl) {
                const dis = (cl - il)/3
                for(let t = 1; t <= dis; t++) {
                    let d = t + sd
                    i[d + 'd'] = 0
                    i[d + 'dpn'] = 0
                    i[d + 'dpm'] = 0
                }
            }
            return i
        })
        console.log(this.planData)
        cols.forEach((i) => {
            let obj = {
                fixed: false,
                name: i,
                width: '70',
                label: i
            }
            if(i == 'id' || i == 'startdate' || i == 'taskid') {
                obj.fixed = true
            }
            if(i == 'startdate') {
                obj.width = '120'
                obj.label = '开始日期'
            }
            this.dataCols.push(obj)
        })
      },
      setDate(date) {
          let timeStamp = new Date(date).getTime();
          this.dateList = []
          let daysLength = (this.dataCols.length - 3)/3
          for(let t = 0; t < daysLength; t++) {
              let d = dateFormat(timeStamp + 1000*60*60*24*t)
              this.dateList.push(d)
          }
      },
      setCharts(num) {
            let firstD = this.planData.filter((i) => {
                return i.id == num
            })
            this.curShowListId = num
            this.dList = []
            this.dpnList = []
            this.dpmList = []
            let listLength = (this.dataCols.length - 3)/3 + 1
            for(let t=1; t<listLength; t++) {
                this.dList.push(firstD[0][t+'d'])
                this.dpnList.push(firstD[0][t+'dpn'])
                this.dpmList.push(firstD[0][t+'dpm'])
            }
            this.planData = this.planData.map((i) => {
                if(i.id == num) {
                    i.isedit = true
                }
                else {
                    i.isedit = false
                }
                return i
            })
            this.setDate(firstD[0].startdate)
            this.initEcharts()
      },
      getNewData(res) {
          this.planData = res.data.dataTask
          this.setTable()
      },
      saveDay() {
        let day = this.curSetIndex + 1
        let newData = {
            id: this.curShowListId
        }
        newData[day + 'd'] = Number(this.dayData.d)
        newData[day + 'dpn'] = Number(this.dayData.dpn)
        newData[day + 'dpm'] = Number(this.dayData.dpm)

        this.$api.Mission.editData(newData, result => {
            if(result.taskdata[0].taskid) {
                this.planData = this.planData.map((i) => {
                    if(i.id == result.taskdata[0].id) {
                        i = result.taskdata[0]
                    }
                    return i
                })
                this.isShowDay = false
                this.setTable()
                this.$message.success('数据修改成功！')
            }
            else {
                window.location.reload()
            }
        })
      },
      cancelDay() {
        this.isShowDay = false
      },
      delData(id) {
          this.$confirm('确定删除此条数据？', '提示', {
              confirmTextButton: '确定',
              cancelTextButton: '取消',
              align: 'center'
          }).then(() => {
              this.$api.Mission.delData(id, result => {
                  this.$message.success('删除成功')
                  this.$api.Mission.getData(this.curTaskId, res => {
                      this.curShowListId = res.dataTask[0].id
                      this.planData = res.dataTask
                      this.setTable()
                  })
              })
          }).catch(() => {
              this.$message.info('已取消删除~~~')
          })
      },
      backList() {
          this.$emit('backToList')
      },
      initEcharts() {
        var myChart = echarts.init(document.getElementById('echart'));
        var options = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['留存总量','付费用户','付费金额'],
                top: '5%'
            },
            xAxis:  {
                type : 'category',
                boundaryGap : false,
                data : this.dateList,
                axisLine: {
                    lineStyle: {
                        width: 1.5,
                        color: 'rgba(56,56,56,0.7)',
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        shadowOffsetX: 4,
                        shadowOffsetY: 4
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        width: 1.5,
                        color: 'rgba(56,56,56,0.7)',
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        shadowOffsetX: 4,
                        shadowOffsetY: 4
                    }
                }
            },
            series : [
                {
                    name:'留存总量',
                    type:'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#FF6347',
                            lineStyle: {
                                color: '#FF6347'
                                }
                            },
                        },
                    data: this.dList
                },
                {
                    name:'付费用户',
                    type:'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#00BFFF',
                            lineStyle: {
                                color: '#00BFFF'
                                }
                            },
                        },
                    data: this.dpnList
                },
                {
                    name:'付费金额',
                    type:'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#90EE90',
                            lineStyle: {
                                color: '#90EE90'
                                }
                            },
                        },
                    data: this.dpmList
                }
            ]
            };
            myChart.on('click', (item)=> {
            this.curSetIndex = item.dataIndex
            let cIndex = item.dataIndex
            let yIndex = cIndex - 1
            const dateStamp = new Date(item.name).getTime()
            const yDate = dateFormat(dateStamp - 1000*60*60*24)
            if(item.dataIndex == 0) {
                yIndex = 0
            }
            this.dayData = {
                yDate: yDate,
                yd: this.dList[yIndex],
                ydpn: this.dpnList[yIndex],
                ydpm: this.dpmList[yIndex],
                date: item.name,
                d: this.dList[cIndex],
                dpn: this.dpnList[cIndex],
                dpm: this.dpmList[cIndex]
            }
            this.isShowDay = true
        },);
        myChart.setOption(options)
      }
  }
}
</script>

<style lang="scss" scoped>
#echart{
    width: 90%;
    height: 280px;
}
.top-line{
    display: flex;
    width: 80%;
    .day-content{
        margin-left: 20px;
        .data-text{
            margin-top: 8px; 
            color: rgba(56,56,56,0.7); 
            font-weight: bold;
            font-size: 12px;
            width: 250px;
        }
        .data-con{
            display: flex;
            justify-content: space-between;
        }
    }
}
.mt20{
    margin-top: 20px; 
}
.set-content{
    display: flex;
    justify-content: space-between;
    margin: 0 0 15px;
    padding: 10px 0;
    border-top: 1px dashed rgb(209, 208, 208);
    border-bottom: 1px dashed rgb(209, 208, 208);
}
.line{
    display: flex;
    justify-content: space-between;
    .title{
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
    }
}
</style>
