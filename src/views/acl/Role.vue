<template>
    <section>
        <div class='top-bar'>
            <el-button type="success" plain icon="el-icon-fa-plus" @click="addRole" size="small">添加角色</el-button>
            <el-input placeholder="请输入内容" v-model="searchKey" prefix-icon="el-icon-fa-search" style='width: 300px;' size='small'>
                <div slot="append">
                    <el-button type="primary" icon="el-icon-fa-search"
                                @click=" pager.pager.pageNumber = 1 ;doSearch()"></el-button>
                </div>
            </el-input>
        </div>
        <el-table :data="pager.dataList" border stripe style="width: 100%" v-loading='loading'>
            <el-table-column prop="id" label="ID" header-align="center" align="center" width="55">
            </el-table-column>
            <el-table-column prop="name" label="名称" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip header-align="center" align="center" width='120'>
                <template slot-scope="scope">
                    <el-tag :type="scope.row.installed  ? 'success' : 'danger'" close-transition>{{scope.row.installed ?
                        '内置' : '自由'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip header-align="center" align="center" width='220'>
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button title="编辑角色" size="mini" type="primary" icon="el-icon-fa-edit"
                                   @click="handleEdit(scope.$index,scope.row)"></el-button>
                        <el-button title="删除角色" v-if="!scope.row.installed" size="mini" type="primary"
                                   icon="el-icon-fa-trash" @click="handleDelete(scope.$index,scope.row)"></el-button>
                        <el-button title="操作授权" size="mini" type="primary" icon="el-icon-fa-bolt"
                                   @click="handleGrant(scope.$index,scope.row)"></el-button>
                        <el-button title="菜单授权" size="mini" type="primary" icon="el-icon-fa-bars" v-if='scope.row.name != "admin"'
                                   @click="handleMenu(scope.$index,scope.row)"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination small style='text-align: center; margin-top: 10px;' layout="prev, pager, next"
                        :total="pager.pager.recordCount" :page-size="pager.pager.pageSize"
                        :current-page.sync="pager.pager.pageNumber" v-show="pager.pager.recordCount > 15"
                        @current-change="changePage">
        </el-pagination>
        <!-- 弹框区域-->
        <el-dialog :title="role.id == 0 ? '添加角色' : '编辑角色' " :visible.sync="addEditShow" width="30%">
            <el-form :model="role" :rules="$rules" ref="roleForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="role.name" auto-complete="off" placeholder="请填写角色名称"
                              suffix-icon="el-icon-fa-vcard"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input type="textarea" :maxlength="500"
                              :autosize="{ minRows: 4, maxRows: 8}" v-model="role.description" auto-complete="off"
                              placeholder="请填写角色描述" suffix-icon="el-icon-fa-file-word-o"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEditShow = false ; user = {installed:false}">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateRole('roleForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置权限" :visible.sync="grantShow" :width="dialogWidth">
            <template>
                <el-transfer v-model="selected" :data="options" :titles="['待选项', '已选项']" filterable></el-transfer>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="grantShow = false">取 消</el-button>
                <el-button type="primary" @click="grant">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置菜单" @close='menuShow = false' :visible="menuShow" :width="dialogWidth">
            <template v-if='menuShow'>
                <el-tree
                    ref='menu'
                    :props="menuProps"
                    :load="loadNode"
                    node-key="id"
                    lazy
                    :default-expanded-keys="expandedKeys"
                    :default-checked-keys="checkedKeys"
                    show-checkbox>
                </el-tree>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="menuShow = false">取 消</el-button>
                <el-button type="primary" @click="saveMenu">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                loading: true,
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
                options: [],
                addEditShow: false,
                grantShow: false,
                role: {
                    id: 0,
                    name: "",
                    description: "",
                    installed: false
                },
                formLabelWidth: "120px",
                menuProps: {
                    label: 'key',
                    children: 'sub'
                },
                menuShow: false,
                menuList: [],
                menuSelect: [],
                expandedKeys: [],
                checkedKeys: []
            };
        },
        computed: {
            dialogWidth() {
                return 590 * 100 / this.$utils.windowWidth() + "%";
            }
        },
        watch: {
            options: function () {
                this.selected = [];
                this.options.forEach(item => {
                    if (item.selected) {
                        this.selected.push(item.key);
                    }
                });
            }
        },
        methods: {
            addRole() {
                this.role = {
                    id: 0,
                    name: "",
                    description: "",
                    installed: false
                };
                this.addEditShow = true;
            },
            grant() {
                this.$api.Role.grant(this.role.id, this.selected, result => {
                    this.$message({
                        type: "success",
                        message: "授权成功!"
                    });
                    window.setTimeout(() => {
                        this.grantShow = false;
                    }, 2000);
                });
            },
            changePage() {
                if (this.searchKey) {
                    this.doSearch();
                } else {
                    this.loadData();
                }
            },
            doSearch() {
                this.$api.Role.search(
                    this.pager.pager.pageNumber,
                    this.searchKey,
                    result => {
                        this.pager = result.pager;
                    }
                );
            },
            saveOrUpdateRole(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var callback = result => {
                            this.changePage();
                            this.addEditShow = false;
                        };
                        this.role.id
                            ? this.$api.Role.update(this.role, callback)
                            : this.$api.Role.save(this.role, callback);
                    } else {
                        return false;
                    }
                });
            },
            handleEdit(index, row) {
                this.role = row;
                this.addEditShow = true;
            },
            handleGrant(index, row) {
                this.role.id = row.id;
                this.$api.Role.roleGrantInfo(row.id, result => {
                    this.options = [];
                    result.infos.forEach((item, index) => {
                        this.options.push({
                            key: item.id,
                            label: item.description,
                            selected: item.selected
                        });
                    });
                    this.grantShow = true;
                });
            },
            loadNode(node, resolve) {
                if(node.level == 0) {
                    return resolve(this.menuList)
                }
                else if(node.level == 1) {
                    let id = node.data.id
                    this.$api.CodeBook.sub(id, res => {
                        let sub = res.codes.map((j) => {
                            j.key= j.name
                            return j
                        })
                        this.menuList = this.menuList.map((i) => {
                            if(i.id == id) {
                                i.sub = sub
                            }
                            return i
                        })
                        setTimeout(() => {
                            resolve(sub)
                        }, 500)
                    })
                }
                else {
                    return resolve([])
                }
            },
            handleMenu(index, row) {
                this.role.id = row.id
                this.$api.Role.menuList(res => {
                    this.menuList = []
                    res.codes.forEach((i) => {
                        this.menuList.push({
                            id: i.id,
                            key: i.name,
                            value: i.value,
                            pid: i.parentId,
                            sub: []
                        })
                    })
                    this.$api.Role.roleMenuList(row.id, res => {
                        this.expandedKeys = []
                        this.checkedKeys = []
                        if(res.menus) {
                            res.menus.forEach((i) => {
                                this.expandedKeys.push(i.id)
                                i.child.forEach((j) => {
                                    this.checkedKeys.push(j.id)
                                })
                            })
                        }
                        this.menuShow = true
                    })
                })
            },
            saveMenu() {
                let roleId = this.role.id
                let pNodes = []
                let selectedList = []
                let cN = {}
                let pids = []
                this.$refs.menu.getCheckedNodes().forEach((i) => {
                    if(i.sub && i.sub.length == 0) {
                        pNodes.push(i.id)
                    }
                    else if(!i.sub) {
                        if(!cN[i.parentId]) {
                            cN[i.parentId] = new Array(i)
                            pids.push(i.parentId)
                        }
                        else {
                            cN[i.parentId].push(i)
                        }
                    }
                })
                this.menuList.forEach((i) => {
                    let obj = {
                        child: [],
                        key: i.key,
                        value: i.value,
                        pid: i.pid,
                        id: i.id
                    }
                    if(pids.indexOf(i.id) >= 0) {
                        obj.child = cN[i.id]
                        selectedList.push(obj)
                    }
                    if(pNodes.indexOf(i.id) >= 0) {
                        selectedList.push(obj)
                    }
                })
                if(pNodes.length > 0) {
                    pNodes.forEach((k) => {
                        this.$api.CodeBook.sub(k, res => {
                            let sub = res.codes.map((j) => {
                                            j.key= j.name
                                            return j
                                        })
                            selectedList = selectedList.map((i) =>{
                                if(i.id == k) {
                                    i.child = sub
                                }
                                return i
                            })
                        })
                    })
                    setTimeout(() => {
                        selectedList = JSON.stringify(selectedList)
                        this.$api.Role.roleMenu(roleId, selectedList, res => {
                            if(res) {
                                this.$message.success('菜单授权成功~！')
                            }
                            this.menuShow = false
                        })
                    }, 1000)
                }
                else {
                    selectedList = JSON.stringify(selectedList)
                    this.$api.Role.roleMenu(roleId, selectedList, res => {
                        if(res) {
                            this.$message.success('菜单授权成功~！')
                        }
                        this.menuShow = false
                    })
                }
            },
            handleDelete(index, row) {
                this.$confirm("确认删除角色?", "删除确认", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$api.Role.delete(row.id, result => {
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
                this.$api.Role.list(this.pager.pager.pageNumber, result => {
                    this.pager = result.pager;
                    this.loading = false
                });
            }
        },
        created: function () {
            this.loadData();
        }
    };
</script>
<style scoped>
.top-bar{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
</style>
