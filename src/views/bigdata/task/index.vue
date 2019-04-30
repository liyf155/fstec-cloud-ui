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
                v-model="listQuery.name"
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
              v-if="bd_task_add"
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
      style="width: 99%">
      <el-table-column align="center" label="任务名称" width="250px">
        <template slot-scope="scope" show-overflow-tooltip>
          <span>{{scope.row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务阶段" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.examPhase | phaseFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成情况" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.completeCount}}/{{scope.row.unCompleteCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成状态" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.completeStatus | completeStatusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务描述" width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.templateDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务开始时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务结束时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            v-if="bd_task_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="width:100%">
      <createTask @closeTaskStep="closeTaskStep" ref="traineeClient"></createTask>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTasksByPage,
  getTask,
  delTask
} from '@/api/bigdata/task'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  components: {
    'createTask': () => import('./createTask')
  },
  name: 'task',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        templateId: undefined,
        complateStatus: undefined,
        enable: undefined,
        sort: undefined,
        createTime: undefined,
        createBy: '',
        planId: '',
        delFlag: '0',
        unCompleteCount: 0,
        completeCount: 0,
        beginTime: undefined,
        endTime: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined
      },
      dialogFormVisible: false,
      taskStepDialogVisible: false,
      dialogStatus: '',
      bd_task_add: false,
      bd_task_del: false,
      bd_task_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.bd_task_add = this.permissions['bd_task_add']
    this.bd_task_edit = this.permissions['bd_task_edit']
    this.bd_task_del = this.permissions['bd_task_del']
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
    completeStatusFilter(val) {
      const completeMap = {
        0: '未执行',
        1: '执行中',
        2: '执行完毕'
      }
      return completeMap[val]
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getTasksByPage(this.listQuery).then(response => {
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
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getTask(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteTask(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTask(row.id).then(() => {
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
    // updateTask(formName) {
    //   const set = this.$refs
    //   set[formName].validate(valid => {
    //     if (valid) {
    //       this.dialogFormVisible = false
    //       updTask(this.form.id, this.form).then(() => {
    //         this.dialogFormVisible = false
    //         this.getList()
    //         this.$notify({
    //           title: '成功',
    //           message: '创建成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // },
    closeTaskStep() {
      this.dialogFormVisible = false
      this.getList()
    }
  }
}
</script>
