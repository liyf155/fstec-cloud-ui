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
            <el-form-item>
              <el-input
                style="width:200px"
                class="filter-item"
                placeholder="模糊查询"
                v-model="listQuery.name"
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
            <!-- <el-button
              v-if="bd_emergencyCommand_add"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="handleCreate"
            >添加</el-button> -->
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
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="应急事件等级">
        <template slot-scope="scope">
          <span>{{scope.row.levelDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="应急事项" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.eventDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片路径">
        <template v-if="scope.row.photos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.photos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报人">
        <template slot-scope="scope">
          <span>{{scope.row.reportPeople}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报时间">
        <template slot-scope="scope" v-if="scope.row.reportTime">
          <span>{{scope.row.reportTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理时间">
        <template slot-scope="scope" v-if="scope.row.dealTime">
          <span>{{scope.row.dealTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理人员">
        <template slot-scope="scope">
          <span>{{scope.row.dealPeople}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理建议" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.handleAdvice}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button
            v-if="bd_emergencyCommand_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button> -->
          <el-button
            v-if="bd_emergencyCommand_edit"
            size="small"
            type="success"
            @click="handleEmergency(scope.row)"
          >应急处置</el-button>
          <!-- <el-button
            v-if="bd_emergencyCommand_del"
            size="small"
            type="danger"
            @click="deleteEmergencyCommand(scope.row)"
          >删除</el-button> -->
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
        <el-form-item label="应急事件等级:" prop="levelId">
          <el-select class="filter-item" v-model="this.levelId" filterable placeholder="请选择应急事件等级" style="width:350px" disabled>
            <el-option v-for="item in emergencyLevels" :key="item.id" :label="item.description" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应急事项:" prop="eventId">
          <el-select class="filter-item" v-model="this.eventId" filterable placeholder="请选择应急事项" style="width:550px" disabled>
            <el-option v-for="item in emergencyEvents" :key="item.id" :label="item.description" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处置措施:" prop="emergencyHandle">
          <el-input type="textarea" :rows="5" v-model="form.handleAdvice" placeholder="请参考处置措施建议"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel('form')" style="float: left"><u>处置措施建议</u></el-button>
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createEmergencyCommand('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateEmergencyCommand('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEmergencyCommandsByPage,
  addEmergencyCommand,
  getEmergencyCommand,
  delEmergencyCommand,
  updEmergencyCommand
} from '@/api/bigdata/emergencyCommand'
import {
  getEmergencyLevelList
} from '@/api/bigdata/emergencyLevel'
import {
  getEmergencyEventsByPage
} from '@/api/bigdata/emergencyEvent'
import {
  getHandleByEventId
} from '@/api/bigdata/emergencyHandle'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'emergencyCommand',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        nodeId: undefined,
        nodeName: undefined,
        emergencyLevel: undefined,
        emergencyType: undefined,
        photos: undefined,
        reportTime: undefined,
        reportPeople: undefined,
        dealTime: undefined,
        dealPeople: undefined,
        status: undefined,
        phone: undefined,
        postId: undefined,
        postName: undefined,
        handleAdvice: undefined
      },
      planId: '',
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
      dialogStatus: '',
      bd_emergencyCommand_add: false,
      bd_emergencyCommand_del: false,
      bd_emergencyCommand_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      levelId: undefined,
      eventId: undefined,
      emergencyLevels: [],
      emergencyEvents: [],
      emergencyHandle: ''
    }
  },
  created() {
    this.bd_emergencyCommand_add = this.permissions['bd_emergencyCommand_add']
    this.bd_emergencyCommand_edit = this.permissions[
      'bd_emergencyCommand_edit'
    ]
    this.bd_emergencyCommand_del = this.permissions['bd_emergencyCommand_del']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未处置',
        1: '已处置'
      }
      return statusMap[status]
    }
  },
  methods: {
    getList(planId) {
      this.planId = planId
      this.listLoading = true
      this.listQuery.planId = planId
      getEmergencyCommandsByPage(this.listQuery).then(response => {
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
      getEmergencyCommand(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteEmergencyCommand(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delEmergencyCommand(row.id).then(() => {
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
    createEmergencyCommand(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addEmergencyCommand(this.form).then(() => {
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
    updateEmergencyCommand(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updEmergencyCommand(this.form).then(() => {
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
        nodeId: undefined,
        nodeName: undefined,
        emergencyLevel: undefined,
        emergencyType: undefined,
        photos: undefined,
        reportTime: undefined,
        reportPeople: undefined,
        dealTime: undefined,
        dealPeople: undefined,
        status: undefined,
        phone: undefined,
        postId: undefined,
        postName: undefined,
        handleAdvice: undefined
      }
    },
    handleEmergency(row) {
      this.levelId = row.levelId
      this.eventId = row.eventId
      this.getEmergencyLevels()
      this.getEmergencyEvent(row.levelId)
      this.getEmergencyHandle()
      getEmergencyCommand(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    getEmergencyLevels() {
      getEmergencyLevelList().then(res => {
        this.emergencyLevels = res.data
      })
    },
    getEmergencyEvent(levelId) {
      this.emergencyEvents = []
      const query = {
        current: 1,
        size: 100,
        levelId: levelId
      }
      getEmergencyEventsByPage(query).then(res => {
        this.emergencyEvents = res.data.records
      })
    },
    getEmergencyHandle() {
      getHandleByEventId(this.eventId).then(res => {
        if (res.data != null) {
          this.form.handleAdvice = res.data.handleAdvice
        }
      })
    }
  }
}
</script>
