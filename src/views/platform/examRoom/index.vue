<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
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
              v-if="nm_examRoom_add"
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
      <el-table-column align="center" label="考点ID">
        <template slot-scope="scope">
          <span>{{scope.row.nodeId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="授权序列号">
        <template slot-scope="scope">
          <span>{{scope.row.authNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场编号">
        <template slot-scope="scope">
          <span>{{scope.row.seq}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="座位数">
        <template slot-scope="scope">
          <span>{{scope.row.seatCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场名称">
        <template slot-scope="scope">
          <span>{{scope.row.venueName}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="nm_examRoom_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="nm_examRoom_del"
            size="small"
            type="danger"
            @click="deleteExamRoom(scope.row)"
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
        <el-form-item label="考点ID" prop="nodeId">
          <el-input v-model="form.nodeId" placeholder="请输入考点ID"></el-input>
        </el-form-item>
        <el-form-item label="授权序列号" prop="authNo">
          <el-input v-model="form.authNo" placeholder="请输入授权序列号"></el-input>
        </el-form-item>
        <el-form-item label="考场编号" prop="seq">
          <el-input v-model="form.seq" placeholder="请输入考场编号"></el-input>
        </el-form-item>
        <el-form-item label="座位数" prop="seatCount">
          <el-input v-model="form.seatCount" placeholder="请输入座位数"></el-input>
        </el-form-item>
        <el-form-item label="考场名称" prop="venueName">
          <el-input v-model="form.venueName" placeholder="请输入考场名称"></el-input>
        </el-form-item>
        <el-form-item
          label="删除状态
            0-未删除
            1-逻辑删除处理
            2-逻辑删除完成"
          prop="delFlag"
        >
          <el-input
            v-model="form.delFlag"
            placeholder="请输入删除状态
            0-未删除
            1-逻辑删除处理
            2-逻辑删除完成"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建人"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="form.createTime" placeholder="请输入创建时间"></el-input>
        </el-form-item>
        <el-form-item label="修改人" prop="updateBy">
          <el-input v-model="form.updateBy" placeholder="请输入修改人"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="updateTime">
          <el-input v-model="form.updateTime" placeholder="请输入修改时间"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createExamRoom('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateExamRoom('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamRoomsByPage,
  addExamRoom,
  getExamRoom,
  delExamRoom,
  updExamRoom
} from '@/api/platform/examRoom'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'examRoom',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        nodeId: undefined,
        authNo: undefined,
        seq: undefined,
        seatCount: undefined,
        venueName: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
      nm_examRoom_add: false,
      nm_examRoom_del: false,
      nm_examRoom_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.nm_examRoom_add = this.permissions['nm_examRoom_add']
    this.nm_examRoom_edit = this.permissions['nm_examRoom_edit']
    this.nm_examRoom_del = this.permissions['nm_examRoom_del']
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
    getList() {
      this.listLoading = true
      getExamRoomsByPage(this.listQuery).then(response => {
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
      getExamRoom(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamRoom(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamRoom(row.id).then(() => {
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
    createExamRoom(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addExamRoom(this.form).then(() => {
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
    updateExamRoom(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updExamRoom(this.form.id, this.form).then(() => {
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
    resetTemp() {
      this.form = {
        nodeId: undefined,
        authNo: undefined,
        seq: undefined,
        seatCount: undefined,
        venueName: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      }
    }
  }
}
</script>
