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
              v-if="bd_taskDetail_add"
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
      <el-table-column align="center" label="责任人">
        <template slot-scope="scope">
          <span>{{scope.row.workerName}}</span>
        </template>
      </el-table-column>
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
      <el-table-column align="center" label="岗位">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务开始时间" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务结束时间" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成状态">
        <template slot-scope="scope">
          <span>{{scope.row.completeStatus | completeStatusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>      
      <el-table-column align="center" label="问题反馈">
        <template slot-scope="scope">
          <span>{{scope.row.feedback}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="整改措施" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.handleMethod}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_taskDetail_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_taskDetail_del"
            size="small"
            type="danger"
            @click="deleteTaskDetail(scope.row)"
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
        <el-form-item label="完成状态" prop="completeStatus">
          <el-input v-model="form.completeStatus" placeholder="请输入完成状态"></el-input>
        </el-form-item>
        <el-form-item label="问题反馈" prop="feedback">
          <el-input v-model="form.feedback" placeholder="请输入问题反馈"></el-input>
        </el-form-item>
        <el-form-item label="整改措施" prop="column13">
          <el-input v-model="form.handleMethod" placeholder="请输入整改措施"></el-input>
        </el-form-item>
        <el-form-item label="其他说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入其他说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createTaskDetail('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateTaskDetail('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTaskDetailsByPage,
  addTaskDetail,
  getTaskDetail,
  delTaskDetail,
  completeTask
} from '@/api/bigdata/taskDetail'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'taskDetail',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        taskId: undefined,
        stationId: undefined,
        stationName: undefined,
        executorId: undefined,
        executor: undefined,
        completeStatus: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        feedback: undefined,
        handleMethod: undefined,
        remark: undefined,
        delFlag: undefined,
        nodeId: undefined,
        nodeName: undefined
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
      dialogStatus: '',
      bd_taskDetail_add: false,
      bd_taskDetail_del: false,
      bd_taskDetail_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.bd_taskDetail_add = this.permissions['bd_taskDetail_add']
    this.bd_taskDetail_edit = this.permissions['bd_taskDetail_edit']
    this.bd_taskDetail_del = this.permissions['bd_taskDetail_del']
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
      getTaskDetailsByPage(this.listQuery).then(response => {
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
      getTaskDetail(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteTaskDetail(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTaskDetail(row.id).then(() => {
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
    createTaskDetail(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addTaskDetail(this.form).then(() => {
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
    updateTaskDetail(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          completeTask(this.form).then(() => {
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
        taskId: undefined,
        stationId: undefined,
        stationName: undefined,
        executorId: undefined,
        executor: undefined,
        completeStatus: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        feedback: undefined,
        handleMethod: undefined,
        remark: undefined,
        delFlag: undefined,
        nodeId: undefined,
        nodeName: undefined
      }
    }
  }
}
</script>
