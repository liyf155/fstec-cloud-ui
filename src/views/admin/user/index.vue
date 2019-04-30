<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width:200px" class="filter-item" placeholder="用户名" v-model="listQuery.username" @keyup.enter.native="handleFilter">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>

    <!-- 表格 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.deptName}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roleList" v-bind:key="role.id">{{role.roleDesc}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.lockFlag | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="sys_user_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger" @click="deleteUser(scope.row)">删除
          </el-button>
          <el-button v-if="sys_user_edit" size="small" type="warning" @click="resetPasswd(scope.row)">重置密码
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 部门会话 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" :props="defaultProps" @node-click="fetchDeptRoleList" default-expand-all>
      </el-tree>
    </el-dialog>
    <!-- 用户信息会话 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" prop="deptName">
          <el-input v-model="form.deptName" placeholder="选择部门" @focus="fetchDeptTree()" readonly></el-input>
          <input type="hidden" v-model="form.deptId" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select class="filter-item" v-model="role" placeholder="请选择" multiple>
            <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="isDisabled[item.delFlag]">
              <span style="float: left">{{ item.roleDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="验证码登录使用"></el-input>
        </el-form-item>

        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="lockFlag">
          <el-select class="filter-item" v-model="form.lockFlag" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createUser('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updUser('form')">修 改</el-button>
        <el-button @click="cancel('form')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersByPage, getUser, addUser, updUser, delUser, resetPasswd } from '@/api/admin/user.js'
import { getDeptRoleList, getDeptTree } from '@/api/admin/role.js'
import waves from '@/directive/waves/index.js' // 水波纹
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'

export default {
  componets: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_user',
  directives: {
    waves
  },
  data() {
    return {
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20
      },
      role: [],
      form: {
        username: undefined,
        password: undefined,
        lockFlag: undefined,
        deptId: undefined,
        phone: undefined
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度在11 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['0', '1'],
      rolesOptions: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      userAdd: false,
      userUpdate: false,
      userDelete: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '有效',
        1: '无效',
        2: '锁定'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchUsersByPage()
    this.sys_user_add = this.permissions['sys_user_add']
    this.sys_user_edit = this.permissions['sys_user_edit']
    this.sys_user_del = this.permissions['sys_user_del']
  },
  methods: {
    /**
     * 获取用户列表
     */
    fetchUsersByPage() {
      this.listLoading = true
      this.listQuery.isAsc = false
      getUsersByPage(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    /**
     * 获取部门角色列表
     */
    fetchDeptRoleList(data) {
      this.dialogDeptVisible = false
      this.form.deptId = data.id
      this.form.deptName = data.name
      getDeptRoleList().then(res => {
        this.rolesOptions = res.data
      })
    },
    /**
     * 获取部门层级结构
     */
    fetchDeptTree() {
      getDeptTree().then(res => {
        this.treeDeptData = res.data
        this.dialogDeptVisible = true
      })
    },
    /**
     * 分页
     */
    handleFilter() {
      this.listQuery.current = 1
      this.fetchUsersByPage()
    },
    /**
     * 每页大小
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.fetchUsersByPage()
    },
    /**
     * 当前页码
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.fetchUsersByPage()
    },
    /**
     * 清除输入框
     */
    resetTemp() {
      this.role = []
      this.form = {
        id: undefined,
        username: '',
        password: '',
        role: [],
        delFlag: '',
        deptId: '',
        phone: ''
      }
    },
    /**
     * 用户弹出框
     */
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getUser(row.userId).then(res => {
        this.form = res.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        this.role = []
        for (var i = 0; i < row.roleList.length; i++) {
          this.role[i] = row.roleList[i].roleId
        }
        getDeptRoleList(res.data.deptId).then(res => {
          this.rolesOptions = res.data
        })
      })
    },
    /**
     * 添加用户
     */
    createUser(formName) {
      const set = this.$refs
      this.form.role = this.role
      set[formName].validate(valid => {
        if (valid) {
          addUser(this.form).then(() => {
            this.dialogFormVisible = false
            this.fetchUsersByPage()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    updUser(formName) {
      const set = this.$refs
      this.form.role = this.role
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updUser(this.form).then(() => {
            this.dialogFormVisible = false
            this.fetchUsersByPage()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    deleteUser(row) {
      this.$confirm(
        '此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delUser(row.userId)
          .then(() => {
            this.fetchUsersByPage()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
          .cache(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
      }).catch(() => {
      })
    },
    resetPasswd(row) {
      this.$confirm('将用户：' + row.username + ' 的密码恢复为默认值？', '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        resetPasswd(row.userId).then(() => {
          this.fetchUsersByPage()
          this.$notify({
            title: '成功',
            message: '重置密码成功',
            type: 'success',
            duration: 3000
          })
        }).cache(() => {
          this.$notify({
            title: '失败',
            message: '重置密码失败',
            type: 'error',
            duration: 3000
          })
        })
      })
    }
  }
}
</script>
