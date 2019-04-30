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
            <el-form-item label="考生姓名:">
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
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.examineeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="准考证号">
        <template slot-scope="scope">
          <span>{{scope.row.examCertId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场号">
        <template slot-scope="scope">
          <span>{{scope.row.roomName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="座位号">
        <template slot-scope="scope">
          <span>{{scope.row.seatNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目名称">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="违纪编码">
        <template slot-scope="scope">
          <span>{{scope.row.disciplineCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="违纪描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场记录单">
        <template v-if="scope.row.examRoomPhotos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.examRoomPhotos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="准考证照片">
        <template v-if="scope.row.examCertIdPhotos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.examCertIdPhotos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件照片">
        <template v-if="scope.row.certIdPhotos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.certIdPhotos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="其他材料">
        <template v-if="scope.row.otherPhotos" slot-scope="scope">
          <div class="images" v-viewer>
            <img v-for="item in (scope.row.otherPhotos.split(','))" :src="item" :key="item" style="width: 40px;height: 40px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="监考老师1">
        <template slot-scope="scope">
          <span>{{scope.row.invigilator1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="监考老师1手机">
        <template slot-scope="scope">
          <span>{{scope.row.invigilatorPhone1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="监考老师2">
        <template slot-scope="scope">
          <span>{{scope.row.invigilator2}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="监考老师2手机">
        <template slot-scope="scope">
          <span>{{scope.row.invigilatorPhone2}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考生联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.examineePhone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考生通讯地址" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.examineeAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上报时间">
        <template slot-scope="scope">
          <span>{{scope.row.reportTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_disciplineHandle_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_disciplineHandle_del"
            size="small"
            type="danger"
            @click="deleteDisciplineHandle(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column> -->
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
        <el-form-item label="考试计划ID" prop="planId">
          <el-input v-model="form.planId" placeholder="请输入考试计划ID"></el-input>
        </el-form-item>
        <el-form-item label="考区ID" prop="administrativeId">
          <el-input v-model="form.administrativeId" placeholder="请输入考区ID"></el-input>
        </el-form-item>
        <el-form-item label="考点ID" prop="nodeId">
          <el-input v-model="form.nodeId" placeholder="请输入考点ID"></el-input>
        </el-form-item>
        <el-form-item label="考区名称" prop="administrativeName">
          <el-input v-model="form.administrativeName" placeholder="请输入考区名称"></el-input>
        </el-form-item>
        <el-form-item label="考点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="examineeName">
          <el-input v-model="form.examineeName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="证件号" prop="certId">
          <el-input v-model="form.certId" placeholder="请输入证件号"></el-input>
        </el-form-item>
        <el-form-item label="准考证号" prop="examCertId">
          <el-input v-model="form.examCertId" placeholder="请输入准考证号"></el-input>
        </el-form-item>
        <el-form-item label="考场号" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入考场号"></el-input>
        </el-form-item>
        <el-form-item label="座位号" prop="seatNo">
          <el-input v-model="form.seatNo" placeholder="请输入座位号"></el-input>
        </el-form-item>
        <el-form-item label="考场ID" prop="roomId">
          <el-input v-model="form.roomId" placeholder="请输入考场ID"></el-input>
        </el-form-item>
        <el-form-item label="科目ID" prop="subjectId">
          <el-input v-model="form.subjectId" placeholder="请输入科目ID"></el-input>
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="form.subjectName" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="上报时间" prop="reportTime">
          <el-input v-model="form.reportTime" placeholder="请输入上报时间"></el-input>
        </el-form-item>
        <el-form-item label="违纪原因" prop="disciplineReason">
          <el-input v-model="form.disciplineReason" placeholder="请输入违纪原因"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="photos">
          <el-input v-model="form.photos" placeholder="请输入照片"></el-input>
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
          @click="createDisciplineHandle('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateDisciplineHandle('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDisciplineHandlesByPage,
  addDisciplineHandle,
  getDisciplineHandle,
  delDisciplineHandle,
  updDisciplineHandle
} from '@/api/bigdata/disciplineHandle'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'disciplineHandle',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId: undefined,
        administrativeId: undefined,
        nodeId: undefined,
        administrativeName: undefined,
        nodeName: undefined,
        examineeName: undefined,
        certId: undefined,
        examCertId: undefined,
        roomName: undefined,
        seatNo: undefined,
        roomId: undefined,
        subjectId: undefined,
        subjectName: undefined,
        userId: undefined,
        userName: undefined,
        reportTime: undefined,
        disciplineReason: undefined,
        description: undefined,
        photos: undefined,
        remark: undefined
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
      bd_disciplineHandle_add: false,
      bd_disciplineHandle_del: false,
      bd_disciplineHandle_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      planId: ''
    }
  },
  created() {
    this.bd_disciplineHandle_add = this.permissions['bd_disciplineHandle_add']
    this.bd_disciplineHandle_edit = this.permissions[
      'bd_disciplineHandle_edit'
    ]
    this.bd_disciplineHandle_del = this.permissions['bd_disciplineHandle_del']
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
    getList(planId) {
      this.planId = planId
      this.listQuery.planId = planId
      this.listLoading = true
      getDisciplineHandlesByPage(this.listQuery).then(response => {
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
      getDisciplineHandle(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteDisciplineHandle(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDisciplineHandle(row.id).then(() => {
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
    createDisciplineHandle(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addDisciplineHandle(this.form).then(() => {
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
    updateDisciplineHandle(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updDisciplineHandle(this.form).then(() => {
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
        administrativeId: undefined,
        nodeId: undefined,
        administrativeName: undefined,
        nodeName: undefined,
        examineeName: undefined,
        certId: undefined,
        examCertId: undefined,
        roomName: undefined,
        seatNo: undefined,
        roomId: undefined,
        subjectId: undefined,
        subjectName: undefined,
        userId: undefined,
        userName: undefined,
        reportTime: undefined,
        disciplineReason: undefined,
        description: undefined,
        photos: undefined,
        remark: undefined
      }
    }
  }
}
</script>
