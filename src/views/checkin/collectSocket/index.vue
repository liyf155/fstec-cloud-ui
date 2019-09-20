<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="计划：">
          <el-select v-model="listQuery.planId" placeholder="==请选择==" clearable @change="examPlanChange">
            <el-option v-for="p in planIdList" :key="p.id" :label="p.planName" :value="p.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考点：">
          <el-select class="filter-item" v-model="listQuery.nodeId" filterable clearable placeholder="===请选择===" @change="examNodeFilter">
            <el-option
              v-for="(item, idx) in examNodes"
              :key="idx"
              :label="item.nodeName"
              :value="item.nodeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input
            @keyup.enter.native="handleFilter"
            style="width: 200px;"
            class="filter-item"
            placeholder="模糊查询"
            v-model="listQuery.name"
          ></el-input>
        </el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <!-- <el-upload
          class="upload-demo"
          action="/checkin/collectSocket/importFromDt"
          :headers="headers"
          :data="uploadData"
          :onError="uploadError"
          :onSuccess="uploadSuccess"
          :beforeUpload="beforeUpload"
        >
          <el-button class="filter-item" type="primary" icon="el-icon-upload">导入DT文件</el-button>
        </el-upload> -->
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
      <el-table-column align="center" label="所属省份">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属城市">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件照">
        <template v-if="scope.row.certPhoto" slot-scope="scope">
          <div class="images" v-viewer>
          <img v-for="item in (scope.row.certPhoto.split(','))" :src="photoUrlHandle(scope.row, item)" :key="item" style="width: 90px;height: 100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="现场照片">
        <template v-if="scope.row.scenePhoto" slot-scope="scope">
          <div class="images" v-viewer>
          <img v-for="item in (scope.row.scenePhoto.split(','))" :src="photoUrlHandle(scope.row, item)" :key="item" style="width: 90px;height: 100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采集时间">
        <template slot-scope="scope">
          <span>{{scope.row.collectTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="核验人">
        <template slot-scope="scope">
          <span>{{scope.row.manualName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.manualPhone}}</span>
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
  </div>
</template>

<script>
import {
  getCollectSocketsByPage,
  addCollectSocket,
  getCollectSocket,
  delCollectSocket,
  updCollectSocket
} from '@/api/checkin/collectSocket'
import { getPlanList } from '@/api/checkin/checkinPlan'
import { allcatedExamNodes } from '@/api/checkin/checkinPeople'
import { mapGetters } from 'vuex'
import store from '@/store'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'collectSocket',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        name: undefined,
        cardNum: undefined,
        cardExpiry: undefined,
        compScore: undefined,
        compType: undefined,
        planId: undefined,
        nodeId: undefined,
        manualName: undefined,
        manualPhone: undefined,
        certPhoto: undefined,
        scenePhoto: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      planIdList: null,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined,
        planId: undefined,
        nodeId: undefined
      },
      uploadData: {
        planId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      ck_collectSocket_add: false,
      ck_collectSocket_del: false,
      ck_collectSocket_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      planId: '',
      nodeId: '',
      examNodes: []
    }
  },
  created() {
    this.getPlanIdList()
    this.ck_collectSocket_add = this.permissions['ck_collectSocket_add']
    this.ck_collectSocket_edit = this.permissions['ck_collectSocket_edit']
    this.ck_collectSocket_del = this.permissions['ck_collectSocket_del']
  },
  computed: {
    ...mapGetters(['permissions']),
    headers() {
      return {
        Authorization: 'Bearer ' + store.getters.access_token
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
    getList() {
      this.listLoading = true
      getCollectSocketsByPage(this.listQuery).then(response => {
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
      getCollectSocket(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteCollectSocket(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCollectSocket(row.id).then(() => {
          this.getList()
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
    createCollectSocket(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addCollectSocket(this.form).then(() => {
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
    updateCollectSocket(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updCollectSocket(this.form).then(() => {
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
        name: undefined,
        cardNum: undefined,
        cardExpiry: undefined,
        compScore: undefined,
        compType: undefined,
        planId: undefined,
        nodeId: undefined,
        manualName: undefined,
        manualPhone: undefined,
        certPhoto: undefined,
        scenePhoto: undefined
      }
    },
    photoUrlHandle(row, item) {
      return item + '?' + row.collectTime
    },
    examPlanChange() {
      this.getList()
    },
    getPlanIdList() {
      getPlanList().then(response => {
        this.planIdList = response.data
        this.listQuery.planId = response.data[0].id
        this.uploadData.planId = response.data[0].id
        this.planId = response.data[0].id
        this.getList()
        this.listPlanNodes(response.data[0].id)
      })
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
      const extension = file.name.split('.')[1] === 'zip'
      const isLt2M = file.size / 1024 / 1024 < 1000
      if (!extension) {
        this.$notify({
          title: '提示',
          message: '上传文件要求是zip格式',
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
    listPlanNodes(planId) {
      allcatedExamNodes(planId).then(res => {
        this.examNodes = res.data
      })
    },
    examNodeFilter() {
      this.getList()
    }
  }
}
</script>
