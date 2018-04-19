<template>
<section>
    <div class="head">
      <div class="search">
      <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select">
        <el-button slot="append" @click="searchKeys" icon="el-icon-search"></el-button>
      </el-input>
      </div>
      <div class="btn">
        <el-button type="primary" @click="addItem" icon="el-icon-circle-plus-outline">添加</el-button>
      </div>
      
    </div>
  <el-table
    :data="tableData"
    border
    @row-dblclick='getDetail'
    style="width: 100%">
    <el-table-column
      prop="token"
      label="token"
      width="180">
    </el-table-column>
    <el-table-column
      prop="startday"
      label="开始时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="endday"
      label="结束时间">
    </el-table-column>
    <el-table-column
      prop="totaltime"
      label="总次数">
    </el-table-column>
    <el-table-column
      prop="usetime"
      label="已用次数">
    </el-table-column>
    <el-table-column
      prop="power"
      label="权利">
      <template slot-scope="scope">
        <span v-if="scope.row.power==1">永久免费</span>
        <span v-if="scope.row.power==0">按需收费</span>
      </template>
    </el-table-column>
    <el-table-column
        prop="moneytype"
      label="计费模式">
      <template slot-scope="scope">
      <span v-if="scope.row.moneytype==1&&scope.row.power==0">按次数</span>
      <span v-if="scope.row.moneytype==0&&scope.row.power==0">按日期</span>
      <span v-if="scope.row.power==1">-/-</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
      <span v-if="scope.row.status==1">启用</span>
      <span v-if="scope.row.status==0">停用</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="id"
      label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
        v-if="scope.row.status==0"
          size="mini"
          type="success"
          @click="handleDelete(scope.row)">启用</el-button>
          <el-button
          v-if="scope.row.status==1"
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">停用</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="msgtitle" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="token" :label-width="formLabelWidth">
      <el-input :disabled="msgtitle=='编辑'" v-model="form.token"></el-input>
    </el-form-item>
    <el-form-item label="时间" :label-width="formLabelWidth">
      <el-date-picker
      v-model="form.time"
      type="daterange"
      align="right"
      @change='getTimes'
      value-format='yyyy-MM-dd'
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2">
    </el-date-picker>
    </el-form-item>
    <el-form-item label="总次数" :label-width="formLabelWidth">
      <el-input v-model="form.totaltime"></el-input>
    </el-form-item>
    <el-form-item label="已用次数" :label-width="formLabelWidth">
      <el-input v-model="form.usetime"></el-input>
    </el-form-item>
    <el-form-item v-show="msgtitle=='添加'" label="权利" :label-width="formLabelWidth">
      <el-radio-group v-model="form.power">
        <el-radio :label="0">按需收费</el-radio>
        <el-radio :label="1">永久免费</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-show="msgtitle=='添加'" label="计费模式" :label-width="formLabelWidth">
      <el-radio-group v-model="form.moneytype">
        <el-radio :label="0">按日期</el-radio>
        <el-radio :label="1">按次数</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input v-model="form.remark" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item v-show="msgtitle=='添加'" label="状态" :label-width="formLabelWidth">
      <el-radio-group v-model="form.status">
        <el-radio :label="0">停用</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveDate">确 定</el-button>
  </div>
</el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      searchKey: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      msgtitle: "",
      page: {
        pagenum: 1
      },
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: "80px",
      form: {}
    };
  },
  methods: {
    yanzheng() {
      if (this.form.token != "" && this.form.token) {
        return true;
      } else if (this.form.startday != "" && this.form.startday) {
        return true;
      } else if (this.form.endday != "" && this.form.endday) {
        return true;
      } else if (this.form.remark != "" && this.form.remark) {
        return true;
      } else if (this.form.totaltime != "" && this.form.totaltime) {
        return true;
      } else if (this.form.usetime != "" && this.form.usetime) {
        return true;
      } else if (this.form.status != "" && this.form.status) {
        return true;
      } else if (this.form.power != "" && this.form.power) {
        return true;
      } else if (this.form.moneytype != "" && this.form.moneytype) {
        return true;
      } else {
        
        return false;
      }
    },
    getDetail(row, e) {
      console.log(row);
      console.log(e);
    },
    searchKeys() {
      this.$api.Token.search(this.searchKey, res => {
        this.tableData = res.pager.dataList;
      });
    },
    saveDate() {
      if(this.yanzheng()){
        var callback = res => {
        console.log("函数回调");
        console.log(res);
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.dialogFormVisible = false;
        this.getList();
      };
      var formdata = {};
      formdata.startday = this.form.startday;
      formdata.endday = this.form.endday;
      formdata.remark = this.form.remark;
      formdata.totaltime = this.form.totaltime;
      formdata.usetime = this.form.usetime;
      if (this.msgtitle == "添加") {
        formdata.token = this.form.token;
        formdata.status = this.form.status;
        formdata.power = this.form.power;
        formdata.moneytype = this.form.moneytype;
        this.$api.Token.add(formdata, callback);
      } else if (this.msgtitle == "编辑") {
        formdata.id = this.form.id;
        this.$api.Token.edit(formdata, callback);
      }
      }else{
        this.$alert("请将表单信息填写完整", "提示", {
          confirmButtonText: "确定"
        });
      }
      
    },
    getTimes(e) {
      this.form.startday = e[0];
      this.form.endday = e[1];
    },
    addItem() {
      this.msgtitle = "添加";
      this.form = {};
      this.dialogFormVisible = true;
    },
    getList() {
      this.$api.Token.list(res => {
        //console.log(res);
        this.tableData = res.pager.dataList;
      });
    },
    handleEdit(index, row) {
      this.msgtitle = "编辑";
      this.form = row;
      this.form.time = [row.startday, row.endday];
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      if (row.status == 1) {
        this.$confirm("此操作将停用此Token, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var data = {};
            data.id = row.id;
            data.status = 0;
            this.$api.Token.status(data, res => {
              this.getList();
              this.$message({
                type: "success",
                message: "停用成功!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消该操作"
            });
          });
      } else if (row.status == 0) {
        this.$confirm("此操作将启用此Token, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var data = {};
            data.id = row.id;
            data.status = 1;
            this.$api.Token.status(data, res => {
              this.getList();
              this.$message({
                type: "success",
                message: "启用成功!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消该操作"
            });
          });
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style scoped>
.head {
  padding: 15px 0;
  display: flex;
}
.head .search {
  width: 400px;
  margin-right: 35px;
}
</style>

