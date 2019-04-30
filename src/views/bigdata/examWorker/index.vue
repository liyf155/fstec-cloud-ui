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
            <el-form-item label="姓名:">
              <el-input style="width:200px" class="filter-item" placeholder="模糊查询" v-model="listQuery.name" @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter" >搜索</el-button>
            <el-button v-if="bd_examWorker_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-upload class="upload-demo" action="/bigdata/examWorker/upload" :headers="headers" :data="uploadData" :onError="uploadError" :onSuccess="uploadSuccess" :beforeUpload="beforeUpload" :show-file-list="false">
              <el-button class="filter-item" type="primary" icon="el-icon-upload">批量导入</el-button>
            </el-upload>
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
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.serialNo}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="省份名称">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="城市名">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位名称">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phoneNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职务">
        <template slot-scope="scope">
          <span>{{scope.row.duty}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_examWorker_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_examWorker_del"
            size="small"
            type="danger"
            @click="deleteExamWorker(scope.row)"
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
        <el-form-item label="序号" prop="serialNo">
          <el-input v-model="form.serialNo" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item label="考点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
        </el-form-item>
        <el-form-item label="城市名" prop="cityName">
          <el-input v-model="form.cityName" placeholder="请输入城市名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="duty">
          <el-input v-model="form.duty" placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createExamWorker('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateExamWorker('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamWorkersByPage,
  addExamWorker,
  getExamWorker,
  delExamWorker,
  updExamWorker
} from '@/api/bigdata/examWorker'
import { mapGetters } from 'vuex'
import store from '@/store'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examWorker',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        postId: undefined,
        nodeName: undefined,
        nodeId: undefined,
        provinceId: undefined,
        cityName: undefined,
        cityId: undefined,
        name: undefined,
        phoneNumber: undefined,
        wechatId: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        delFlag: undefined,
        duty: undefined,
        serialNo: undefined,
        provinceName: undefined
      },
      planId: '',
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined,
        planId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      bd_examWorker_add: false,
      bd_examWorker_del: false,
      bd_examWorker_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      trainPlans: [],
      uploadData: {
        planId: this.planId
      }
    }
  },
  created() {
    this.bd_examWorker_add = this.permissions['bd_examWorker_add']
    this.bd_examWorker_edit = this.permissions['bd_examWorker_edit']
    this.bd_examWorker_del = this.permissions['bd_examWorker_del']
  },
  computed: {
    ...mapGetters(['permissions']),
    headers() {
      return {
        'Authorization': 'Bearer ' + store.getters.access_token
      }
    }
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
      this.listQuery.planId = planId
      this.listLoading = true
      getExamWorkersByPage(this.listQuery).then(response => {
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
      getExamWorker(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamWorker(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamWorker(row.id).then(() => {
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
    createExamWorker(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamWorker(this.form).then(() => {
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
    updateExamWorker(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamWorker(this.form).then(() => {
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
        postId: undefined,
        nodeName: undefined,
        nodeId: undefined,
        provinceId: undefined,
        cityName: undefined,
        cityId: undefined,
        name: undefined,
        phoneNumber: undefined,
        wechatId: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        delFlag: undefined,
        duty: undefined,
        serialNo: undefined,
        provinceName: undefined
      }
    },
    // 上传成功后的回调
    uploadSuccess(response) {
      if (response.code === 1) {
        this.$notify({
          title: '失败',
          message: response.msg,
          type: 'warning',
          duration: 5000
        })
      } else {
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success',
          duration: 3000
        })
      }
      this.getList(this.planId)
    },
    // 上传错误
    uploadError(response) {
      this.$notify({
        title: '失败',
        message: '上传文件失败，请检查文件内容格式是否正确',
        type: 'error',
        duration: 3000
      })
    },
    // 上传前对文件的大小的判断
    beforeUpload(file) {
      this.uploadData.planId = this.planId
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$notify({
          title: '提示',
          message: '上传文件要求是xls或xlsx格式',
          type: 'warning',
          duration: 3000
        })
      }
      if (!isLt2M) {
        this.$notify({
          title: '提示',
          message: '上传文件大于10M，请联系管理员进行处理',
          type: 'warning',
          duration: 3000
        })
      }
      return extension || extension2 && isLt2M
    },
    planChange() {
      this.uploadData.planId = this.listQuery.planId
      this.getList(this.planId)
    }
  }
}
</script>
