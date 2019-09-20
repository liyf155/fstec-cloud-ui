<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-col :span="10">
          <el-form-item label="回收状态:">
            <el-select class="filter-item" v-model="listQuery.recycleStatus" clearable placeholder="=== 请选择 ===" @change="recycleStatusChange" style="width:200px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="考场名称（模糊查询）"
          v-model="listQuery.roomName"
        ></el-input>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
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
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="考场名称">
        <template slot-scope="scope">
          <span>{{scope.row.roomName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考场总数">
        <template slot-scope="scope">
          <span>{{scope.row.totalCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已回收数">
        <template slot-scope="scope">
          <span>{{scope.row.recycleCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回收状态">
        <template slot-scope="scope">
          <span>{{scope.row.recycleStatus | statusFilter}}</span>
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
  </div>
</template>

<script>
import { getRfidRecycleRoomsByPage } from '@/api/platform/rfidRecycleRoom'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'rfidRecycleRoom',
  directives: {
    waves
  },
  props: {
    recycleNodeId: String
  },
  data() {
    return {
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
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      recycleStatus: '',
      statusOptions: [
        {
          value: '0', label: '未回收'
        },
        {
          value: '1', label: '已回收'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未回收',
        1: '已回收'
      }
      return statusMap[status]
    }
  },
  watch: {
    recycleNodeId(newVal, oldVal) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.listQuery.recycleNodeId = this.recycleNodeId
      this.listLoading = true
      getRfidRecycleRoomsByPage(this.listQuery).then(response => {
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
    recycleStatusChange() {
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.recycleStatus === '1') {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
