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
            <el-form-item label="用户名:">
              <el-input
                style="width:200px"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.userName"
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
      <el-table-column align="center" label="考区名称">
        <template slot-scope="scope">
          <span>{{scope.row.baseInfo.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.baseInfo.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.baseInfo.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片">
        <template v-if="scope.row.baseInfo.photos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.baseInfo.photos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报时间">
        <template slot-scope="scope">
          <span>{{scope.row.baseInfo.reportTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场布置">
        <template slot-scope="scope">
          <span>{{scope.row.examArragement | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="监控部署">
        <template slot-scope="scope">
          <span>{{scope.row.monitorPrepare | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="封场情况">
        <template slot-scope="scope">
          <span>{{scope.row.closurePrepare | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_examPrepare_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_examPrepare_del"
            size="small"
            type="danger"
            @click="deleteExamPrepare(scope.row)"
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
        <el-form-item label="基本信息ID" prop="baseId">
          <el-input v-model="form.baseId" placeholder="请输入基本信息ID"></el-input>
        </el-form-item>
        <el-form-item label="物资到位" prop="materialPrepare">
          <el-input v-model="form.materialPrepare" placeholder="请输入物资到位"></el-input>
        </el-form-item>
        <el-form-item label="考场布置" prop="examArragement">
          <el-input v-model="form.examArragement" placeholder="请输入考场布置"></el-input>
        </el-form-item>
        <el-form-item label="监控部署" prop="monitorPrepare">
          <el-input v-model="form.monitorPrepare" placeholder="请输入监控部署"></el-input>
        </el-form-item>
        <el-form-item label="人脸识别通道" prop="faceChannel">
          <el-input v-model="form.faceChannel" placeholder="请输入人脸识别通道"></el-input>
        </el-form-item>
        <el-form-item label="封场情况" prop="closurePrepare">
          <el-input v-model="form.closurePrepare" placeholder="请输入封场情况"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createExamPrepare('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateExamPrepare('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamPreparesByPage,
  addExamPrepare,
  getExamPrepare,
  delExamPrepare,
  updExamPrepare
} from '@/api/bigdata/examPrepare'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examPrepare',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        baseId: undefined,
        materialPrepare: undefined,
        examArragement: undefined,
        monitorPrepare: undefined,
        faceChannel: undefined,
        closurePrepare: undefined
      },
      planId: '',
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        userName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      bd_examPrepare_add: false,
      bd_examPrepare_del: false,
      bd_examPrepare_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.bd_examPrepare_add = this.permissions['bd_examPrepare_add']
    this.bd_examPrepare_edit = this.permissions['bd_examPrepare_edit']
    this.bd_examPrepare_del = this.permissions['bd_examPrepare_del']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未完成',
        1: '已完成'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList(planId) {
      this.planId = planId
      this.listQuery.planId = planId
      this.listLoading = true
      getExamPreparesByPage(this.listQuery).then(response => {
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
      getExamPrepare(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamPrepare(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamPrepare(row.id).then(() => {
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
    createExamPrepare(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamPrepare(this.form).then(() => {
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
    updateExamPrepare(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamPrepare(this.form).then(() => {
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
        baseId: undefined,
        materialPrepare: undefined,
        examArragement: undefined,
        monitorPrepare: undefined,
        faceChannel: undefined,
        closurePrepare: undefined
      }
    }
  }
}
</script>
