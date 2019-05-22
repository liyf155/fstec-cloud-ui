<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="roundTimeSelect"
        value-format="timestamp"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-button type="primary"
        @click="createCheckinRound()">添 加</el-button>
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
        label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button size="small"
            type="danger"
            @click="deleteCheckinRound(scope.row)">删除
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
        :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
import {getCheckinRoundsByPage, addCheckinRound, getCheckinRound, delCheckinRound, updCheckinRound} from '@/api/checkin/checkinRound';
  import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'checkinRound',
  props: {
    planId: {
      default: undefined
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      form: {     
        planId : undefined,
        beginTime : undefined,
        endTime : undefined
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
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      roundTimeSelect: undefined
    }
  },
  created() {
    this.resetTemp();
    this.getList()
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
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
      this.listLoading = true;
      getCheckinRoundsByPage(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.getList();
    },
    deleteCheckinRound(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinRound(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    createCheckinRound() {
      if (!this.roundTimeSelect) {
        this.$notify({
          title: '提示',
          message: '请选择场次的开始时间和结束时间',
          type: 'info',
          duration: 3000
        });
        return;
      }
      this.form.beginTime = this.roundTimeSelect[0]
      this.form.endTime = this.roundTimeSelect[1]
      this.form.planId = this.planId
      addCheckinRound(this.form).then(() => {
        this.getList()
        this.resetTemp()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetTemp() {
      this.form = {
        planId : undefined,
        beginTime : undefined,
        endTime : undefined                 
      };
      this.roundTimeSelect = undefined
    }
  }
}
</script>
