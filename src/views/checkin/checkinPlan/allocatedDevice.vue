<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="模糊查询"
          v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter">搜索</el-button>
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
        label="设备串号">
        <template slot-scope="scope">
          <span>{{scope.row.imeiNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="计划开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="计划结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
        align="center"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button size="small"
            type="danger"
            @click="deletePlanDevice(scope.row)">删除
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
import {getPlanDevicesByPage, addPlanDevice, getPlanDevice, delPlanDevice, updPlanDevice} from '@/api/checkin/planDevice';
import {allcatedExamNodes} from '@/api/checkin/checkinPeople'
  import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'allocatedDevice',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        planId : undefined
        ,deviceId : undefined
        ,imeiNo : undefined
        ,nodeId : undefined
        ,nodeName : undefined
        ,beginTime : undefined
        ,endTime : undefined
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
      ck_planDevice_add: false,
      ck_planDevice_del: false,
      ck_planDevice_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      allocatedExamNodes: []
    }
  },
  created() {
    this.getList();
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
      getPlanDevicesByPage(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.listQuery.current = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getPlanDevice(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    deletePlanDevice(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPlanDevice(row.id).then(() => {
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
    createPlanDevice(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addPlanDevice(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    updatePlanDevice(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updPlanDevice(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    resetTemp() {
      this.form = {
        planId : undefined,
        deviceId : undefined,
        imeiNo : undefined,
        nodeId : undefined,
        nodeName : undefined,
        beginTime : undefined,
        endTime : undefined                 
      };
    }
  }
}
</script>
