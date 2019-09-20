<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-col :span="7">
          <el-form-item label="考试计划:">
            <el-select class="filter-item" v-model="planId" clearable placeholder="=== 请选择考试计划 ===" @change="examPlanChange" style="width:300px">
              <el-option v-for="plan in examPlans" :key="plan.id" :label="plan.planName" :value="plan.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="考点:">
            <el-select class="filter-item" v-model="listQuery.nodeId" clearable placeholder="=== 请选择考点 ===" @change="examNodeChange" style="width:270px">
              <el-option v-for="node in examNodes" :key="node.nodeId" :label="node.nodeName" :value="node.nodeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="考试科目:">
            <el-select class="filter-item" v-model="listQuery.subjectId" clearable placeholder="=== 请选择科目 ===" @change="subjectChange" style="width:270px">
              <el-option v-for="subject in subjects" :key="subject.id" :label="subject.subjectName" :value="subject.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-button
            class="filter-item"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>
          <el-button
            v-if="pf_rfidRecycleNode_add"
            class="filter-item"
            style="margin-left: 10px;"
            @click="initData"
            type="primary"
            icon="el-icon-plus"
          >初始化</el-button>
        </el-col>
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
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="考区名称">
        <template slot-scope="scope">
          <span>{{scope.row.administrativeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目名称">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已回收/全部">
        <template slot-scope="scope">
          <span>{{scope.row.recycleRoomCount}}/{{scope.row.totalRoomCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常考场">
        <template slot-scope="scope">
          <span>{{scope.row.recycleErrorCount}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            @click="showDetail(scope.row)"
          >明细</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="closeRoomDialog">
      <RfidRecycleRoom :recycleNodeId="recycleNodeId" @closeRoomDialog="closeRoomDialog"
        ref="RfidRecycleRoom"></RfidRecycleRoom>
    </el-dialog>
  </div>
</template>

<script>
import { getRfidRecycleNodesByPage, initRecycleData, getRfidSubjectList } from '@/api/platform/rfidRecycleNode'
import {
  getExamPlans
} from '@/api/platform/examPlan'
import {
  getPlanNodesByPage
} from '@/api/platform/planNode'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'rfidRecycleNode',
  directives: {
    waves
  },
  components: {
    'RfidRecycleRoom': () => import('./rfidRecycleRoom')
  },
  data() {
    return {
      form: {
        planId: undefined,
        administrativeId: undefined,
        administrativeName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        subjectId: undefined,
        subjectName: undefined,
        totalRoomCount: undefined,
        recycleRoomCount: undefined
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
      pf_rfidRecycleNode_add: false,
      pf_rfidRecycleNode_del: false,
      pf_rfidRecycleNode_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      dialogTitle: '',
      planId: '',
      nodeId: '',
      examPlans: [],
      examNodes: [],
      recycleNodeId: '',
      subjects: []
    }
  },
  created() {
    this.fetchExamPlans()
    this.pf_rfidRecycleNode_add = this.permissions['pf_rfidRecycleNode_add']
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
      if (this.planId) {
        this.listQuery.planId = this.planId
      }
      if (this.nodeId) {
        this.listQuery.nodeId = this.nodeId
      }
      this.listLoading = true
      getRfidRecycleNodesByPage(this.listQuery).then(response => {
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
    initData() {
      initRecycleData(this.planId).then(res => {
        this.$notify({
          title: '成功',
          message: '初始化数据成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    showDetail(row) {
      this.dialogFormVisible = true
      this.dialogTitle = row.nodeName + '-' + row.subjectName
      this.recycleNodeId = row.id
    },
    closeRoomDialog() {
      this.recycleNodeId = ''
      this.dialogFormVisible = false
    },
    fetchExamPlans() {
      // 获取考试计划
      getExamPlans().then(res => {
        this.examPlans = res.data
        this.planId = this.examPlans[0].id
        this.examPlanChange()
      })
    },
    getPlanNodes(planId) {
      this.examNodes = []
      const query = {
        current: 1,
        size: 1000,
        planId: planId
      }
      getPlanNodesByPage(query).then(res => {
        if (res.data) {
          this.examNodes = res.data.records
        }
      })
    },
    examPlanChange() {
      this.listQuery.planId = this.planId
      this.getPlanNodes(this.planId)
      this.fetchSubjects(this.planId)
      this.getList()
    },
    examNodeChange() {
      this.getList()
    },
    fetchSubjects(planId) {
      getRfidSubjectList(planId).then(res => {
        this.subjects = res.data
      })
    },
    subjectChange() {
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.recycleRoomCount !== 0) {
        if (row.recycleRoomCount === row.totalRoomCount) {
          return 'success-row'
        } if (row.recycleErrorCount !== 0) {
          return 'error-row'
        } else {
          return 'warning-row'
        }
      }
      if (row.recycleErrorCount !== 0) {
        return 'error-row'
      }
      return ''
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table .error-row {
    background: #f9ebeb;
  }
</style>
