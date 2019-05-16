<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="ck_checkinPlan_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加
        </el-button>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
              <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="计划名称">
        <template slot-scope="scope">
          <span>{{scope.row.planName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="场次数量">
        <template slot-scope="scope">
          <span>{{scope.row.roundCount}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="考点数量">
        <template slot-scope="scope">
          <span>{{scope.row.nodeCount}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="计划开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.beginTime}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="计划结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="0-未删除1-逻辑删除">
        <template slot-scope="scope">
          <span>{{scope.row.delFlag}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="创建人ID">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinPlan_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="ck_checkinPlan_del" size="small" type="danger" @click="deleteCheckinPlan(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                                    <el-form-item label="计划名称" prop="planName">
  <el-input v-model="form.planName" placeholder="请输入计划名称"></el-input>
</el-form-item>
                            <el-form-item label="场次数量" prop="roundCount">
  <el-input v-model="form.roundCount" placeholder="请输入场次数量"></el-input>
</el-form-item>
                            <el-form-item label="考点数量" prop="nodeCount">
  <el-input v-model="form.nodeCount" placeholder="请输入考点数量"></el-input>
</el-form-item>
                            <el-form-item label="计划开始时间" prop="beginTime">
  <el-input v-model="form.beginTime" placeholder="请输入计划开始时间"></el-input>
</el-form-item>
                            <el-form-item label="计划结束时间" prop="endTime">
  <el-input v-model="form.endTime" placeholder="请输入计划结束时间"></el-input>
</el-form-item>
                            <el-form-item label="0-未删除1-逻辑删除" prop="delFlag">
  <el-input v-model="form.delFlag" placeholder="请输入0-未删除1-逻辑删除"></el-input>
</el-form-item>
                            <el-form-item label="创建人ID" prop="createBy">
  <el-input v-model="form.createBy" placeholder="请输入创建人ID"></el-input>
</el-form-item>
                            <el-form-item label="创建时间" prop="createTime">
  <el-input v-model="form.createTime" placeholder="请输入创建时间"></el-input>
</el-form-item>
                            <el-form-item label="更新人" prop="updateBy">
  <el-input v-model="form.updateBy" placeholder="请输入更新人"></el-input>
</el-form-item>
                            <el-form-item label="更新时间" prop="updateTime">
  <el-input v-model="form.updateTime" placeholder="请输入更新时间"></el-input>
</el-form-item>
                        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createCheckinPlan('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateCheckinPlan('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCheckinPlansByPage, addCheckinPlan, getCheckinPlan, delCheckinPlan, updCheckinPlan} from '@/api/checkin/checkinPlan';
  import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'checkinPlan',
  directives: {
    waves
  },
  data() {
    return {
      form: {
                            planName : undefined
        ,
                                roundCount : undefined
        ,
                                nodeCount : undefined
        ,
                                beginTime : undefined
        ,
                                endTime : undefined
        ,
                                delFlag : undefined
        ,
                                createBy : undefined
        ,
                                createTime : undefined
        ,
                                updateBy : undefined
        ,
                                updateTime : undefined
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
    ck_checkinPlan_add: false,
    ck_checkinPlan_del: false,
    ck_checkinPlan_edit: false,
    textMap: {
      update: '编辑',
      create: '创建'
    },
    tableKey: 0
  }
  },
  created() {
    this.getList();
    this.ck_checkinPlan_add = this.permissions['ck_checkinPlan_add']
    this.ck_checkinPlan_edit = this.permissions['ck_checkinPlan_edit']
    this.ck_checkinPlan_del = this.permissions['ck_checkinPlan_del']
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
      getCheckinPlansByPage(this.listQuery).then(response => {
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
      getCheckinPlan(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    deleteCheckinPlan(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinPlan(row.id).then(() => {
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
    createCheckinPlan(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addCheckinPlan(this.form).then(() => {
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
    updateCheckinPlan(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updCheckinPlan(this.form).then(() => {
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
                                  planName : undefined,
                                    roundCount : undefined,
                                    nodeCount : undefined,
                                    beginTime : undefined,
                                    endTime : undefined,
                                    delFlag : undefined,
                                    createBy : undefined,
                                    createTime : undefined,
                                    updateBy : undefined,
                                    updateTime : undefined                  };
    }
  }
}
</script>
