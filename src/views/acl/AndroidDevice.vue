<template>
  <section>
    <div class="head">
      <div class="search">
        <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select">
          <el-button slot="append" @click="searchKeys" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- <div class="btn">
        <el-button type="primary" @click="addItem" icon="el-icon-circle-plus-outline">添加</el-button>
      </div> -->

    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading='loading'>
      <el-table-column prop="AndroidId" label="AndroidID">
      </el-table-column>
      <el-table-column prop="taskid" label="任务ID">
      </el-table-column>
      <el-table-column prop="Line1Number" label="手机号码">
      </el-table-column>
      <el-table-column prop="NetworkType" label="网络模式">
        <template slot-scope="scope">
          <span v-if="scope.row.NetworkType==0">Unknown</span>
          <span v-if="scope.row.NetworkType==1">GPRS (2G)</span>
          <span v-if="scope.row.NetworkType==2">GPRS (2G)</span>
          <span v-if="scope.row.NetworkType==3">UMTS</span>
          <span v-if="scope.row.NetworkType==4">CDMA (3G)</span>
          <span v-if="scope.row.NetworkType==5">EVDO_0</span>
          <span v-if="scope.row.NetworkType==6">EVDO_A</span>
          <span v-if="scope.row.NetworkType==7">1xRTT</span>
          <span v-if="scope.row.NetworkType==8">HSDPA(3G+)</span>
          <span v-if="scope.row.NetworkType==9">HSUPA(3G+)</span>
          <span v-if="scope.row.NetworkType==10">HSPA</span>
          <span v-if="scope.row.NetworkType==11">IDEN</span>
          <span v-if="scope.row.NetworkType==12">EVDO_B</span>
          <span v-if="scope.row.NetworkType==13">LTE (4G)</span>
          <span v-if="scope.row.NetworkType==14">EHRPD</span>
          <span v-if="scope.row.NetworkType==15">HSPAP</span>
          <span v-if="scope.row.NetworkType==99">WIFI</span>
        </template>
      </el-table-column>
      <el-table-column prop="SimNo" label="SIM卡号">
      </el-table-column>
      <el-table-column prop="buildManufacturer" label="品牌">
      </el-table-column>
      <el-table-column prop="buildModel" label="型号">
      </el-table-column>
      <el-table-column prop="buildSerial" label="安全码">
      </el-table-column>
      <el-table-column prop="buildVersionRelease" label="系统版本">
      </el-table-column>
      <el-table-column prop="deviceId" label="IMEI">
      </el-table-column>
      <el-table-column prop="iccid" label="ICCID">
      </el-table-column>
      <el-table-column prop="ip" label="IP">
      </el-table-column>
      <el-table-column prop="macaddress" label="MAC地址">
      </el-table-column>
      <el-table-column prop="packagename" label="应用包名">
      </el-table-column>
      <el-table-column prop="ssid" label="wif名称">
      </el-table-column>
      <el-table-column prop="uuid" label="数据ID">
      </el-table-column>
      <el-table-column prop="token" label="Token">
      </el-table-column>
    </el-table>
    <div class="page" v-if="this.page.pageSize>=15">
      <el-pagination background @current-change='changePage' layout="prev, pager, next" :page-size='15' :total="this.page.pageSize">
      </el-pagination>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      searchKey: "",
      page: {
        pagenum: 1,
        pageSize: 0
      },
      isSearchList: false,
      tableData: []
      //   dialogFormVisible: false,
      //   formLabelWidth: "80px",
      //   form: {}
    };
  },
  methods: {
    searchKeys() {
      this.loading = true;
      var type = "Android";
      this.$api.Device.search(this.searchKey, this.page.pagenum, type, res => {
        this.loading = false;
        this.tableData = res.pager.dataList;
        this.isSearchList = true;
        this.page.pageSize = res.pager.pager.recordCount;
      });
    },
    getList() {
      this.loading = true;
      var type = "Android";
      this.$api.Device.list(this.page.pagenum, type, res => {
        this.loading = false;
        //console.log(res);
        this.tableData = res.pager.dataList;
        this.page.pageSize = res.pager.pager.recordCount;
      });
    },
    changePage(page) {
      this.page.pagenum = page;
      if (this.isSearchList) {
        this.searchKeys();
      } else {
        this.getList();
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
.page {
  margin: 20px auto;
}
</style>

