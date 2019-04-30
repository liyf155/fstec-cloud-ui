<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <el-input
                style="width:200px"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.templateName"
                @keyup.enter.native="handleFilter"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button
              class="filter-item"
              type="primary"
              v-waves
              icon="el-icon-search"
              @click="handleFilter"
            >搜索</el-button>
            <el-button
              v-if="bd_taskTemplate_add"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="handleCreate"
            >添加</el-button>
          </el-col>
        </el-row>
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
      <el-table-column align="center" label="任务名称">
        <template slot-scope="scope">
          <span>{{scope.row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考试阶段">
        <template slot-scope="scope">
          <span>{{scope.row.examPhase | phaseFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.templateDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考试类型">
        <template slot-scope="scope">
          <span>{{scope.row.examType | examTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="400px" show-overflow-tooltip="">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_taskTemplate_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_taskTemplate_del"
            size="small"
            type="danger"
            @click="deleteTaskTemplate(scope.row)"
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="任务名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="考试阶段" prop="examPhase">
          <el-radio-group v-model="form.examPhase">
            <el-radio label="0">考前</el-radio>
            <el-radio label="1">考中</el-radio>
            <el-radio label="2">考后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考试类型" prop="examType">
          <el-radio-group v-model="form.examType">
            <el-radio label="0">计算机考试</el-radio>
            <el-radio label="1">纸笔考试</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务描述" prop="templateDesc">
          <el-input v-model="form.templateDesc" placeholder="请输入任务描述"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createTaskTemplate('form')" >确 定</el-button>
        <el-button v-else type="primary" @click="updateTaskTemplate('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTaskTemplatesByPage,
  addTaskTemplate,
  getTaskTemplate,
  delTaskTemplate,
  updTaskTemplate
} from '@/api/bigdata/taskTemplate'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'taskTemplate',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        id: '',
        templateName: '',
        examPhase: '0',
        templateDesc: '',
        examType: '0',
        delFlag: 0
      },
      rules: {
        templateName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
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
        templateName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      bd_taskTemplate_add: false,
      bd_taskTemplate_del: false,
      bd_taskTemplate_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.bd_taskTemplate_add = this.permissions['bd_taskTemplate_add']
    this.bd_taskTemplate_edit = this.permissions['bd_taskTemplate_edit']
    this.bd_taskTemplate_del = this.permissions['bd_taskTemplate_del']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '正常',
        1: '锁定'
      }
      return statusMap[status]
    },
    phaseFilter(val) {
      const phaseMap = {
        0: '考前',
        1: '考中',
        2: '考后'
      }
      return phaseMap[val]
    },
    examTypeFilter(val) {
      const examTypeMap = {
        0: '计算机考试',
        1: '纸笔考试'
      }
      return examTypeMap[val]
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getTaskTemplatesByPage(this.listQuery).then(response => {
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
      getTaskTemplate(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteTaskTemplate(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTaskTemplate(row.id).then(() => {
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
    createTaskTemplate(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addTaskTemplate(this.form).then(() => {
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
    updateTaskTemplate(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updTaskTemplate(this.form).then(() => {
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
      this.form = {
        templateName: undefined,
        examPhase: '0',
        templateDesc: undefined,
        examType: '0',
        delFlag: 0
      }
    }
  }
}
</script>
