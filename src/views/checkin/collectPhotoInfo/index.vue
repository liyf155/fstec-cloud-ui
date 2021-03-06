<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="证件号"
          v-model="listQuery.certId"
        ></el-input>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button
          v-if="ck_collectPhotoInfo_add"
          class="filter-item"
          style="margin-left: 10px;"
          @click="handleCreate"
          type="primary"
          icon="el-icon-plus"
        >添加</el-button>
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
    >
      <el-table-column align="center" label="证件号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采集照片">
        <template v-if="scope.row.scenePhotoPath" slot-scope="scope">
          <div class="images" v-viewer>
          <img v-for="item in (scope.row.scenePhotoPath.split(','))" :src="item" :key="item" style="width: 90px;height: 100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上次采集时间">
        <template slot-scope="scope">
          <span>{{scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采集时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="ck_collectPhotoInfo_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="ck_collectPhotoInfo_del"
            size="small"
            type="danger"
            @click="deleteCollectPhotoInfo(scope.row)"
          >删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="采集照片存放路径" prop="photoPath">
          <el-input v-model="form.photoPath" placeholder="请输入采集照片存放路径"></el-input>
        </el-form-item>
        <el-form-item label="上次采集照片上传时间戳" prop="lastUpdateTime">
          <el-input v-model="form.lastUpdateTime" placeholder="请输入上次采集照片上传时间戳"></el-input>
        </el-form-item>
        <el-form-item label="现在采集照片上传时间戳" prop="updateTime">
          <el-input v-model="form.updateTime" placeholder="请输入现在采集照片上传时间戳"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createCollectPhotoInfo('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateCollectPhotoInfo('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCollectPhotoInfosByPage,
  addCollectPhotoInfo,
  getCollectPhotoInfo,
  delCollectPhotoInfo,
  updCollectPhotoInfo
} from "@/api/checkin/collectPhotoInfo";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹
export default {
  name: "collectPhotoInfo",
  directives: {
    waves
  },
  data() {
    return {
      form: {
        photoPath: undefined,
        lastUpdateTime: undefined,
        updateTime: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        certId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      ck_collectPhotoInfo_add: false,
      ck_collectPhotoInfo_del: false,
      ck_collectPhotoInfo_edit: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  created() {
    this.getList();
    this.ck_collectPhotoInfo_add = this.permissions["ck_collectPhotoInfo_add"];
    this.ck_collectPhotoInfo_edit = this.permissions[
      "ck_collectPhotoInfo_edit"
    ];
    this.ck_collectPhotoInfo_del = this.permissions["ck_collectPhotoInfo_del"];
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "正常",
        1: "锁定"
      };
      return statusMap[status];
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getCollectPhotoInfosByPage(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
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
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getCollectPhotoInfo(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    deleteCollectPhotoInfo(row) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delCollectPhotoInfo(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    createCollectPhotoInfo(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addCollectPhotoInfo(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
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
    updateCollectPhotoInfo(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updCollectPhotoInfo(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
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
        photoPath: undefined,
        lastUpdateTime: undefined,
        updateTime: undefined
      };
    },
  }
};
</script>
