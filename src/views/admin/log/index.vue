<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select style="width: 200px;" class="filter-item" v-model="listQuery.type" filterable placeholder="请选择">
        <el-option v-for="item in dicts" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ getSerialNumber(scope.$index) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>
            <el-button type="success" v-if="scope.row.type == 0">{{ scope.row.type | typeFilter }}</el-button>
            <el-button type="danger" v-if="scope.row.type ==9">{{ scope.row.type | typeFilter }}</el-button>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="请求接口" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址">
        <template slot-scope="scope">
          <span>{{ scope.row.remoteAddr }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="请求方式">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="传入参数" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="请求时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" v-if="sys_log_del" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { delLog, getLogsByPage } from '@/api/admin/log'
import { remote } from '@/api/admin/dict'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { mapGetters } from 'vuex'

export default {
  name: 'table_log',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      sys_dict_add: false,
      listLoading: true,
      dicts: [],
      listQuery: {
        current: 1, // 当前页数
        size: 10, // 每页显示多少条
        type: undefined
      },
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        0: '正常',
        9: '异常'
      }
      return typeMap[type]
    }
  },
  created() {
    this.getList()
    this.sys_log_del = this.permissions['sys_log_del']
    remote('log_type').then(response => {
      this.dicts = response.data
    })
  },
  methods: {
    getSerialNumber(index) {
      return index + 1 + (this.listQuery.current - 1) * this.listQuery.size
    },
    getList() {
      this.listLoading = true
      this.listQuery.orderByField = 'create_time'
      this.listQuery.isAsc = false
      getLogsByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleDelete(row) {
      delLog(row.id).then(response => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
