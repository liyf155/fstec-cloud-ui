<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="ck_checkinPeople_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加
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
                      <el-table-column align="center" label="省份ID">
        <template slot-scope="scope">
          <span>{{scope.row.provinceId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="省份名称">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="城市ID">
        <template slot-scope="scope">
          <span>{{scope.row.cityId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="城市名称">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="考点ID">
        <template slot-scope="scope">
          <span>{{scope.row.nodeId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="岗位ID">
        <template slot-scope="scope">
          <span>{{scope.row.postId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="岗位名称">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="科目ID">
        <template slot-scope="scope">
          <span>{{scope.row.subjectId}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="科目名称">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.linkerPhone}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
                      <el-table-column align="center" label="相片信息">
        <template slot-scope="scope">
          <span>{{scope.row.photoInfo}}</span>
        </template>
      </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinPeople_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="ck_checkinPeople_del" size="small" type="danger" @click="deleteCheckinPeople(scope.row)">删除
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
                            <el-form-item label="省份ID" prop="provinceId">
  <el-input v-model="form.provinceId" placeholder="请输入省份ID"></el-input>
</el-form-item>
                            <el-form-item label="省份名称" prop="provinceName">
  <el-input v-model="form.provinceName" placeholder="请输入省份名称"></el-input>
</el-form-item>
                            <el-form-item label="城市ID" prop="cityId">
  <el-input v-model="form.cityId" placeholder="请输入城市ID"></el-input>
</el-form-item>
                            <el-form-item label="城市名称" prop="cityName">
  <el-input v-model="form.cityName" placeholder="请输入城市名称"></el-input>
</el-form-item>
                            <el-form-item label="考点ID" prop="nodeId">
  <el-input v-model="form.nodeId" placeholder="请输入考点ID"></el-input>
</el-form-item>
                            <el-form-item label="考点名称" prop="nodeName">
  <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
</el-form-item>
                            <el-form-item label="姓名" prop="name">
  <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
</el-form-item>
                            <el-form-item label="身份证号" prop="certId">
  <el-input v-model="form.certId" placeholder="请输入身份证号"></el-input>
</el-form-item>
                            <el-form-item label="性别" prop="sex">
  <el-input v-model="form.sex" placeholder="请输入性别"></el-input>
</el-form-item>
                            <el-form-item label="岗位ID" prop="postId">
  <el-input v-model="form.postId" placeholder="请输入岗位ID"></el-input>
</el-form-item>
                            <el-form-item label="岗位名称" prop="postName">
  <el-input v-model="form.postName" placeholder="请输入岗位名称"></el-input>
</el-form-item>
                            <el-form-item label="科目ID" prop="subjectId">
  <el-input v-model="form.subjectId" placeholder="请输入科目ID"></el-input>
</el-form-item>
                            <el-form-item label="科目名称" prop="subjectName">
  <el-input v-model="form.subjectName" placeholder="请输入科目名称"></el-input>
</el-form-item>
                            <el-form-item label="联系方式" prop="linkerPhone">
  <el-input v-model="form.linkerPhone" placeholder="请输入联系方式"></el-input>
</el-form-item>
                            <el-form-item label="备注" prop="remark">
  <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
</el-form-item>
                            <el-form-item label="相片信息" prop="photoInfo">
  <el-input v-model="form.photoInfo" placeholder="请输入相片信息"></el-input>
</el-form-item>
                        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createCheckinPeople('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateCheckinPeople('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCheckinPeoplesByPage, addCheckinPeople, getCheckinPeople, delCheckinPeople, updCheckinPeople} from '@/api/checkin/checkinPeople';
  import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'checkinPeople',
  directives: {
    waves
  },
  data() {
    return {
      form: {
                            planId : undefined
        ,
                                provinceId : undefined
        ,
                                provinceName : undefined
        ,
                                cityId : undefined
        ,
                                cityName : undefined
        ,
                                nodeId : undefined
        ,
                                nodeName : undefined
        ,
                                name : undefined
        ,
                                certId : undefined
        ,
                                sex : undefined
        ,
                                postId : undefined
        ,
                                postName : undefined
        ,
                                subjectId : undefined
        ,
                                subjectName : undefined
        ,
                                linkerPhone : undefined
        ,
                                remark : undefined
        ,
                                photoInfo : undefined
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
    ck_checkinPeople_add: false,
    ck_checkinPeople_del: false,
    ck_checkinPeople_edit: false,
    textMap: {
      update: '编辑',
      create: '创建'
    },
    tableKey: 0
  }
  },
  created() {
    this.getList();
    this.ck_checkinPeople_add = this.permissions['ck_checkinPeople_add']
    this.ck_checkinPeople_edit = this.permissions['ck_checkinPeople_edit']
    this.ck_checkinPeople_del = this.permissions['ck_checkinPeople_del']
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
      getCheckinPeoplesByPage(this.listQuery).then(response => {
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
      getCheckinPeople(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    deleteCheckinPeople(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinPeople(row.id).then(() => {
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
    createCheckinPeople(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addCheckinPeople(this.form).then(() => {
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
    updateCheckinPeople(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updCheckinPeople(this.form).then(() => {
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
                                    provinceId : undefined,
                                    provinceName : undefined,
                                    cityId : undefined,
                                    cityName : undefined,
                                    nodeId : undefined,
                                    nodeName : undefined,
                                    name : undefined,
                                    certId : undefined,
                                    sex : undefined,
                                    postId : undefined,
                                    postName : undefined,
                                    subjectId : undefined,
                                    subjectName : undefined,
                                    linkerPhone : undefined,
                                    remark : undefined,
                                    photoInfo : undefined                  };
    }
  }
}
</script>
