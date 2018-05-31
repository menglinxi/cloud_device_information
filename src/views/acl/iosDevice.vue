<template>
  <section>
    <div class="head">
      <div class="search">
        <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select">
          <el-button slot="append" @click="searchKeys" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="filter" style="margin-top:15px;">
        <div style="width:150px;padding-left:15px;">选择显示：</div>
        <div style="margin-left:-15px;">
          <el-checkbox v-model="show.uuid" style="margin-left: 30px;">uuid</el-checkbox>
          <el-checkbox v-model="show.DeviceCategory">设备类型</el-checkbox>
          <el-checkbox v-model="show.CountryCode">国家</el-checkbox>
          <el-checkbox v-model="show.SerialNumber">安全码</el-checkbox>
          <el-checkbox v-model="show.EthernetIPv6Address">IPV6</el-checkbox>
          <el-checkbox v-model="show.EthernetIPv4Address">IPV4</el-checkbox>
          <el-checkbox v-model="show.ProductModel">设备模型</el-checkbox>
          <el-checkbox v-model="show.EthernetBSSID">网络ssid</el-checkbox>
          <el-checkbox v-model="show.RegionCode">注册区域</el-checkbox>
          <el-checkbox v-model="show.ProductType">商品类型</el-checkbox>
          <el-checkbox v-model="show.BluetoothAddress">蓝牙地址</el-checkbox>
          <el-checkbox v-model="show.InverseDeviceID">反向设备标识</el-checkbox>
          <el-checkbox v-model="show.MEID">MEID</el-checkbox>
          <el-checkbox v-model="show.EthernetMacAddress">MAC地址</el-checkbox>
          <el-checkbox v-model="show.UniqueIdentifier">唯一标识</el-checkbox>
          <el-checkbox v-model="show.UniqueDeviceID">UDID</el-checkbox>
          <el-checkbox v-model="show.ICCID">ICCID</el-checkbox>
          <el-checkbox v-model="show.ProductHWModel">硬件模型</el-checkbox>
          <el-checkbox v-model="show.ISOCountryCode">标准国家码</el-checkbox>
          <el-checkbox v-model="show.RegionInfo">发行地区</el-checkbox>
          <el-checkbox v-model="show.MLBSerialNumber">MBL序列号</el-checkbox>
          <el-checkbox v-model="show.IdentifierForVendor">IDFV</el-checkbox>
          <el-checkbox v-model="show.EthernetSSID">WIFI名称</el-checkbox>
          <el-checkbox v-model="show.CarrierName">运营商</el-checkbox>
          <el-checkbox v-model="show.IMSI">IMSI</el-checkbox>
          <el-checkbox v-model="show.InternationalMobileEquipmentIdentity">国际移动装备辨别码</el-checkbox>
          <el-checkbox v-model="show.ServiceString">服务商识别码</el-checkbox>
          <el-checkbox v-model="show.NetworkCode">网络码</el-checkbox>
          <el-checkbox v-model="show.UniqueChipID">UniqueChipID</el-checkbox>
        </div>
        <!-- <el-checkbox v-model="show.uuid">uuid</el-checkbox> -->
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading='loading'>
      <el-table-column fixed width='150' prop="token" label="Token">
      </el-table-column>
      <el-table-column width='150' prop="user" label="用户名">
      </el-table-column>
      <el-table-column width='150' prop="pw" label="密码">
      </el-table-column>
      <el-table-column width='150' prop="server" label="区服">
      </el-table-column>
      <el-table-column width='150' prop="role" label="角色名">
      </el-table-column>
      <el-table-column width='150' prop="appid" label="应用ID">
      </el-table-column>
      <el-table-column width='130' prop="ip" label="IP">
      </el-table-column>
      <el-table-column min-width='330' prop="AdvertisingIdentifier" label="IDFA">
      </el-table-column>
      <el-table-column width='150' prop="DeviceName" label="设备名称">
      </el-table-column>
      <el-table-column min-width='330' v-if="show.uuid" prop="uuid" label="uuid">
      </el-table-column>
      <el-table-column width='150' v-if="show.DeviceCategory" prop="DeviceCategory" label="设备类型">
      </el-table-column>
      <el-table-column width='150' v-if="show.CountryCode" prop="CountryCode" label="国家">
      </el-table-column>
      <el-table-column width='150' v-if="show.SerialNumber" prop="SerialNumber" label="安全码">
      </el-table-column>
      <el-table-column min-width='330' v-if="show.EthernetIPv6Address" prop="EthernetIPv6Address" label="ipv6">
      </el-table-column>
      <el-table-column width='150' v-if="show.EthernetIPv4Address" prop="EthernetIPv4Address" label="ipv4">
      </el-table-column>
      <el-table-column width='150' v-if="show.ProductModel" prop="ProductModel" label="设备模型">
      </el-table-column>
      <el-table-column width='150' v-if="show.EthernetBSSID" prop="EthernetBSSID" label="网络SSID">
      </el-table-column>
      <el-table-column width='150' v-if="show.RegionCode" prop="RegionCode" label="注册区域">
      </el-table-column>
      <el-table-column width='150' v-if="show.ProductType" prop="ProductType" label="商品类型">
      </el-table-column>
      <el-table-column width='150' v-if="show.BluetoothAddress" prop="BluetoothAddress" label="蓝牙地址">
      </el-table-column>
      <el-table-column min-width='350' v-if="show.InverseDeviceID" prop="InverseDeviceID" label="反向设备标识">
      </el-table-column>
      <el-table-column width='150' v-if="show.MEID" prop="MEID" label="MEID">
      </el-table-column>
      <el-table-column width='150' v-if="show.EthernetMacAddress" prop="EthernetMacAddress" label="MAC地址">
      </el-table-column>
      <el-table-column min-width='370' v-if="show.UniqueIdentifier" prop="UniqueIdentifier" label="唯一标识">
      </el-table-column>
      <el-table-column min-width='330' v-if="show.UniqueDeviceID" prop="UniqueDeviceID" label="UDID">
      </el-table-column>
      <el-table-column min-width='330' v-if="show.ICCID" prop="ICCID" label="ICCID">
      </el-table-column>
      <el-table-column width='100' v-if="show.ProductHWModel" prop="ProductHWModel" label="硬件模型">
      </el-table-column>
      <el-table-column width='50' v-if="show.ISOCountryCode" prop="ISOCountryCode" label="标准国家码">
      </el-table-column>
      <el-table-column width='100' v-if="show.RegionInfo" prop="RegionInfo" label="发行地区">
      </el-table-column>
      <el-table-column min-width='200' v-if="show.MLBSerialNumber" prop="MLBSerialNumber" label="MBL序列号">
      </el-table-column>
      <el-table-column min-width='350' v-if="show.IdentifierForVendor" prop="IdentifierForVendor" label="IDFV">
      </el-table-column>
      <el-table-column width='150' v-if="show.EthernetSSID" prop="EthernetSSID" label="WIFI名称">
      </el-table-column>
      <el-table-column width='100' v-if="show.CarrierName" prop="CarrierName" label="运营商">
      </el-table-column>
      <el-table-column width='150' v-if="show.IMSI" prop="IMSI" label="IMSI">
      </el-table-column>
      <el-table-column width='150' v-if="show.InternationalMobileEquipmentIdentity" prop="InternationalMobileEquipmentIdentity" label="国际移动装备辨别码">
      </el-table-column>
      <el-table-column width='150' v-if="show.ServiceString" prop="ServiceString" label="服务商标识码">
      </el-table-column>
      <el-table-column min-width='200' v-if="show.NetworkCode" prop="NetworkCode" label="网络码">
      </el-table-column>
      <el-table-column min-width='150' v-if="show.UniqueChipID" prop="UniqueChipID" label="UniqueChipID">
      </el-table-column>
    </el-table>
    <div class="page" v-if="page.recordCount > 15">
      <el-pagination @current-change='changePage' layout="prev, pager, next" :page-size='15' :total="page.recordCount" style='text-align: center; margin-top: 10px;'>
      </el-pagination>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      isSearchList:false,
      searchKey: "",
      page: {
        pageNumber: 1,
        recordCount: 10
      },
      tableData: [],
      show: {
        uuid: false,
        DeviceCategory: false,
        CountryCode: false,
        SerialNumber: false,
        EthernetIPv6Address: false,
        EthernetIPv4Address: false,
        ProductModel: false,
        EthernetBSSID: false,
        RegionCode: false,
        ProductType: false,
        BluetoothAddress: false,
        InverseDeviceID: false,
        MEID: false,
        EthernetMacAddress: false,
        UniqueIdentifier: false,
        UniqueDeviceID: false,
        ICCID: false,
        ProductHWModel: false,
        ISOCountryCode: false,
        RegionInfo: false,
        MLBSerialNumber: false,
        IdentifierForVendor: false,
        EthernetSSID: false,
        IMSI: false,
        CarrierName: false,
        InternationalMobileEquipmentIdentity: false,
        ServiceString: false,
        NetworkCode: false,
        UniqueChipID: false
      }
    };
  },
  methods: {
    searchKeys() {
      this.loading=true;
      var type = "ios";
      this.$api.Device.search(this.searchKey, this.page.pagenum, type, res => {
        this.loading=false;
        this.tableData = res.pager.dataList;
        this.isSearchList = false;
        this.page.recordCount = res.pager.pager.recordCount;
      });
    },
    getList() {
      this.loading=true;
      var type = "ios";
      this.$api.Device.list(this.page.pagenum, type, res => {
        //console.log(res);
        this.loading=false;
        this.tableData = res.pager.dataList;
        this.page.recordCount = res.pager.pager.recordCount;
      });
    },
    changePage(page) {
      this.page.pageNumber = page;
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
  /* display: flex; */
}
.head .search {
  width: 400px;
  margin-right: 35px;
}
.page {
  margin: 20px auto;
}
.filter {
  display: flex;
  border: 1px solid #eee;
  padding: 8px 0;
  position: relative;
}
</style>

