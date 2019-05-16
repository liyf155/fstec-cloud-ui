<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="ck_checkinRound_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加
        </el-button>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
              <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="计划ID">
        <template slot-scope="scope">
          <span>{{scope.row.planId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinRound_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="ck_checkinRound_del" size="small" type="danger" @click="deleteCheckinRound(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                                    <el-form-item label="计划ID" prop="planId">
  <el-input v-model="form.planId" placeholder="请输入计划ID"></el-input>
</el-form-item>
                            <el-form-item label="开始时间" prop="beginTime">
  <el-input v-model="form.beginTime" placeholder="请输入开始时间"></el-input>
</el-form-item>
                            <el-form-item label="结束时间" prop="endTime">
  <el-input v-model="form.endTime" placeholder="请输入结束时间"></el-input>
</el-form-item>
                        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createCheckinRound('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateCheckinRound('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCheckinRoundsByPage, addCheckinRound, getCheckinRound, delCheckinRound, updCheckinRound} from '@/api/checkin/checkinRound';
  import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'checkinRound',
  directives: {
    waves
  },
  data() {
    return {
      form: {
                            planId : undefined
        ,
                                beginTime : undefined
        ,
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
    ck_checkinRound_add: false,
    ck_checkinRound_del: false,
    ck_checkinRound_edit: false,
    textMap: {
      update: '编辑',
      create: '创建'
    },
    tableKey: 0
  }
  },
  created() {
    this.getList();
    this.ck_checkinRound_add = this.permissions['ck_checkinRound_add']
    this.ck_checkinRound_edit = this.permissions['ck_checkinRound_edit']
    this.ck_checkinRound_del = this.permissions['ck_checkinRound_del']
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
      getCheckinRound(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
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
    createCheckinRound(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addCheckinRound(this.form).then(() => {
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
    updateCheckinRound(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updCheckinRound(this.form).then(() => {
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
                                    beginTime : undefined,
                                    endTime : undefined                  };
    }
  }
}
</script>
