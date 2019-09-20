<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item label="考试计划:">
              <exam-plan @examPlanChange="getList"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
              <el-button v-if="bd_examPaper_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
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
      <el-table-column align="center" label="考点编码">
        <template slot-scope="scope">
          <span>{{scope.row.nodeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目编码">
        <template slot-scope="scope">
          <span>{{scope.row.subjectCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目名称">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷袋计划数">
        <template slot-scope="scope">
          <span>{{scope.row.bagCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷袋出库数">
        <template slot-scope="scope">
          <span>{{scope.row.outedCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷袋回收数">
        <template slot-scope="scope">
          <span>{{scope.row.recycleCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="答题卡计划数">
        <template slot-scope="scope">
          <span>{{scope.row.cardCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="答题卡出库数">
        <template slot-scope="scope">
          <span>{{scope.row.outedCardCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="答题卡回收数">
        <template slot-scope="scope">
          <span>{{scope.row.recycleCardCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷箱数">
        <template slot-scope="scope">
          <span>{{scope.row.boxCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷箱回收数">
        <template slot-scope="scope">
          <span>{{scope.row.boxRecycleCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出库状态">
        <template slot-scope="scope">
          <span>{{scope.row.receiveStatus | paperStatusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回收状态">
        <template slot-scope="scope">
          <span>{{scope.row.recycleStatus | recycleStatusFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出库人">
        <template slot-scope="scope">
          <span>{{scope.row.outerName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="回收人">
        <template slot-scope="scope">
          <span>{{scope.row.recyclerName}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_examPaper_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_examPaper_del"
            size="small"
            type="danger"
            @click="deleteExamPaper(scope.row)"
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
        <el-form-item label="考点名称" prop="nodeName">
          <el-select class="filter-item" v-model="form.nodeId" filterable placeholder="请选择考点" style="width: 400px">
            <el-option v-for="node in planNodes" :key="node.nodeId" :label="node.nodeName" :value="node.nodeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试场次" prop="roundId">
          <el-select class="filter-item" v-model="form.roundId" filterable placeholder="请选择考试场次" style="width: 400px">
            <el-option v-for="round in examRounds" :key="round.id" :label="formatRoundTime(round.beginTime, round.endTime)" :value="round.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考点编码" prop="nodeCode">
          <el-input v-model="form.nodeCode" placeholder="请输入考点编码"></el-input>
        </el-form-item>
        <el-form-item label="科目编码" prop="subjectCode">
          <el-input v-model="form.subjectCode" placeholder="请输入科目编码"></el-input>
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="form.subjectName" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item label="试卷袋计划数" prop="bagCount">
          <el-input v-model="form.bagCount" placeholder="请输入试卷袋计划数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createExamPaper('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateExamPaper('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamPapersByPage,
  addExamPaper,
  getExamPaper,
  delExamPaper,
  updExamPaper
} from '@/api/bigdata/examPaper'
import {
  getRoundsByPlanId
} from '@/api/platform/examRound'
import {
  getPlanNodesByPlanId
} from '@/api/platform/planNode'
import {
  parseTime
} from '@/util/util'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examPaper',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        administrativeId: undefined,
        administrativeName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        roundId: undefined,
        nodeCode: undefined,
        subjectId: undefined,
        subjectCode: undefined,
        subjectName: undefined,
        bagCount: 0,
        outedCount: 0,
        recycleCount: 0,
        cardCount: 0,
        outedCardCount: 0,
        recycleCardCount: 0,
        boxCount: 0,
        boxRecycleCount: 0,
        receiveStatus: 0,
        recycleStatus: 0
      },
      planId: '',
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
      bd_examPaper_add: false,
      bd_examPaper_del: false,
      bd_examPaper_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      examRounds: [],
      planNodes: []
    }
  },
  created() {
    this.bd_examPaper_add = this.permissions['bd_examPaper_add']
    this.bd_examPaper_edit = this.permissions['bd_examPaper_edit']
    this.bd_examPaper_del = this.permissions['bd_examPaper_del']
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
    recycleStatusFilter(status) {
      // 0 未清点 1 已清点 2 已回收
      const statusMap = {
        0: '未清点',
        1: '已清点',
        2: '已回收'
      }
      return statusMap[status]
    },
    paperStatusFilter(status) {
      // -1 异常 0 未出库 1 运送途中 2 已到达考点
      const statusMap = {
        4: '异常',
        0: '未出库',
        1: '运送中',
        2: '已到达'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList(planId) {
      this.planId = planId
      this.listQuery.planId = planId
      this.listLoading = true
      getExamPapersByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList(this.planId)
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList(this.planId)
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList(this.planId)
    },
    handleCreate() {
      this.resetTemp()
      this.getAllExamRounds()
      this.getAllPlanNodes()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.getAllExamRounds()
      this.getAllPlanNodes()
      getExamPaper(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamPaper(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamPaper(row.id).then(() => {
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
    createExamPaper(formName) {
      this.form.planId = this.planId
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamPaper(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(this.planId)
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
    updateExamPaper(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamPaper(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(this.planId)
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
        planId: undefined,
        administrativeId: undefined,
        administrativeName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        roundId: undefined,
        nodeCode: undefined,
        subjectId: undefined,
        subjectCode: undefined,
        subjectName: undefined,
        bagCount: 0,
        outedCount: 0,
        recycleCount: 0,
        cardCount: 0,
        outedCardCount: 0,
        recycleCardCount: 0,
        boxCount: 0,
        boxRecycleCount: 0,
        receiveStatus: 0,
        recycleStatus: 0
      }
    },
    getAllExamRounds() {
      getRoundsByPlanId(this.planId).then(res => {
        this.examRounds = res.data
      })
    },
    formatRoundTime(beginTime, endTime) {
      return parseTime(beginTime, '{y}-{m}-{d} {h}:{i}') + ' 至 ' + parseTime(endTime, '{y}-{m}-{d} {h}:{i}')
    },
    getAllPlanNodes() {
      getPlanNodesByPlanId(this.planId).then(res => {
        this.planNodes = res.data
      })
    }
  }
}
</script>
