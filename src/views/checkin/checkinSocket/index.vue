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
        <el-form-item label="证件号：">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.certId">
          </el-input>
        </el-form-item>
        <el-form-item label="设备串号：">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.imeiNo">
          </el-input>
        </el-form-item>
        <el-form-item label="数据类型：">
          <el-select v-model="listQuery.dataType" placeholder="==请选择==" clearable @change="queryByDataType">
            <el-option v-for="d in dataTypeList" :key="d.value" :label="d.label" :value="d.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安检时间：">
          <el-date-picker
            v-model="timeSegment"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="download()">导出数据</el-button>
    </el-form>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
    <el-table-column align="center" label="省份">
      <template slot-scope="scope">
        <span>{{scope.row.provinceName}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="城市">
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
    <el-table-column align="center" label="数据类型">
      <template slot-scope="scope">
        <span>{{scope.row.dataType | dataTypeFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="安检时间">
      <template slot-scope="scope">
        <span>{{scope.row.verifyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="原照片">
      <template v-if="scope.row.certPhotoPath" slot-scope="scope">
        <div class="images" v-viewer>
        <img v-for="item in (scope.row.certPhotoPath.split(','))" :src="photoUrlHandle(scope.row, item)" :key="item" style="width: 90px;height: 100px">
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="对比照片">
      <template v-if="scope.row.compPhotoPath" slot-scope="scope">
        <div class="images" v-viewer>
        <img v-for="item in (scope.row.compPhotoPath.split(','))" :src="photoUrlHandle(scope.row, item)" :key="item" style="width: 90px;height: 100px">
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</div>
</template>

<script>
import { getCheckinSocketsByPage, addCheckinSocket, getCheckinSocket, delCheckinSocket, updCheckinSocket, downloadCheckinSocket } from '@/api/checkin/checkinSocket'
import { getPlanList } from '@/api/checkin/checkinPlan'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'checkinSocket',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        peopleId: undefined,
        planId: undefined,
        isPass: undefined,
        passType: undefined,
        compScore: undefined,
        photoPrecision: undefined,
        nPhotoPrecision: undefined,
        verifyTime: undefined,
        uploadTime: undefined,
        createTime: undefined,
        imeiNo: undefined,
        faceIndetityDate: undefined,
        dataType: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        certId: '',
        planId: '',
        dataType: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      ck_checkinSocket_add: false,
      ck_checkinSocket_del: false,
      ck_checkinSocket_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      planIdList: null,
      dataTypeList: [
        {
          label: '人证机',
          value: 0
        },
        {
          label: '智能抓拍机',
          value: 1
        }
      ],
      checkinSocketDown: {
        planId: undefined,
        imeiNo: undefined,
        dataType: undefined
      },
      timeSegment: []
    }
  },
  created() {
    this.getPlanIdList()
    this.ck_checkinSocket_add = this.permissions['ck_checkinSocket_add']
    this.ck_checkinSocket_edit = this.permissions['ck_checkinSocket_edit']
    this.ck_checkinSocket_del = this.permissions['ck_checkinSocket_del']
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '正常',
        1: '锁定'
      }
      return statusMap[status]
    },
    dataTypeFilter(type) {
      const typeMap = {
        0: '人证机',
        1: '智能抓拍机'
      }
      return typeMap[type]
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.timeSegment.length > 0) {
        this.listQuery.startTime = this.timeSegment[0]
        this.listQuery.endTime = this.timeSegment[1]
      }
      getCheckinSocketsByPage(this.listQuery).then(response => {
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
      getCheckinSocket(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteCheckinSocket(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinSocket(row.id).then(() => {
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
    createCheckinSocket(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addCheckinSocket(this.form).then(() => {
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
    updateCheckinSocket(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updCheckinSocket(this.form).then(() => {
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
        peopleId: undefined,
        planId: undefined,
        isPass: undefined,
        passType: undefined,
        compScore: undefined,
        photoPrecision: undefined,
        nPhotoPrecision: undefined,
        verifyTime: undefined,
        uploadTime: undefined,
        createTime: undefined,
        imeiNo: undefined,
        faceIndetityDate: undefined,
        dataType: undefined
      }
    },
    getPlanIdList() {
      getPlanList().then(response => {
        this.planIdList = response.data
        this.listQuery.planId = response.data[0].id
        this.getList()
      })
    },
    download() {
      if (this.timeSegment.length > 0) {
        this.listQuery.startTime = this.timeSegment[0]
        this.listQuery.endTime = this.timeSegment[1]
      }
      downloadCheckinSocket(this.listQuery).then(() => {
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
    },
    examPlanChange() {
      this.getList()
    },
    queryByDataType() {
      this.getList()
    },
    photoUrlHandle(row, item) {
      return item + '?' + row.verifyTime
    }
  }
}
  </script>
