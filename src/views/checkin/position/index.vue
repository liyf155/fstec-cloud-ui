<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="ck_position_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加
        </el-button>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
              <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="岗位名称">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="岗位描述">
        <template slot-scope="scope">
          <span>{{scope.row.postDesc}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="删除标识">
        <template slot-scope="scope">
          <span>{{scope.row.delFlag}}</span>
        </template>
      </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_position_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="ck_position_del" size="small" type="danger" @click="deletePosition(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                                    <el-form-item label="岗位名称" prop="postName">
  <el-input v-model="form.postName" placeholder="请输入岗位名称"></el-input>
</el-form-item>
                            <el-form-item label="岗位描述" prop="postDesc">
  <el-input v-model="form.postDesc" placeholder="请输入岗位描述"></el-input>
</el-form-item>
                            <el-form-item label="删除标识" prop="delFlag">
  <el-input v-model="form.delFlag" placeholder="请输入删除标识"></el-input>
</el-form-item>
                        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createPosition('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updatePosition('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getPositionsByPage, addPosition, getPosition, delPosition, updPosition} from '@/api/checkin/position';
  import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'position',
  directives: {
    waves
  },
  data() {
    return {
      form: {
                            postName : undefined
        ,
                                postDesc : undefined
        ,
                                delFlag : undefined
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
    ck_position_add: false,
    ck_position_del: false,
    ck_position_edit: false,
    textMap: {
      update: '编辑',
      create: '创建'
    },
    tableKey: 0
  }
  },
  created() {
    this.getList();
    this.ck_position_add = this.permissions['ck_position_add']
    this.ck_position_edit = this.permissions['ck_position_edit']
    this.ck_position_del = this.permissions['ck_position_del']
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
      getPositionsByPage(this.listQuery).then(response => {
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
      getPosition(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    deletePosition(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPosition(row.id).then(() => {
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
    createPosition(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addPosition(this.form).then(() => {
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
    updatePosition(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updPosition(this.form).then(() => {
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
                                  postName : undefined,
                                    postDesc : undefined,
                                    delFlag : undefined                  };
    }
  }
}
</script>
