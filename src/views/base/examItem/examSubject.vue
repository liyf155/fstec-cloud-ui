<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width:200px" class="filter-item" placeholder="模糊查询" v-model="listQuery.subjectName" @keyup.enter.native="handleFilter" ></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter" >搜索</el-button>
      <el-button v-if="pf_examSubject_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-back" @click="backToExamItemPage">返回</el-button>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="科目名称">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考试时长(单位：分)">
        <template slot-scope="scope">
          <span>{{scope.row.examDuration}}</span>
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
            v-if="pf_examSubject_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="pf_examSubject_del"
            size="small"
            type="danger"
            @click="deleteExamSubject(scope.row)"
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
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="form.subjectName" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item label="考试时长" prop="examDuration">
          <el-input v-model="form.examDuration" placeholder="请输入考试时长（单位：分钟）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createExamSubject('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateExamSubject('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamSubjectsByPage,
  addExamSubject,
  getExamSubject,
  delExamSubject,
  updExamSubject
} from '@/api/base/examSubject'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examSubject',
  props: {
    itemId: {
      default: ''
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      form: {
        itemId: this.itemId,
        subjectName: '',
        examDuration: undefined,
        delFlag: '0'
      },
      rules: {
        subjectName: [
          {
            required: true,
            message: '请输入科目名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        examDuration: [
          {
            validator: (rule, value, callback) => {
              if (value !== '') {
                if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                  callback(new Error('请填写大于0的数字'))
                } else if (value > 999) {
                  callback(new Error('考试时长的范围是1~999分钟'))
                } else {
                  callback()
                }
              } else {
                callback('请输入科目的考试时长')
              }
            },
            trigger: 'blur'
          }

        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        itemId: this.itemId,
        subjectName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      pf_examSubject_add: false,
      pf_examSubject_del: false,
      pf_examSubject_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.pf_examSubject_add = this.permissions['pf_examSubject_add']
    this.pf_examSubject_edit = this.permissions['pf_examSubject_edit']
    this.pf_examSubject_del = this.permissions['pf_examSubject_del']
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
      getExamSubjectsByPage(this.listQuery).then(response => {
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
      getExamSubject(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamSubject(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamSubject(row.id).then(() => {
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
    createExamSubject(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamSubject(this.form).then(() => {
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
    updateExamSubject(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamSubject(this.form).then(() => {
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
        itemId: this.itemId,
        subjectName: '',
        examDuration: undefined,
        delFlag: '0'
      }
    },
    backToExamItemPage() {
      // 调用父组件监听的方法
      this.$emit('closeExamSubjectDialog')
    }
  }
}
</script>
