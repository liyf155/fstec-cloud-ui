<template>
  <div class="app-container calendar-list-container" v-if="!examSubjectDialogVisible">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="考试项目名称" v-model="listQuery.itemName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="pf_examItem_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="考试项目">
        <template slot-scope="scope">
          <span>{{scope.row.itemName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目数量">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleExamSubject(scope.row)"><span>{{scope.row.subjectCount}}</span></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="pf_examItem_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="pf_examItem_del"
            size="small"
            type="danger"
            @click="deleteExamItem(scope.row)"
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
        <el-form-item label="考试项目" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入考试项目"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createExamItem('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateExamItem('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-else>
    <!-- 考试科目会话 -->
    <ExamSubject :itemId="currentItemId" @closeExamSubjectDialog="closeExamSubjectDialog" ref="examSubjectClient"></ExamSubject>
  </div>
</template>

<script>
import {
  getExamItemsByPage,
  addExamItem,
  getExamItem,
  delExamItem,
  updExamItem
} from '@/api/platform/examItem'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  components: {
    'ExamSubject': () => import('./examSubject')
  },
  name: 'examItem',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        itemName: '',
        subjectCount: 0,
        delFlag: '0'
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
      examSubjectDialogVisible: false,
      dialogStatus: '',
      pf_examItem_add: false,
      pf_examItem_del: false,
      pf_examItem_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      currentItemId: '',
      examSubjectFormName: '考试科目'
    }
  },
  created() {
    this.getList()
    this.pf_examItem_add = this.permissions['pf_examItem_add']
    this.pf_examItem_edit = this.permissions['pf_examItem_edit']
    this.pf_examItem_del = this.permissions['pf_examItem_del']
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
      getExamItemsByPage(this.listQuery).then(response => {
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
      getExamItem(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamItem(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamItem(row.id).then(() => {
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
    createExamItem(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamItem(this.form).then(() => {
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
    updateExamItem(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamItem(this.form).then(() => {
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
        itemName: '',
        subjectCount: 0,
        delFlag: '0'
      }
    },
    handleExamSubject(row) {
      this.currentItemId = row.id
      this.examSubjectDialogVisible = true
    },
    closeExamSubjectDialog() {
      this.currentItemId = ''
      this.examSubjectDialogVisible = false
      this.getList()
    }
  }
}
</script>
