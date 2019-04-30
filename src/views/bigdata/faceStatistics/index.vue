<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="7">
            <el-form-item label="考试计划:">
              <exam-plan @examPlanChange="getList"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="考点名称:">
              <el-input
                style="width:200px"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.nodeName"
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
            <!-- <el-button
              v-if="bd_faceStatistics_add"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="handleCreate"
            >添加</el-button> -->
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
      <el-table-column align="center" label="考区名称">
        <template slot-scope="scope">
          <span>{{scope.row.administrativeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称" width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报名人数">
        <template slot-scope="scope">
          <span>{{scope.row.signCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参考人数">
        <template slot-scope="scope">
          <span>{{scope.row.enterCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参考率">
        <template slot-scope="scope">
          <span>{{scope.row.enterRate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通过率">
        <template slot-scope="scope">
          <span>{{scope.row.passRate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通过人数">
        <template slot-scope="scope">
          <span>{{scope.row.passCount}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_faceStatistics_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_faceStatistics_del"
            size="small"
            type="danger"
            @click="deleteFaceStatistics(scope.row)"
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
        <el-form-item label="考试计划ID" prop="planId">
          <el-input v-model="form.planId" placeholder="请输入考试计划ID"></el-input>
        </el-form-item>
        <el-form-item label="场次ID" prop="roundId">
          <el-input v-model="form.roundId" placeholder="请输入场次ID"></el-input>
        </el-form-item>
        <el-form-item label="考区ID" prop="administrativeId">
          <el-input v-model="form.administrativeId" placeholder="请输入考区ID"></el-input>
        </el-form-item>
        <el-form-item label="考区名称" prop="administrativeName">
          <el-input v-model="form.administrativeName" placeholder="请输入考区名称"></el-input>
        </el-form-item>
        <el-form-item label="考点ID" prop="nodeId">
          <el-input v-model="form.nodeId" placeholder="请输入考点ID"></el-input>
        </el-form-item>
        <el-form-item label="考点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
        </el-form-item>
        <el-form-item label="报名人数" prop="signCount">
          <el-input v-model="form.signCount" placeholder="请输入报名人数"></el-input>
        </el-form-item>
        <el-form-item label="参考人数" prop="enterCount">
          <el-input v-model="form.enterCount" placeholder="请输入参考人数"></el-input>
        </el-form-item>
        <el-form-item label="参考率" prop="enterRate">
          <el-input v-model="form.enterRate" placeholder="请输入参考率"></el-input>
        </el-form-item>
        <el-form-item label="通过率" prop="passRate">
          <el-input v-model="form.passRate" placeholder="请输入通过率"></el-input>
        </el-form-item>
        <el-form-item label="通过人数" prop="passCount">
          <el-input v-model="form.passCount" placeholder="请输入通过人数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createFaceStatistics('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateFaceStatistics('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFaceStatisticssByPage,
  addFaceStatistics,
  getFaceStatistics,
  delFaceStatistics,
  updFaceStatistics
} from '@/api/bigdata/faceStatistics'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'faceStatistics',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        roundId: undefined,
        administrativeId: undefined,
        administrativeName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        signCount: undefined,
        enterCount: undefined,
        enterRate: undefined,
        passRate: undefined,
        passCount: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      planId: '',
      listQuery: {
        current: 1,
        size: 10,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      bd_faceStatistics_add: false,
      bd_faceStatistics_del: false,
      bd_faceStatistics_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.bd_faceStatistics_add = this.permissions['bd_faceStatistics_add']
    this.bd_faceStatistics_edit = this.permissions['bd_faceStatistics_edit']
    this.bd_faceStatistics_del = this.permissions['bd_faceStatistics_del']
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
    getList(planId) {
      this.planId = planId
      this.listLoading = true
      this.listQuery.planId = planId
      getFaceStatisticssByPage(this.listQuery).then(response => {
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getFaceStatistics(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteFaceStatistics(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFaceStatistics(row.id).then(() => {
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
    createFaceStatistics(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addFaceStatistics(this.form).then(() => {
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
    updateFaceStatistics(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updFaceStatistics(this.form).then(() => {
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
        roundId: undefined,
        administrativeId: undefined,
        administrativeName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        signCount: undefined,
        enterCount: undefined,
        enterRate: undefined,
        passRate: undefined,
        passCount: undefined
      }
    }
  }
}
</script>
