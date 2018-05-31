<template>
    <div>
        <div class='misListCon' v-show='conStep == 0'>
            <div class='line'>
                <el-button @click='setMission(0)' size='small' type='success' plain>新增任务计划</el-button>
                <el-input v-model='searchKey' size='small' placeholder="请输入任务名称进行搜索..." style='width: 350px;'></el-input>
            </div>
            <el-table
                :data='filterMission'
                border>
                <el-table-column
                prop="id"
                label="编号"
                width="50"
                align="center">
                </el-table-column>
                <el-table-column
                prop="taskname"
                label="任务名称"
                width="150"
                align="center">
                </el-table-column>
                <el-table-column
                prop="game"
                label="游戏名称"
                width="150"
                align="center">
                </el-table-column>
                <el-table-column
                prop="channel"
                label="渠道名称"
                width="150"
                align="center">
                </el-table-column>
                <el-table-column
                prop="remark"
                label="任务要求"
                align="center">
                </el-table-column>
                <el-table-column
                prop="contacts"
                label="任务对接人"
                width="120"
                align="center">
                </el-table-column>
                <el-table-column
                prop="createscript"
                label="拉新任务脚本"
                width="180"
                show-overflow-tooltip
                align="center">
                </el-table-column>
                <el-table-column
                prop="savescript"
                label="留存任务脚本"
                width='180'
                show-overflow-tooltip
                align="center">
                </el-table-column>
                <el-table-column
                prop="createtime"
                label="创建时间"
                width="160"
                align="center">
                </el-table-column>
                <el-table-column
                prop='status'
                label='任务状态'
                width='100'
                align="center">
                    <template slot-scope="scope">
                        <el-dropdown @command='changeStatus($event, scope.row)'>
                            <el-tag :type='scope.row.statusObj.type' size="small">
                                {{scope.row.statusObj.name}}
                                <i class='el-icon-arrow-down el-icon--right'></i>
                            </el-tag>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    v-for='(item, index) in scope.row.statusObj.list'
                                    :key='index'
                                    :command='Object.keys(item)[0]'>
                                {{Object.values(item)[0]}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column
                prop="payData"
                label='档位状态'
                width='140'
                align="center">
                    <template slot-scope="scope">
                        <div v-if='scope.row.paydata'>
                            <el-tag size='small' type='success'>已设置</el-tag>
                            <el-button type='warning' plain size='mini' icon='el-icon-edit' @click='editPayD(1, scope.row)'></el-button>
                        </div>
                        <div v-if='!scope.row.paydata'>
                            <el-tag size='small' type='info'>未设置</el-tag>
                            <el-button type='success' plain size='mini' icon='el-icon-edit' @click='editPayD(0, scope.row)'></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                prop="setting"
                label="操作"
                align="center"
                width='180'>
                    <template slot-scope="scope">
                        <el-button type='success' plain round size="mini" v-if='!scope.row.hastaskdata' @click='showUpCon(scope.row.id)'>导入数据</el-button>
                        <el-button type='warning' plain round size="mini" v-if='scope.row.hastaskdata' @click='showData(scope.row)'>数据详情</el-button>
                        <el-button type='primary' plain size="mini" @click='setMission(1, scope.row)'>编辑</el-button>
                        <!-- <el-button type='danger' plain size='mini' @click='delMission(scope.row.id)'>删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style='margin-top: 10px; text-align: center;'
                v-if='pager.recordCount > 15'
                @current-change="handleCurrentChange"
                :current-page="pager.pageNumber"
                :page-size="pager.pageSize"
                layout="total, prev, pager, next"
                :total="pager.recordCount">
            </el-pagination>
            <el-dialog
                width='30%'
                :visible.sync="showSetContent"
                :title='setConTitle'>
                <div>
                    <div class='line'>
                        <span>任务名称：</span>
                        <el-input size="small" v-model='con.taskname' style='width: 350px;'></el-input>
                    </div>
                    <div class='line'>
                        <span>对接人：</span>
                        <el-input size="small" v-model='con.contacts' style='width: 350px;'></el-input>
                    </div>
                    <div class='line'>
                        <span>游戏名称：</span>
                        <el-input size="small" v-model='con.game' style='width: 350px;'></el-input>
                    </div>
                    <div class='line'>
                        <span>渠道名称：</span>
                        <el-input size="small" v-model='con.channel' style='width: 350px;'></el-input>
                    </div>
                    <div class='line'>
                        <span>任务要求：</span>
                        <el-input size="small" v-model='con.remark' style='width: 350px;'></el-input>
                    </div>
                    <div class='line'>
                        <span>拉新脚本上传：</span>
                        <el-tag
                            style='width: 68%;'
                            v-show='con.createscript'
                            closable
                            type='info'
                            @close='delScript(0)'>
                            {{con.createscript}}
                        </el-tag>
                        <el-upload
                        v-show='!con.createscript'
                        class="upload-demo upload-content"
                        action="api/image/upscript"
                        style='width: 350px;'
                        :limit=1
                        :on-remove="clearCreate"
                        :before-upload='uplCreate'
                        :on-success="getcreatejs">
                        <el-button type='success' plain size="small">点击上传</el-button>
                        <div slot='tip' class="el-upload__tip" style='margin-left: 20px;' v-if='isShowCreateTips'>只能上传apk/py型文件，大小不超过1G。</div>
                        </el-upload>
                    </div>
                    <div class='line'>
                        <span>留存充值脚本上传：</span>
                        <el-tag
                            style='width: 68%;'
                            v-show='con.savescript'
                            closable
                            type='info'
                            @close='delScript(1)'>
                            {{con.savescript}}
                        </el-tag>
                        <el-upload
                        v-show='!con.savescript'
                        class="upload-demo upload-content"
                        action="api/image/upscript"
                        style='width: 350px;'
                        :on-remove="clearSave"
                        :before-upload="uplSave"
                        :on-success="getsavejs"
                        :limit=1>
                        <el-button type='success' plain size="small">点击上传</el-button>
                        <div slot='tip' class="el-upload__tip" style='margin-left: 20px;' v-if='isShowSaveTips'>只能上传apk/py型文件，大小不超过1G。</div>
                        </el-upload>
                    </div>
                </div>
                <div slot='footer'>
                    <el-button type='primary' size="small" @click='saveMission'>保存</el-button>
                    <el-button size='small' plain @click='cancelMission'>取消</el-button>
                </div>
            </el-dialog>
            <el-dialog
                width='30%'
                :visible.sync="isShowData"
                title='上传本地数据'>
                <el-upload
                    class="upload-demo"
                    action="datatask/uploadexl"
                    :on-success="getTaskData"
                    :data='chosedId'>
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
                </el-upload>
            </el-dialog>
            <el-dialog
                width="30%"
                title="设置充值档位"
                :visible.sync="isShowPay">
                <div>
                    <div class='pay-line'>
                        <span>低档：</span>
                        <el-input size='small' style='width: 200px;' v-model='payData.d'></el-input>
                        <span>投档概率：</span>
                        <el-input-number size="small" style='width: 95px;' controls-position="right" :max='101' :min='-1' v-model='payData.dp'></el-input-number>
                        <span>%</span>
                    </div>
                    <div class='pay-line'>
                        <span>中档：</span>
                        <el-input size='small' style='width: 200px;' v-model='payData.m'></el-input>
                        <span>投档概率：</span>
                        <el-input-number size="small" style='width: 95px;' controls-position="right" :max='101' :min='-1' v-model='payData.mp'></el-input-number>
                        <span>%</span>
                    </div>
                    <div class='pay-line'>
                        <span>高档：</span>
                        <el-input size='small' style='width: 200px;' v-model='payData.h'></el-input>
                        <span>投档概率：</span>
                        <el-input-number size="small" style='width: 95px;' controls-position="right" :max='101' :min='-1' v-model='payData.hp'></el-input-number>
                        <span>%</span>
                    </div>
                    <div style='color: red; font-size: 12px;'>
                        每档多个充值金额，用英文逗号分割！
                    </div>
                    <div style='color: gray; font-size: 12px;'>
                        为了数据更真实，充值金额，允许10元上下误差。
                    </div>
                </div>
                <div slot='footer'>
                    <el-button type='success' size='mini' plain @click='savePayD'>保存</el-button>
                    <el-button type='primary' size='mini' plain @click='cancelPayD'>取消</el-button>
                </div>
            </el-dialog>
        </div>
        <div class='showDataCon' v-show='conStep == 1'>
            <!-- <div class='line'>
                <el-button @click='conStep = 0' size="small" plain type='primary'>返回列表</el-button>
                <div style='text-align: center; width:100%; font-size: 16px; font-weight: bold;'>{{missionName}}  任务数据详情</div>
            </div> -->
            <dataCon :dataList='dataList' ref='dCon' @backToList='backList' :missionName='missionName'></dataCon>
        </div>
    </div>
</template>

<script>
import dataCon from '../mission/dataContent'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
      return {
          conStep: 0,
          searchKey: '',
          missionList: [],
          con: {
            id: 0,
            taskname: '',
            game: '',
            channel: '',
            remark: '',
            contacts: '',
            createscript: '',
            savescript: ''
          },
          showSetContent: false,
          setConTitle: '新建任务计划',
          pager: {
              pageNumber: 1,
              pageSize: 10,
              recordCount: 10
          },
          createfile: '',
          savefile: '',
          isShowData: false,
          chosedId: {
              taskid: 0
          },
          missionName: '',
          dataList: [],
          isShowCreateTips: true,
          isShowSaveTips: true,
          isShowPay: false,
          payData: {
              d: '',
              dp: '',
              m: '',
              mp: '',
              h: '',
              hp: ''
          }
      }
  },
  components: {
      dataCon
  },
  computed: {
    filterMission() {
        let key = this.searchKey && this.searchKey.toLowerCase()
        let list = this.missionList
        if(key) {
            list = list.filter((i) => {
                return i.taskname.toLowerCase().indexOf(key) > -1
            })
        }
        return list
    }
  },
  methods: {
      getMission() {
         this.$api.Mission.list(this.pager.pageNumber, result =>{
             const data = result.pager
             this.pager = data.pager
             this.missionList = data.dataList.map((i) => {
                let arr = []
                switch(i.status) {
                    case 0: 
                        arr = ['success', '就绪', [{1:'执行中'},{2:'已完成'},{3:'已停止'}]];
                        break;
                    case 1:
                        arr = ['', '执行中', [{0:'就绪'}, {2:'已完成'},{3:'已停止'}]];
                        break;
                    case 2:
                        arr = ['info', '已完成', [{0:'就绪'},{1:'执行中'},{3:'已停止'}]];
                        break;
                    case 3:
                        arr = ['danger', '已停止', [{0:'就绪'}, {1:'执行中'},{2:'已完成'}]];
                        break;
                }
                i.statusObj = {
                    type: arr[0],
                    name: arr[1],
                    list: arr[2]
                }
                return i
             })
         }) 
      },
      setMission(type, item) {
          if(!type) {
              this.setConTitle = '新建任务计划'
          }
          else {
              this.setConTitle = '编辑任务计划'
              this.con = item
          }
          this.showSetContent = true
      },
      delScript(num) {
          if(!num) {
              this.con.createscript = ''
          }
          else {
              this.con.savescript = ''
          }
      },
      delMission(id) {
        this.$confirm('确定删除此任务吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: 'true',
            showClose: 'false'
        }).then(() => {
            this.$message.success('删除成功！')
        }).catch(() => {
            this.$message.info('已取消删除！')
        })
      },
      uplCreate() {
          this.isShowCreateTips = false
      },
      uplSave(){
          this.isShowSaveTips = false
      },
      getcreatejs(res) {
          this.con.createscript = res.data.url
      },
      getsavejs(res) {
          this.con.savescript = res.data.url
      },
      clearCreate() {
          this.con.createscript = ''
          this.isShowCreateTips = true
      },
      clearSave() {
          this.con.savescript = ''
          this.isShowSaveTips = true
      },
      saveMission() {
        this.$api.Mission.create(this.con, result => {
            this.pager.pageNumber = 1
            this.getMission()
        })
        this.showSetContent = false
      },
      cancelMission() {
        this.showSetContent = false
        this.getMission()
      },
      handleCurrentChange(e) {
          this.pager.pageNumber = e
          this.getMission()
      },
      showUpCon(id) {
          this.chosedId.taskid = id
          this.isShowData = true
      },
      changeStatus(command, item) {
        if(command != 0 && !item.paydata) {
            this.$message.error('请先设置充值档位 ~~~ ')
            return
        }
        let tS = '';
        switch(command) {
            case '0':
                tS = '就绪';
                break;
            case '1':
                tS = '执行中';
                console.log('aa',tS)
                break;
            case '2':
                tS = '已完成';
                break;
            case '3':
                tS = '已停止';
                break;
        }
        this.$confirm('确定将  '+ item.taskname + '  任务状态修改为  ' + tS + '  吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            align: 'center'
        }).then(() => {
            this.$api.Mission.changeStatus(item.id, command, res => {
                this.getMission()
                this.$message.success(item.taskname + ' 任务状态修改成功！')
            }, err => {
                this.$message.error(item.taskname + ' 任务状态修改失败，请重新设置！')
            })
        }).catch(() => {
            this.$message.info('已取消修改 ~~')
        })
        setTimeout(() => {
            console.log(tS)
        },500)
      },
      editPayD(num, item) {
          this.isShowPay = true
          this.chosedId.taskid = item.id
          if(!num) {
            this.payData = {
                d: '',
                dp: '',
                m: '',
                mp: '',
                h: '',
                hp: ''
            }
          }
          else {
            let dd = JSON.parse(item.paydata)
            let ddObj = []
            dd.forEach((e) => {
                ddObj.push(Object.keys(e)[0])
            })
            console.log(dd, ddObj, ddObj[0], dd[0], dd[0][ddObj[0]])
            this.payData = {
                d: ddObj[0],
                dp: dd[0][ddObj[0]].slice(0, -1),
                m: ddObj[1],
                mp: dd[1][ddObj[1]].slice(0, -1),
                h: ddObj[2],
                hp: dd[2][ddObj[2]].slice(0, -1)
            }
          }
      },
      savePayD() {
          const pd = this.payData
          const tp = Number(pd.dp) + Number(pd.mp) + Number(pd.hp)
          if(!pd.d || !pd.dp || !pd.m || !pd.mp || !pd.h || !pd.hp) {
              this.$message.error('所有内容都为必填项 ~~~')
              return
          }
          if(tp != 100) {
              this.$message.error('三个档位的投档概率总和应为100% ~~~')
              return
          }
          let newD = []
          let newPay = {}
          newPay[pd.d] = pd.dp + '%'
          newD.push(newPay)
          newPay = {}
          newPay[pd.m] = pd.mp + '%'
          newD.push(newPay)
          newPay = {}
          newPay[pd.h] = pd.hp + '%'
          newD.push(newPay)
          newD = JSON.stringify(newD)
          this.$api.Mission.editPayData(this.chosedId.taskid, newD, res => {
              console.log('pay', res)
              this.$message.success('档位设置成功~~~')
              this.getMission()
              this.isShowPay = false
          }, err => {
              this.$message.error('档位设置失败，请重新设置')
              this.getMission()
          })
      },
      cancelPayD() {
          this.isShowPay = false
      },
      //   数据列表
      showData(item) {
          this.chosedId.taskid = item.id
          this.missionName = item.taskname
          this.$api.Mission.getData(this.chosedId, res => {
            if(res.dataTask) {
                this.conStep = 1
                this.dataList = res.dataTask
            }
            else {
                this.$message.error('获取数据列表失败！')
                this.getMission()
            }
          })
      },
      getTaskData(res) {
          this.dataList = res.data.dataTask
          this.conStep = 1
      },
      backList() {
          this.conStep = 0
      }
  },
  created() {
      this.getMission()
  }
}
</script>

<style lang="scss" scoped>
.line{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    span{
        width: 140px;
        text-align: right;
    }
}
.upload-content{
    display: flex;
    justify-content: space-around;
}
.pay-line{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    span{
        width: 80px;
        margin-left: 10px;
        margin-top: 5px; 
        text-align: left;
    }
}
</style>
