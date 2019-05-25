<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="计划ID：">
          <el-select v-model="listQuery.planId" placeholder="==请选择==" clearable>
            <el-option v-for="p in planIdList" :key="p.id" :label="p.planName" :value="p.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备串号：">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模糊查询" v-model="listQuery.imeiNo">
          </el-input>
        </el-form-item>
        <el-form-item label="数据类型：">
          <el-select v-model="listQuery.dataType" placeholder="==请选择==" clearable>
            <el-option v-for="d in dataTypeList" :key="d.value" :label="d.label" :value="d.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安检时间：">
          <el-date-picker
          v-model="value2"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[]">
        </el-date-picker>
      </el-form-item>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="ck_checkinSocket_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="download()">导出数据</el-button>
    </el-form>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
    <el-table-column align="center" label="计划名称">
      <template slot-scope="scope">
        <span>{{scope.row.planName}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="识别结果">
      <template slot-scope="scope">
        <span>{{scope.row.isPass}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="通道类型">
      <template slot-scope="scope">
        <span>{{scope.row.passType}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="识别分数">
      <template slot-scope="scope">
        <span>{{scope.row.compScore}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="安检时间">
      <template slot-scope="scope">
        <span>{{scope.row.verifyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="上传时间">
      <template slot-scope="scope">
        <span>{{scope.row.uploadTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="设备串号">
      <template slot-scope="scope">
        <span>{{scope.row.imeiNo}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="数据类型">
      <template slot-scope="scope">
        <span>{{scope.row.dataType}}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" align="center" label="操作" width="150">
      <template slot-scope="scope">
        <el-button v-if="ck_checkinSocket_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="ck_checkinSocket_del" size="small" type="danger" @click="deleteCheckinSocket(scope.row)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="工作人员ID" prop="peopleId">
        <el-input v-model="form.peopleId" placeholder="请输入工作人员ID"></el-input>
      </el-form-item>
      <el-form-item label="计划ID" prop="planId">
        <el-input v-model="form.planId" placeholder="请输入计划ID"></el-input>
      </el-form-item>
      <el-form-item label="识别结果 0.通过, 1.身份证过期, 2.证件姓名和报名姓名比一样, 3.证件照片加载失败, 4.报名照片加载失败, 5.报名照片不存在, 6.证件照片不存在, 7.照片比对失败 " prop="isPass">
        <el-input v-model="form.isPass" placeholder="请输入识别结果 0.通过, 1.身份证过期, 2.证件姓名和报名姓名比一样, 3.证件照片加载失败, 4.报名照片加载失败, 5.报名照片不存在, 6.证件照片不存在, 7.照片比对失败 "></el-input>
      </el-form-item>
      <el-form-item label="通道类型" prop="passType">
        <el-input v-model="form.passType" placeholder="请输入通道类型"></el-input>
      </el-form-item>
      <el-form-item label="识别分数" prop="compScore">
        <el-input v-model="form.compScore" placeholder="请输入识别分数"></el-input>
      </el-form-item>
      <el-form-item label="人像比分（1比1或者1比n的采集阈值）" prop="photoPrecision">
        <el-input v-model="form.photoPrecision" placeholder="请输入人像比分（1比1或者1比n的采集阈值）"></el-input>
      </el-form-item>
      <el-form-item label="人像比分(1比n的客户端比对阈值)" prop="nPhotoPrecision">
        <el-input v-model="form.nPhotoPrecision" placeholder="请输入人像比分(1比n的客户端比对阈值)"></el-input>
      </el-form-item>
      <el-form-item label="安检时间" prop="verifyTime">
        <el-input v-model="form.verifyTime" placeholder="请输入安检时间"></el-input>
      </el-form-item>
      <el-form-item label="上传时间" prop="uploadTime">
        <el-input v-model="form.uploadTime" placeholder="请输入上传时间"></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="form.createTime" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="设备串号" prop="imeiNo">
        <el-input v-model="form.imeiNo" placeholder="请输入设备串号"></el-input>
      </el-form-item>
      <el-form-item label="身份证有效期" prop="faceIndetityDate">
        <el-input v-model="form.faceIndetityDate" placeholder="请输入身份证有效期"></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="dataType">
        <el-input v-model="form.dataType" placeholder="请输入数据类型"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createCheckinSocket('form')">确 定</el-button>
      <el-button v-else type="primary" @click="updateCheckinSocket('form')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {getCheckinSocketsByPage, addCheckinSocket, getCheckinSocket, delCheckinSocket, updCheckinSocket,downloadCheckinSocket} from '@/api/checkin/checkinSocket';
import {getPlanIdList} from '@/api/checkin/checkinPlan'
import { mapGetters } from 'vuex';
  import waves from '@/directive/waves/index.js' // 水波纹
  export default {
    name: 'checkinSocket',
    directives: {
      waves
    },
    data() {
      return {
        form: {
          peopleId : undefined,
          planId : undefined,
          isPass : undefined,
          passType : undefined,
          compScore : undefined,
          photoPrecision : undefined,
          nPhotoPrecision : undefined,
          verifyTime : undefined,
          uploadTime : undefined,
          createTime : undefined,
          imeiNo : undefined,
          faceIndetityDate : undefined,
          dataType : undefined,
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
        ck_checkinSocket_add: false,
        ck_checkinSocket_del: false,
        ck_checkinSocket_edit: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        planIdList: null,
        dataTypeList: [
        {
          label: 0,
          value: 0
        },
        {
          label: 1,
          value: 1
        }
        ],
        checkinSocketDown: {
          planId : undefined,
          imeiNo : undefined,
          dataType : undefined
        },
        value2:[]
      }
    },
    created() {
      this.getList();
      this.getPlanIdList();
      this.ck_checkinSocket_add = this.permissions['ck_checkinSocket_add']
      this.ck_checkinSocket_edit = this.permissions['ck_checkinSocket_edit']
      this.ck_checkinSocket_del = this.permissions['ck_checkinSocket_del']
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
        if(this.value2 != null){
          this.listQuery.verifyTime = this.value2[0]
          this.listQuery.endTime = this.value2[1]
        }else{
          this.listQuery.verifyTime=undefined
          this.listQuery.endTime=undefined
        }
        getCheckinSocketsByPage(this.listQuery).then(response => {
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
        getCheckinSocket(row.id).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      deleteCheckinSocket(row) {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCheckinSocket(row.id).then(() => {
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
      createCheckinSocket(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addCheckinSocket(this.form).then(() => {
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
      updateCheckinSocket(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            updCheckinSocket(this.form).then(() => {
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
          peopleId : undefined,
          planId : undefined,
          isPass : undefined,
          passType : undefined,
          compScore : undefined,
          photoPrecision : undefined,
          nPhotoPrecision : undefined,
          verifyTime : undefined,
          uploadTime : undefined,
          createTime : undefined,
          imeiNo : undefined,
          faceIndetityDate : undefined,
          dataType : undefined
        };
      },
      getPlanIdList() {
        getPlanIdList().then(response => {
          this.planIdList = response.data
        })
      },
      download(){
        this.checkinSocketDown.planId = this.listQuery.planId
        this.checkinSocketDown.imeiNo = this.listQuery.imeiNo
        this.checkinSocketDown.dataType = this.listQuery.dataType
        downloadCheckinSocket(this.checkinSocketDown).then(() => {
          this.$notify({
            title: '成功',
            message: '导出成功',
            type: 'success',
            duration: 2000
          });
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '导出失败',
            type: 'error',
            duration: 2000
          });
        })
      }
    }
  }
  </script>
