<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input
          style="width:200px"
          class="filter-item"
          placeholder="模糊查询"
          v-model="listQuery.postName"
          @keyup.enter.native="handleFilter"
        ></el-input>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <!-- <el-button
          v-if="bd_examPosition_add"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >添加</el-button> -->
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="正在加载..."
      border
      fit
      highlight-current-row
      style="width: 99%"
    >
      <el-table-column align="center" label="岗位名称">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位描述">
        <template slot-scope="scope">
          <span>{{scope.row.postDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用状态">
        <template slot-scope="scope">
          <span>{{scope.row.enableState | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_examPosition_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_examPosition_del"
            size="small"
            type="danger"
            @click="deleteExamPosition(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.current"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 部门会话 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" :props="defaultProps" @node-click="fetchDeptRoleList" default-expand-all>
      </el-tree>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述" prop="postDesc">
          <el-input v-model="form.postDesc" placeholder="请输入岗位描述"></el-input>
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
        <el-form-item label="启用状态" prop="enableState">
          <el-radio-group v-model="form.enableState">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建小程序" prop="miniPro">
          <el-radio-group v-model="form.miniPro">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createExamPosition('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateExamPosition('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamPositionsByPage,
  addExamPosition,
  getExamPosition,
  delExamPosition,
  updExamPosition
} from '@/api/bigdata/examPosition'
import { getDeptRoleList, getDeptTree } from '@/api/admin/role.js'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examPosition',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        postName: undefined,
        postDesc: undefined,
        enableState: 0,
        remark: undefined,
        sort: undefined,
        deptId: undefined,
        deptName: undefined,
        roleIds: undefined,
        miniPro: 0,
        role: []
      },
      role: [],
      rules: {
        postName: [
          {
            required: true,
            message: '请输入岗位名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        postName: undefined
      },
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      bd_examPosition_add: false,
      bd_examPosition_del: false,
      bd_examPosition_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      treeDeptData: [],
      rolesOptions: [],
      checkedKeys: [],
      isDisabled: {
        0: false,
        1: true
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
    this.bd_examPosition_add = this.permissions['bd_examPosition_add']
    this.bd_examPosition_edit = this.permissions['bd_examPosition_edit']
    this.bd_examPosition_del = this.permissions['bd_examPosition_del']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '启用',
        1: '禁用'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getExamPositionsByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getExamPosition(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        getDeptRoleList(response.data.deptId).then(res => {
          this.rolesOptions = res.data
          if (row.roleIds) {
            this.role = []
            const roleIdArr = row.roleIds.split(',')
            for (var i = 0; i < roleIdArr.length; i++) {
              for (var j = 0; j < res.data.length; j++) {
                if (roleIdArr[i].toString() === res.data[j].roleId.toString()) {
                  this.role[i] = res.data[j].roleId
                  break
                }
              }
            }
          }
        })
      })
    },
    deleteExamPosition(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamPosition(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    },
    createExamPosition(formName) {
      const set = this.$refs
      this.form.roleIds = this.role.toString()
      set[formName].validate(valid => {
        if (valid) {
          addExamPosition(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
      const set = this.$refs
      set[formName].resetFields()
    },
    updateExamPosition(formName) {
      const set = this.$refs
      this.form.roleIds = this.role.toString()
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamPosition(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp() {
      this.role = []
      this.form = {
        postName: undefined,
        postDesc: undefined,
        enableState: undefined,
        remark: undefined,
        sort: undefined,
        deptId: undefined,
        roleIds: undefined
      }
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
    }
  }
}
</script>
