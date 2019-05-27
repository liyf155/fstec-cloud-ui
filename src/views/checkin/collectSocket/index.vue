<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="模糊查询"
          v-model="listQuery.name"
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
    >
      <el-table-column align="center" label="所属省份">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属城市">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件照">
        <template v-if="scope.row.certPhoto" slot-scope="scope">
          <div class="images" v-viewer>
          <img v-for="item in (scope.row.certPhoto.split(','))" :src="item" :key="item" style="width: 90px;height: 100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="现场照片">
        <template v-if="scope.row.scenePhoto" slot-scope="scope">
          <div class="images" v-viewer>
          <img v-for="item in (scope.row.scenePhoto.split(','))" :src="item" :key="item" style="width: 90px;height: 100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="采集时间">
        <template slot-scope="scope">
          <span>{{scope.row.collectTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="核验人">
        <template slot-scope="scope">
          <span>{{scope.row.manualName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.manualPhone}}</span>
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
import {
  getCollectSocketsByPage,
  addCollectSocket,
  getCollectSocket,
  delCollectSocket,
  updCollectSocket
} from "@/api/checkin/collectSocket";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹
export default {
  name: "collectSocket",
  directives: {
    waves
  },
  data() {
    return {
      form: {
        name: undefined,
        cardNum: undefined,
        cardExpiry: undefined,
        compScore: undefined,
        compType: undefined,
        planId: undefined,
        nodeId: undefined,
        manualName: undefined,
        manualPhone: undefined,
        certPhoto: undefined,
        scenePhoto: undefined
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
      dialogStatus: "",
      ck_collectSocket_add: false,
      ck_collectSocket_del: false,
      ck_collectSocket_edit: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  created() {
    this.getList();
    this.ck_collectSocket_add = this.permissions["ck_collectSocket_add"];
    this.ck_collectSocket_edit = this.permissions["ck_collectSocket_edit"];
    this.ck_collectSocket_del = this.permissions["ck_collectSocket_del"];
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
      getCollectSocketsByPage(this.listQuery).then(response => {
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
      getCollectSocket(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    deleteCollectSocket(row) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delCollectSocket(row.id).then(() => {
          this.getList();
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
    createCollectSocket(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addCollectSocket(this.form).then(() => {
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
    updateCollectSocket(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updCollectSocket(this.form).then(() => {
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
        name: undefined,
        cardNum: undefined,
        cardExpiry: undefined,
        compScore: undefined,
        compType: undefined,
        planId: undefined,
        nodeId: undefined,
        manualName: undefined,
        manualPhone: undefined,
        certPhoto: undefined,
        scenePhoto: undefined
      };
    }
  }
};
</script>
