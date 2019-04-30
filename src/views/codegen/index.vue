<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="表名称" v-model="listQuery.tableName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="generateCode" type="primary" icon="el-icon-edit">生成代码
      </el-button>
    </div>
    <el-table :key='tableKey' ref="multipleTable" :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column align="center" label="表名称">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="表注释">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据库引擎">
        <template slot-scope="scope">
          <span>{{ scope.row.engine }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template> 

<script>
import { fetchList, generateAndDownload } from '@/api/codegen/gen'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'table_codegen',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },
      statusOptions: ['0', '1'],
      tableKey: 0,
      currentId: -1,
      selectedTables: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '正常',
        1: '已锁定'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
    generateCode() {
      const selectResults = this.$refs.multipleTable.store.states.selection
      selectResults.forEach(element => {
        this.selectedTables.push(element.tableName)
      })
      if (this.selectedTables.size === 0) {
        Message({
          message: '请至少选择一行在进行操作',
          type: 'warning'
        })
      } else {
        generateAndDownload(this.selectedTables).then(() => {
          this.getList()
        })
      }
    }
  }
}
</script>
