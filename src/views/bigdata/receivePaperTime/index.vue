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
            <el-form-item label="科目编码:">
              <el-input
                @keyup.enter.native="handleFilter"
                style="width: 200px;"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button
                class="filter-item"
                type="primary"
                v-waves
                icon="el-icon-search"
                @click="handleFilter"
              >搜索</el-button>
              <el-button
                v-if="bd_receivePaperTime_add"
                class="filter-item"
                style="margin-left: 10px;"
                @click="handleCreate"
                type="primary"
                icon="el-icon-plus"
              >添加</el-button>
            </el-form-item>
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
      <el-table-column align="center" label="最早出库时间">
        <template slot-scope="scope">
          <span>{{scope.row.startGetTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目开考时间">
        <template slot-scope="scope">
          <span>{{scope.row.roundBeginTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_receivePaperTime_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_receivePaperTime_del"
            size="small"
            type="danger"
            @click="deleteReceivePaperTime(scope.row)"
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
        <el-form-item label="计划ID" prop="planId">
          <el-input v-model="form.planId" placeholder="请输入计划ID"></el-input>
        </el-form-item>
        <el-form-item label="科目ID" prop="subjectId">
          <el-input v-model="form.subjectId" placeholder="请输入科目ID"></el-input>
        </el-form-item>
        <el-form-item label="科目编码" prop="subjectCode">
          <el-input v-model="form.subjectCode" placeholder="请输入科目编码"></el-input>
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="form.subjectName" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startGetTime">
          <el-input v-model="form.startGetTime" placeholder="请输入开始时间"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入状态"></el-input>
        </el-form-item>
        <el-form-item label="科目开考时间" prop="roundBeginTime">
          <el-input v-model="form.roundBeginTime" placeholder="请输入科目开考时间"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createReceivePaperTime('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateReceivePaperTime('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getReceivePaperTimesByPage,
  addReceivePaperTime,
  getReceivePaperTime,
  delReceivePaperTime,
  updReceivePaperTime
} from '@/api/bigdata/receivePaperTime'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'receivePaperTime',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        subjectId: undefined,
        subjectCode: undefined,
        subjectName: undefined,
        startGetTime: undefined,
        status: undefined,
        roundBeginTime: undefined
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
      bd_receivePaperTime_add: false,
      bd_receivePaperTime_del: false,
      bd_receivePaperTime_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.bd_receivePaperTime_add = this.permissions['bd_receivePaperTime_add']
    this.bd_receivePaperTime_edit = this.permissions[
      'bd_receivePaperTime_edit'
    ]
    this.bd_receivePaperTime_del = this.permissions['bd_receivePaperTime_del']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未开始',
        1: '开始领取',
        2: '已完成'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList(planId) {
      this.planId = planId
      this.listQuery.planId = planId
      this.listLoading = true
      getReceivePaperTimesByPage(this.listQuery).then(response => {
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
      getReceivePaperTime(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteReceivePaperTime(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delReceivePaperTime(row.id).then(() => {
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
    createReceivePaperTime(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addReceivePaperTime(this.form).then(() => {
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
    updateReceivePaperTime(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updReceivePaperTime(this.form).then(() => {
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
        subjectId: undefined,
        subjectCode: undefined,
        subjectName: undefined,
        startGetTime: undefined,
        status: undefined,
        roundBeginTime: undefined
      }
    }
  }
}
</script>
