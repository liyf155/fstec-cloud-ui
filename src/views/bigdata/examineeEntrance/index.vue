<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="7">
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
            <el-button
              v-if="bd_examineeEntrance_add"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="handleCreate"
            >添加</el-button>
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
      <el-table-column align="center" label="场次时间">
        <template slot-scope="scope">
          <span>{{scope.row.roundTimeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场总数">
        <template slot-scope="scope">
          <span>{{scope.row.roomCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="试卷分发">
        <template slot-scope="scope">
          <span>{{scope.row.paperHandOut | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入场情况">
        <template slot-scope="scope">
          <span>{{scope.row.entranceStatus | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_examineeEntrance_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_examineeEntrance_del"
            size="small"
            type="danger"
            @click="deleteExamineeEntrance(scope.row)"
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
        <el-form-item label="场次ID" prop="roundId">
          <el-input v-model="form.roundId" placeholder="请输入场次ID"></el-input>
        </el-form-item>
        <el-form-item label="场次时间" prop="roundTimeStr">
          <el-input v-model="form.roundTimeStr" placeholder="请输入场次时间"></el-input>
        </el-form-item>
        <el-form-item label="考场总数" prop="roomCount">
          <el-input v-model="form.roomCount" placeholder="请输入考场总数"></el-input>
        </el-form-item>
        <el-form-item label="试卷分发" prop="paperHandOut">
          <el-input v-model="form.paperHandOut" placeholder="请输入试卷分发"></el-input>
        </el-form-item>
        <el-form-item label="入场情况" prop="entranceStatus">
          <el-input v-model="form.entranceStatus" placeholder="请输入入场情况"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createExamineeEntrance('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateExamineeEntrance('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamineeEntrancesByPage,
  addExamineeEntrance,
  getExamineeEntrance,
  delExamineeEntrance,
  updExamineeEntrance
} from '@/api/bigdata/examineeEntrance'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examineeEntrance',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        baseId: undefined,
        roundId: undefined,
        roundTimeStr: undefined,
        roomCount: undefined,
        paperHandOut: undefined,
        entranceStatus: undefined
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
      dialogStatus: '',
      bd_examineeEntrance_add: false,
      bd_examineeEntrance_del: false,
      bd_examineeEntrance_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.bd_examineeEntrance_add = this.permissions['bd_examineeEntrance_add']
    this.bd_examineeEntrance_edit = this.permissions[
      'bd_examineeEntrance_edit'
    ]
    this.bd_examineeEntrance_del = this.permissions['bd_examineeEntrance_del']
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
      getExamineeEntrancesByPage(this.listQuery).then(response => {
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
      getExamineeEntrance(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamineeEntrance(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamineeEntrance(row.id).then(() => {
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
    createExamineeEntrance(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamineeEntrance(this.form).then(() => {
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
    updateExamineeEntrance(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamineeEntrance(this.form).then(() => {
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
        roundId: undefined,
        roundTimeStr: undefined,
        roomCount: undefined,
        paperHandOut: undefined,
        entranceStatus: undefined
      }
    }
  }
}
</script>
