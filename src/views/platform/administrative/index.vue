<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="模糊查询"
          v-model="listQuery.name"
        ></el-input>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button
          v-if="pf_administrative_add"
          class="filter-item"
          style="margin-left: 10px;"
          @click="handleCreate"
          type="primary"
          icon="el-icon-plus"
        >添加</el-button>
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
      <el-table-column align="center" label="区划代码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区划名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简名">
        <template slot-scope="scope">
          <span>{{scope.row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简称">
        <template slot-scope="scope">
          <span>{{scope.row.shortSalutation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经度">
        <template slot-scope="scope">
          <span>{{scope.row.lng}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="纬度">
        <template slot-scope="scope">
          <span>{{scope.row.lat}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示序号">
        <template slot-scope="scope">
          <span>{{scope.row.displayNo}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="pf_administrative_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="pf_administrative_del"
            size="small"
            type="danger"
            @click="deleteAdministrative(scope.row)"
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
        <el-form-item
          label="行政等级
            0-未指定
            1-自治区
            2-行政特区
            3-省
            4-直辖市
            6-地级市
            7-县级市"
          prop="level"
        >
          <el-input
            v-model="form.level"
            placeholder="请输入行政等级
            0-未指定
            1-自治区
            2-行政特区
            3-省
            4-直辖市
            6-地级市
            7-县级市"
          ></el-input>
        </el-form-item>
        <el-form-item label prop="enable">
          <el-input v-model="form.enable" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item
          label="删除状态
            0-未删除
            1-逻辑删除处理
            2-逻辑删除完成"
          prop="deleteState"
        >
          <el-input
            v-model="form.deleteState"
            placeholder="请输入删除状态
            0-未删除
            1-逻辑删除处理
            2-逻辑删除完成"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示序号" prop="displayNo">
          <el-input v-model="form.displayNo" placeholder="请输入显示序号"></el-input>
        </el-form-item>
        <el-form-item label prop="rgt">
          <el-input v-model="form.rgt" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label prop="lft">
          <el-input v-model="form.lft" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label prop="createTime">
          <el-input v-model="form.createTime" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label prop="creatorId">
          <el-input v-model="form.creatorId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="简名" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简名"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortSalutation">
          <el-input v-model="form.shortSalutation" placeholder="请输入简称"></el-input>
        </el-form-item>
        <el-form-item label="区划代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入区划代码"></el-input>
        </el-form-item>
        <el-form-item label="区划名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区划名称"></el-input>
        </el-form-item>
        <el-form-item label prop="creatorName">
          <el-input v-model="form.creatorName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createAdministrative('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateAdministrative('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdministrativesByPage,
  addAdministrative,
  getAdministrative,
  delAdministrative,
  updAdministrative
} from '@/api/platform/administrative'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'administrative',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        level: undefined,
        enable: undefined,
        deleteState: undefined,
        displayNo: undefined,
        rgt: undefined,
        lft: undefined,
        createTime: undefined,
        lng: undefined,
        lat: undefined,
        creatorId: undefined,
        shortName: undefined,
        shortSalutation: undefined,
        code: undefined,
        name: undefined,
        creatorName: undefined,
        parentId: undefined
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
      pf_administrative_add: false,
      pf_administrative_del: false,
      pf_administrative_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
    this.pf_administrative_add = this.permissions['pf_administrative_add']
    this.pf_administrative_edit = this.permissions['pf_administrative_edit']
    this.pf_administrative_del = this.permissions['pf_administrative_del']
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
      getAdministrativesByPage(this.listQuery).then(response => {
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
      getAdministrative(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteAdministrative(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAdministrative(row.id).then(() => {
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
    createAdministrative(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addAdministrative(this.form).then(() => {
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
    updateAdministrative(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updAdministrative(this.form).then(() => {
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
        level: undefined,
        enable: undefined,
        deleteState: undefined,
        displayNo: undefined,
        rgt: undefined,
        lft: undefined,
        createTime: undefined,
        lng: undefined,
        lat: undefined,
        creatorId: undefined,
        shortName: undefined,
        shortSalutation: undefined,
        code: undefined,
        name: undefined,
        creatorName: undefined,
        parentId: undefined
      }
    }
  }
}
</script>
