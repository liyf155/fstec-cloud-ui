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
              v-if="bd_workReport_add"
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
      <el-table-column align="center" label="工作类型">
        <template slot-scope="scope">
          <span>{{scope.row.workType | workTypeFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片路径" show-overflow-tooltip>
        <template v-if="scope.row.photos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.photos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报时间">
        <template slot-scope="scope">
          <span>{{scope.row.reportTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报人员">
        <template slot-scope="scope">
          <span>{{scope.row.reportUser}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_workReport_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_workReport_del"
            size="small"
            type="danger"
            @click="deleteWorkReport(scope.row)"
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
        <el-form-item label="工作类型" prop="workType">
          <el-input v-model="form.workType" placeholder="请输入工作类型"></el-input>
        </el-form-item>
        <el-form-item label="考点ID" prop="nodeId">
          <el-input v-model="form.nodeId" placeholder="请输入考点ID"></el-input>
        </el-form-item>
        <el-form-item label="考点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
        </el-form-item>
        <el-form-item label="上报类型" prop="reportType">
          <el-input v-model="form.reportType" placeholder="请输入上报类型"></el-input>
        </el-form-item>
        <el-form-item label="完成状态" prop="completeState">
          <el-input v-model="form.completeState" placeholder="请输入完成状态"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="situationDesc">
          <el-input v-model="form.situationDesc" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="照片路径" prop="photoPath">
          <el-input v-model="form.photoPath" placeholder="请输入照片路径"></el-input>
        </el-form-item>
        <el-form-item label="上报时间" prop="reportTime">
          <el-input v-model="form.reportTime" placeholder="请输入上报时间"></el-input>
        </el-form-item>
        <el-form-item label="上报人员" prop="reportUser">
          <el-input v-model="form.reportUser" placeholder="请输入上报人员"></el-input>
        </el-form-item>
        <el-form-item label="岗位ID" prop="postId">
          <el-input v-model="form.postId" placeholder="请输入岗位ID"></el-input>
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createWorkReport('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateWorkReport('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWorkReportsByPage,
  addWorkReport,
  getWorkReport,
  delWorkReport,
  updWorkReport
} from '@/api/bigdata/workReport'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'workReport',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        workType: undefined,
        nodeId: undefined,
        nodeName: undefined,
        reportType: undefined,
        completeState: undefined,
        situationDesc: undefined,
        photoPath: undefined,
        reportTime: undefined,
        reportUser: undefined,
        postId: undefined,
        postName: undefined
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
      bd_workReport_add: false,
      bd_workReport_del: false,
      bd_workReport_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.bd_workReport_add = this.permissions['bd_workReport_add']
    this.bd_workReport_edit = this.permissions['bd_workReport_edit']
    this.bd_workReport_del = this.permissions['bd_workReport_del']
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
    workTypeFilter(status) {
      const statusMap = {
        0: '考前工作', 1: '考前培训', 2: '准备工作', 3: '开考情况', 4: '人脸通道', 5: '收尾工作', 6: '其他'
      }
      return statusMap[status]
    }

  },
  methods: {
    getList(planId) {
      this.planId = planId
      this.listLoading = true
      this.listQuery.planId = planId
      getWorkReportsByPage(this.listQuery).then(response => {
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
      getWorkReport(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteWorkReport(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delWorkReport(row.id).then(() => {
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
    createWorkReport(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addWorkReport(this.form).then(() => {
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
    updateWorkReport(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updWorkReport(this.form).then(() => {
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
        workType: undefined,
        nodeId: undefined,
        nodeName: undefined,
        reportType: undefined,
        completeState: undefined,
        situationDesc: undefined,
        photoPath: undefined,
        reportTime: undefined,
        reportUser: undefined,
        postId: undefined,
        postName: undefined
      }
    },
    show(row) {
      console.log(row.photos)
      // const h = this.$createElement
    }
  }
}
</script>
