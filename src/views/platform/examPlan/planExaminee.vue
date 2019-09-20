<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="考生姓名" v-model="listQuery.examineeName"></el-input>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="pf_planExaminee_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="exportRfidCodeToExcel()">导出RFID</el-button>
      <el-button class="filter-item" type="info" icon="el-icon-back" @click="backToExamPlanPage">返回</el-button>
      <el-upload v-if="pf_planExaminee_edit" class="upload-demo" action="/platform/planExaminee/importExamineeFromExcel" :headers="headers" :data="uploadData" :onError="uploadError" :onSuccess="uploadSuccess" :beforeUpload="beforeUpload">
        <el-button class="filter-item" type="primary" icon="el-icon-upload">批量导入</el-button>
      </el-upload>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="证件号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考生姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="准考证号">
        <template slot-scope="scope">
          <span>{{scope.row.examCertId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex | sexFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="座位号">
        <template slot-scope="scope">
          <span>{{scope.row.seatNo}}</span>
        </template>
      </el-table-column>
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
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="pf_planExaminee_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="pf_planExaminee_del" size="small" type="danger" @click="deletePlanExaminee(scope.row)">删除</el-button>
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
        <el-form-item label="证件类型" prop="certType">
          <el-input v-model="form.certType" placeholder="请输入证件类型 0-身份证 1-军官证 2-港澳通行证 3-护照"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="form.sex" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="座位号" prop="seatNo">
          <el-input v-model="form.seatNo" placeholder="请输入座位号"></el-input>
        </el-form-item>
        <el-form-item label="准考证号" prop="examCertId">
          <el-input v-model="form.examCertId" placeholder="请输入准考证号"></el-input>
        </el-form-item>
        <el-form-item label="证件号" prop="certId">
          <el-input v-model="form.certId" placeholder="请输入证件号"></el-input>
        </el-form-item>
        <el-form-item label="考生姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入考生姓名"></el-input>
        </el-form-item>
        <el-form-item label="考区名称" prop="administrativeName">
          <el-input v-model="form.administrativeName" placeholder="请输入考区名称"></el-input>
        </el-form-item>
        <el-form-item label="考点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
        </el-form-item>
        <el-form-item label="考场名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入考场名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createPlanExaminee('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updatePlanExaminee('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPlanExamineesByPage,
  addPlanExaminee,
  getPlanExaminee,
  delPlanExaminee,
  updPlanExaminee,
  exportRfidCode
} from '@/api/platform/planExaminee'
import { mapGetters } from 'vuex'
import store from '@/store'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'planExaminee',
  props: {
    planId: {
      default: ''
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        administrativeId: undefined,
        nodeId: undefined,
        roomId: undefined,
        certType: undefined,
        sex: undefined,
        seatNo: undefined,
        examCertId: undefined,
        certId: undefined,
        name: undefined,
        administrativeName: undefined,
        nodeName: undefined,
        roomName: undefined,
        extInfo: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        planId: this.planId,
        examineeName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      pf_planExaminee_add: false,
      pf_planExaminee_del: false,
      pf_planExaminee_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      uploadData: {
        planId: this.planId
      }
    }
  },
  created() {
    this.getList()
    this.pf_planExaminee_add = this.permissions['pf_planExaminee_add']
    this.pf_planExaminee_edit = this.permissions['pf_planExaminee_edit']
    this.pf_planExaminee_del = this.permissions['pf_planExaminee_del']
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
    },
    sexFilter(status) {
      const sexMap = {
        0: '保密',
        1: '男',
        2: '女'
      }
      return sexMap[status]
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getPlanExamineesByPage(this.listQuery).then(response => {
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
      getPlanExaminee(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deletePlanExaminee(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPlanExaminee(row.id).then(() => {
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
    createPlanExaminee(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addPlanExaminee(this.form).then(() => {
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
    updatePlanExaminee(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updPlanExaminee(this.form).then(() => {
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
        administrativeId: undefined,
        nodeId: undefined,
        roomId: undefined,
        certType: undefined,
        sex: undefined,
        seatNo: undefined,
        examCertId: undefined,
        certId: undefined,
        name: undefined,
        administrativeName: undefined,
        nodeName: undefined,
        roomName: undefined,
        extInfo: undefined
      }
    },
    backToExamPlanPage() {
      this.$emit('closePlanExamineeDialog')
    },
    // 上传成功后的回调
    uploadSuccess(response) {
      if (response.code === 1) {
        this.$notify({
          title: '提示',
          message: response.msg,
          type: 'warning',
          duration: 5000
        })
      } else {
        this.getList()
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success',
          duration: 3000
        })
      }
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
      const extension = file.name.split('.')[1] === 'xml'
      // const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$notify({
          title: '提示',
          message: '上传文件要求是XML格式',
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
      return extension && isLt2M
    },
    exportRfidCodeToExcel() {
      var cond = {
        planId: this.planId
      }
      exportRfidCode(cond).then(() => {
        this.$notify({
          title: '成功',
          message: '导出成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '导出失败',
          type: 'error',
          duration: 2000
        })
      })
    }
  }
}
</script>
