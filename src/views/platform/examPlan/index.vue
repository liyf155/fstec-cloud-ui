<template>
  <div class="app-container calendar-list-container" v-if="!planExamineeDialogVisible">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="考试计划名称" v-model="listQuery.planName"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="pf_examPlan_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="计划名称">
        <template slot-scope="scope">
          <span>{{scope.row.planName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考试时间">
        <template slot-scope="scope">
          <span v-if="scope.row.beginTime">{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} 至 {{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          <span v-else>- 至 -</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点编辑" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.examNodeCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场编辑" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.roomCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考生编辑" width="100px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handlePlanExaminee(scope.row)"><span>{{scope.row.examineeCount}}</span></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="安装日期" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.installDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="pf_examPlan_edit" size="small" type="success" @click="handleUpdate(scope.row)" >编辑</el-button>
          <el-button v-if="pf_examPlan_del" size="small" type="danger" @click="deleteExamPlan(scope.row)" >删除</el-button>
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
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="安装日期" prop="installDate">
          <el-date-picker v-model="form.installDate" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createExamPlan('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateExamPlan('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-else>
    <!-- 考生编辑会话 -->
    <PlanExaminee :planId="currentPlanId" @closePlanExamineeDialog="closePlanExamineeDialog" ref="planExamineeClient"></PlanExaminee>
  </div>
</template>

<script>
import {
  getExamPlansByPage,
  addExamPlan,
  getExamPlan,
  delExamPlan,
  updExamPlan
} from '@/api/platform/examPlan'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examPlan',
  components: {
    'PlanExaminee': () => import('./planExaminee')
  },
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planState: 0,
        deleteState: 0,
        checkItemSize: 0,
        examCount: 0,
        roundCount: 0,
        examNodeCount: 0,
        roomCount: 0,
        paperZipCount: 0,
        computerCount: 0,
        examineeCount: 0,
        beginTime: undefined,
        endTime: undefined,
        installDate: undefined,
        createTime: undefined,
        creatorId: undefined,
        appVersion: undefined,
        planName: undefined,
        creatorName: undefined
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
      planExamineeDialogVisible: false,
      dialogStatus: '',
      pf_examPlan_add: false,
      pf_examPlan_del: false,
      pf_examPlan_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.pf_examPlan_add = this.permissions['pf_examPlan_add']
    this.pf_examPlan_edit = this.permissions['pf_examPlan_edit']
    this.pf_examPlan_del = this.permissions['pf_examPlan_del']
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
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getExamPlansByPage(this.listQuery).then(response => {
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
      getExamPlan(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamPlan(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamPlan(row.id).then(() => {
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
    createExamPlan(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamPlan(this.form).then(() => {
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
    updateExamPlan(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamPlan(this.form).then(() => {
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
        planState: 0,
        deleteState: 0,
        checkItemSize: 0,
        examCount: 0,
        roundCount: 0,
        examNodeCount: 0,
        roomCount: 0,
        paperZipCount: 0,
        computerCount: 0,
        examineeCount: 0,
        beginTime: undefined,
        endTime: undefined,
        installDate: undefined,
        createTime: undefined,
        creatorId: undefined,
        appVersion: undefined,
        planName: undefined,
        creatorName: undefined
      }
    },
    handlePlanExaminee(row) {
      this.currentPlanId = row.id
      this.planExamineeDialogVisible = true
    },
    closePlanExamineeDialog() {
      this.currentPlanId = ''
      this.planExamineeDialogVisible = false
      this.getList()
    }
  }
}
</script>
