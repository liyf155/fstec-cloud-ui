<template>
  <div class="app-container calendar-list-container"
    v-if="!planPeopleDialogVisible">
    <div class="filter-container">
      <el-form>
        <el-input @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="模糊查询"
          v-model="listQuery.planName"></el-input>
        <el-button class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter">搜索
        </el-button>
        <el-button v-if="ck_checkinPlan_add"
          class="filter-item"
          style="margin-left: 10px;"
          @click="handleCreate"
          type="primary"
          icon="el-icon-plus">添加
        </el-button>
      </el-form>
    </div>
    <el-table :key='tableKey'
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="正在加载..."
      border
      fit
      highlight-current-row
      style="width: 99%">
      <el-table-column align="center"
        label="计划名称">
        <template slot-scope="scope">
          <span>{{scope.row.planName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"
        width="310px"
        label="场次编辑">
        <template slot-scope="scope">
          <el-button type="text"
            icon="el-icon-edit"
            @click="openRoundConfig(scope.row)">
            <span v-if="scope.row.beginTime">{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}')}} 至 {{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            <span v-else>- 至 -</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="人员分配"> 
        <template slot-scope="scope">
          <el-button type="text"
            icon="el-icon-edit"
            @click="handlePlanPeople(scope.row)"><span>{{scope.row.peopleCount}}</span></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="设备分配">
        <template slot-scope="scope">
          <el-button type="text"
            icon="el-icon-share"
            @click="openDeviceConfig(scope.row)"><span></span></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right"
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinPlan_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="ck_checkinPlan_del"
            size="small"
            type="danger"
            @click="deleteCheckinPlan(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading"
      class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.current"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="100px">
        <el-form-item label="计划名称"
          prop="planName">
          <el-input v-model="form.planName"
            placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="考试项目"
          prop="itemId">
          <el-select class="filter-item"
            v-model="form.itemId"
            filterable
            placeholder="请选择考试项目"
            style="width:350px">
            <el-option v-for="item in examItems"
              :key="item.id"
              :label="item.itemName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
          type="primary"
          @click="createCheckinPlan('form')">确 定
        </el-button>
        <el-button v-else
          type="primary"
          @click="updateCheckinPlan('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 场次编排回话 -->
    <el-dialog :title="roundConfigTitle"
      width="50%"
      :visible.sync="roundConfigVisible">
      <RoundConfig :planId="currentPlanId"
        ref="roundConfig"
        @page="getList"></RoundConfig>
    </el-dialog>
    <!-- 场次编排回话 -->
    <el-dialog :title="deviceConfigTitle"
      width="60%"
      :visible.sync="deviceConfigVisible">
      <DeviceConfig :planId="currentPlanId"
        ref="deviceConfig"
        @page="getList"></DeviceConfig>
    </el-dialog>
  </div>
  <div v-else>
    <!-- 考生编辑会话 -->
    <PlanPeople :planId="currentPlanId"
      @closePlanPeopleDialog="closePlanPeopleDialog"
      ref="planPeopleClient"></PlanPeople>
  </div>
</template>

<script>
import { getCheckinPlansByPage, addCheckinPlan, getCheckinPlan, delCheckinPlan, updCheckinPlan } from '@/api/checkin/checkinPlan'
import { getExamItemList } from '@/api/base/examItem'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'checkinPlan',
  components: {
    'PlanPeople': () => import('./planPeople'),
    'RoundConfig': () => import('./roundConfig'),
    'DeviceConfig': () => import('./deviceConfig')
  },
  directives: {
    waves
  },
  data () {
    return {
      form: {
        planName: undefined,
        itemId: ''
      },
      rules: {
        planName: [
          {
            required: true,
            message: '请输入签到计划名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 40,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        itemId: [
          {
            required: true,
            message: '请选择考试项目',
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
        name: undefined
      },
      dialogFormVisible: false,
      planPeopleDialogVisible: false,
      dialogStatus: '',
      ck_checkinPlan_add: false,
      ck_checkinPlan_del: false,
      ck_checkinPlan_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      currentPlanId: '',
      examItems: [],
      roundConfigVisible: false,
      roundConfigTitle: '场次编辑',
      deviceConfigVisible: false,
      deviceConfigTitle: '设备编排'
    }
  },
  created () {
    this.getList()
    this.ck_checkinPlan_add = this.permissions['ck_checkinPlan_add']
    this.ck_checkinPlan_edit = this.permissions['ck_checkinPlan_edit']
    this.ck_checkinPlan_del = this.permissions['ck_checkinPlan_del']
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '正常',
        1: '锁定'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      getCheckinPlansByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.current = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      getExamItemList().then(res => {
        this.examItems = res.data
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) { 
      getExamItemList().then(res => {
        this.examItems = res.data
      })
      getCheckinPlan(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteCheckinPlan (row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinPlan(row.id).then(() => {
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
    createCheckinPlan (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addCheckinPlan(this.form).then(() => {
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
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    updateCheckinPlan (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updCheckinPlan(this.form).then(() => {
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
    resetTemp () {
      this.form = {
        planName: undefined,
        roundCount: undefined,
        nodeCount: undefined,
        peopleCount: undefined
      }
    },
    handlePlanPeople (row) {
      this.currentPlanId = row.id
      this.planPeopleDialogVisible = true
    },
    closePlanPeopleDialog () {
      this.currentPlanId = ''
      this.planPeopleDialogVisible = false
      this.getList()
    },
    openRoundConfig (row) {
      this.currentPlanId = row.id
      this.roundConfigVisible = true
    },
    openDeviceConfig (row) {
      this.deviceConfigTitle = row.planName + "-设备编排"
      this.currentPlanId = row.id
      this.deviceConfigVisible = true
    },
    closeDeviceConfigDialog () {
      this.currentPlanId = ''
      this.deviceConfigVisible = false
      this.getList()
    },
  }
}
</script>
