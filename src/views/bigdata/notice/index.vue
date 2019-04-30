<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="7">
            <el-form-item label="考试计划">
              <el-select class="filter-item" v-model="listQuery.planId" filterable placeholder="请选择考试计划" @change="planChange">
                <el-option v-for="plan in examPlans" :key="plan.id" :label="plan.planName" :value="plan.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input
                style="width:200px"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.content"
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
              v-if="bd_notice_add"
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
      <el-table-column align="center" label="计划名称" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.planName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公告内容" show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createId}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_notice_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_notice_del"
            size="small"
            type="danger"
            @click="deleteNotice(scope.row)"
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
        <el-form-item label="考试计划：" prop="planId">
          <el-select v-model="form.planId" filterable placeholder="请选择考试计划" style="width:500px" @change="planChange2">
            <el-option v-for="item in examPlans" :key="item.id" :label="item.planName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input type="textarea" :rows="10" v-model="form.content" placeholder="请输入公告内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createNotice('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateNotice('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNoticesByPage,
  addNotice,
  getNotice,
  delNotice,
  updNotice
} from '@/api/bigdata/notice'
import {
  getExamPlans
} from '@/api/platform/examPlan'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'notice',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        planName: undefined,
        content: undefined
      },
      rules: {
        planId: [{
          required: true,
          message: '请选择要创建任务的考试计划',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入公告内容',
          trigger: 'blur'
        },
        {
          min: 5,
          max: 200,
          message: '长度在 5 到 200 个字符',
          trigger: 'blur'
        }]
      },
      examPlans: [],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        content: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      bd_notice_add: false,
      bd_notice_del: false,
      bd_notice_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.fetchExamPlans()
    this.bd_notice_add = this.permissions['bd_notice_add']
    this.bd_notice_edit = this.permissions['bd_notice_edit']
    this.bd_notice_del = this.permissions['bd_notice_del']
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
    fetchExamPlans() {
      getExamPlans().then(response => {
        this.examPlans = response.data
        this.listQuery.planId = this.examPlans[0].id
        this.getList()
      })
    },
    planChange() {
      this.getList()
    },
    planChange2(vId) {
      let obj = {}
      obj = this.examPlans.find((item) => {
        return item.id === vId
      })
      this.form.planId = obj.id
      this.form.planName = obj.planName
    },
    getList() {
      this.listLoading = true
      getNoticesByPage(this.listQuery).then(response => {
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
      getNotice(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteNotice(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delNotice(row.id).then(() => {
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
    createNotice(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addNotice(this.form).then(() => {
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
    updateNotice(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updNotice(this.form).then(() => {
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
        planId: undefined,
        planName: undefined,
        content: undefined,
        createTime: undefined,
        createId: undefined
      }
    }
  }
}
</script>
