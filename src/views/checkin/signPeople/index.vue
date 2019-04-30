<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="4">
            <el-form-item label="姓名:">
              <el-input
                style="width:150px"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.checkName"
                @keyup.enter.native="handleFilter"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="签到时间段:">
              <el-date-picker
                v-model="timeStage"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
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
              v-if="ck_signPeople_add"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="handleCreate"
            >添加</el-button>
            <el-button
              :loading="downloadLoading"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-document"
              @click="handleExport"
            >导出</el-button>
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
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.checkName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否通过" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.pass | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="核验方式" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.compType | compareFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到时间">
        <template slot-scope="scope">
          <span>{{scope.row.verifyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证照片">
        <template slot-scope="scope">
          <span><img :src="scope.row.certPhoto" style="width: 50px; height: 60px;"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="现场照片">
        <template slot-scope="scope">
          <img :src="scope.row.fieldPhoto" style="width: 50px; height: 60px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="识别分数" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.compScore}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="ck_signPeople_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="ck_signPeople_del"
            size="small"
            type="danger"
            @click="deleteSignPeople(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.current"
        :page-sizes="[10,20,30,50,100,200,500]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="姓名" prop="checkName">
          <el-input v-model="form.checkName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="证件号" prop="certId">
          <el-input v-model="form.certId" placeholder="请输入证件号"></el-input>
        </el-form-item>
        <el-form-item label="签到时间" prop="verifyTime">
          <el-input v-model="form.verifyTime" placeholder="请输入签到时间"></el-input>
        </el-form-item>
        <el-form-item label="身份证照片" prop="certPhoto">
          <el-input v-model="form.certPhoto" placeholder="请输入身份证照片"></el-input>
        </el-form-item>
        <el-form-item label="现场照片" prop="compPhoto">
          <el-input v-model="form.fieldPhoto" placeholder="请输入现场照片"></el-input>
        </el-form-item>
        <el-form-item label="是否人工核查" prop="manualVerify">
          <el-input v-model="form.manualVerify" placeholder="请输入是否人工核查"></el-input>
        </el-form-item>
        <el-form-item label="是否通过" prop="pass">
          <el-input v-model="form.pass" placeholder="请输入是否通过"></el-input>
        </el-form-item>
        <el-form-item label="设备串号" prop="imeiNo">
          <el-input v-model="form.imeiNo" placeholder="请输入设备串号"></el-input>
        </el-form-item>
        <el-form-item label="识别分数" prop="compScore">
          <el-input v-model="form.compScore" placeholder="请输入识别分数"></el-input>
        </el-form-item>
        <el-form-item label="人像比分" prop="photoPrecision">
          <el-input v-model="form.photoPrecision" placeholder="请输入人像比分"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createSignPeople('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateSignPeople('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSignPeoplesByPage,
  addSignPeople,
  getSignPeople,
  delSignPeople,
  updSignPeople
} from '@/api/checkin/signPeople'
import { mapGetters } from 'vuex'
import {
  parseTime
} from '@/util/util'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'signPeople',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        checkName: undefined,
        certId: undefined,
        verifyTime: undefined,
        certPhoto: undefined,
        compPhoto: undefined,
        manualVerify: undefined,
        pass: undefined,
        imeiNo: undefined,
        compScore: undefined,
        uploadTime: undefined,
        photoPrecision: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        current: 1,
        size: 10,
        checkName: '',
        startTime: undefined,
        endTime: undefined,
        certId: ''
      },
      timeStage: '', // 时间段
      dialogFormVisible: false,
      dialogStatus: '',
      ck_signPeople_add: false,
      ck_signPeople_del: false,
      ck_signPeople_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.ck_signPeople_add = this.permissions['ck_signPeople_add']
    this.ck_signPeople_edit = this.permissions['ck_signPeople_edit']
    this.ck_signPeople_del = this.permissions['ck_signPeople_del']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '是',
        '1': '否'
      }
      return statusMap[status]
    },
    compareFilter(status) {
      const statusMap = {
        '0': '自动',
        '1': '手工'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.timeStage.length > 0) {
        this.listQuery.startTime = parseTime(this.timeStage[0])
        this.listQuery.endTime = parseTime(this.timeStage[1])
      }
      getSignPeoplesByPage(this.listQuery).then(response => {
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
      getSignPeople(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteSignPeople(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSignPeople(row.id).then(() => {
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
    createSignPeople(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addSignPeople(this.form).then(() => {
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
    updateSignPeople(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updSignPeople(this.form).then(() => {
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
    handleExport() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '性别', '证件号', '核验时间', '核验方式', '结果', '对比分数']
        const filterVal = ['checkName', 'sex', 'certId', 'verifyTime', 'compType', 'pass', 'compScore']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '教师签到报表',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'verifyTime') {
          return parseTime(v[j])
        } else if (j === 'pass') {
          return v[j] === '0' ? '是' : '否'
        } else if (j === 'compType') {
          return v[j] === '0' ? '自动' : '手工'
        } else {
          return v[j]
        }
      }))
    },
    resetTemp() {
      this.form = {
        checkName: undefined,
        certId: undefined,
        verifyTime: undefined,
        certPhoto: undefined,
        fieldPhoto: undefined,
        manualVerify: undefined,
        pass: undefined,
        imeiNo: undefined,
        compScore: undefined,
        uploadTime: undefined,
        photoPrecision: undefined
      }
    }
  }
}
</script>
