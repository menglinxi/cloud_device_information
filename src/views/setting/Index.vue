<template>
    <section>
        <div class='top-bar'>
            <el-button type="success" plain icon="el-icon-fa-plus" @click="addSetting" size="small">添加配置</el-button>
            <el-input placeholder="请输入内容" v-model="searchKey" prefix-icon="el-icon-fa-search" style='width: 300px;' size='small'>
                <div slot="append">
                    <el-button type="primary" icon="el-icon-fa-search"
                                @click=" pager.pager.pageNumber = 1 ;doSearch()"></el-button>
                </div>
            </el-input>
        </div>

        <el-table :data="pager.dataList" border stripe style="width: 100%">
            <el-table-column prop="id" label="ID" header-align="center" align="center" width="55">
            </el-table-column>
            <el-table-column prop="name" label="名称" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="value" label="值" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button title="编辑配置" v-if="!scope.row.installed" size="mini" type="primary"
                                   icon="el-icon-fa-edit"
                                   @click="handleEdit(scope.$index,scope.row)"></el-button>
                        <el-button title="删除配置" v-if="!scope.row.installed" size="mini" type="primary"
                                   icon="el-icon-fa-trash" @click="handleDelete(scope.$index,scope.row)"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination small style="float:right" layout="prev, pager, next"
                        :total="pager.pager.recordCount" :page-size="pager.pager.pageSize"
                        :current-page.sync="pager.pager.pageNumber" v-show="pager.pager.pageCount > 10"
                        @current-change="changePage">
        </el-pagination>
        <!-- 弹框区域-->
        <el-dialog :title="Setting.id == 0 ? '添加配置' : '编辑配置' " :visible.sync="addEditShow" width="30%">
            <el-form :model="Setting" :rules="$rules" ref="SettingForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="Setting.name" auto-complete="off" placeholder="请填写配置名称"
                              suffix-icon="el-icon-fa-vcard"></el-input>
                </el-form-item>
                <el-form-item label="值" :label-width="formLabelWidth" prop="value">
                    <el-input v-model="Setting.value" auto-complete="off" placeholder="请填写配置值"
                              suffix-icon="el-icon-fa-terminal"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input type="textarea" :maxlength="500"
                              :autosize="{ minRows: 4, maxRows: 8}" v-model="Setting.description" auto-complete="off"
                              placeholder="请填写配置描述" suffix-icon="el-icon-fa-file-word-o"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEditShow = false ; user = {installed:false}">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateSetting('SettingForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<style scoped>
.top-bar{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
</style>
<script>
    export default {
        data() {
            return {
                searchKey: "",
                pager: {
                    pager: {
                        pageCount: 0,
                        pageNumber: 1,
                        pageSize: 15,
                        recordCount: 0
                    }
                },
                selected: [],
                addEditShow: false,
                Setting: {
                    id: 0,
                    name: "",
                    description: "",
                    installed: false
                },
                formLabelWidth: "120px"
            };
        },
        methods: {
            addSetting() {
                this.Setting = {
                    id: 0,
                    name: "",
                    description: "",
                    installed: false
                };
                this.addEditShow = true;
            },
            changePage() {
                if (this.searchKey) {
                    this.doSearch();
                } else {
                    this.loadData();
                }
            },
            doSearch() {
                this.$api.Setting.search(this.pager.pager.pageNumber, this.searchKey, result => {
                    this.pager = result.pager;
                });
            },
            saveOrUpdateSetting(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var callback = result => {
                            this.changePage();
                            this.addEditShow = false;
                        };
                        this.Setting.id
                            ? this.$api.Setting.update(this.Setting, callback)
                            : this.$api.Setting.save(this.Setting, callback);
                    } else {
                        return false;
                    }
                });
            },
            handleEdit(index, row) {
                this.Setting = row;
                this.addEditShow = true;
            },
            handleDelete(index, row) {
                this.$confirm("确认删除配置?", "删除确认", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$api.Setting.delete(row.id, result => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        window.setTimeout(() => {
                            this.changePage();
                        }, 2000);
                    });
                });
            },
            loadData() {
                this.$api.Setting.list(this.pager.pager.pageNumber, result => {
                    this.pager = result.pager;
                });
            }
        },
        created: function () {
            this.loadData();
        }
    };
</script>