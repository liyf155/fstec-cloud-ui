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
        <el-button
          v-if="bd_emergencyHandle_add"
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
      <el-table-column align="center" label="应急事件分类" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.emergencyType | statusFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="编号" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.eventCode}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="应急事项" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.eventDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="应急处理措施">
        <template slot-scope="scope">
          <span>{{scope.row.handleAdvice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bd_emergencyHandle_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="bd_emergencyHandle_del"
            size="small"
            type="danger"
            @click="deleteEmergencyHandle(scope.row)"
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
        <el-form-item label="应急事件分类" prop="emergencyType">
          <el-select class="filter-item" v-model="form.emergencyType" filterable placeholder="请选择应急事件分类" style="width:350px">
            <el-option v-for="item in emergencyTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应急事件等级" prop="levelId">
          <el-select class="filter-item" v-model="levelId" filterable placeholder="请选择应急事件等级" style="width:350px" @change="selectEmergencyEvent">
            <el-option v-for="item in emergencyLevels" :key="item.id" :label="item.description" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应急事项" prop="eventId">
          <el-select class="filter-item" v-model="form.eventId" filterable placeholder="请选择应急事项" style="width:350px">
            <el-option v-for="item in emergencyEvents" :key="item.id" :label="item.description" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应急处理措施" prop="handleAdvice">
          <el-input type="textarea" :rows="3" v-model="form.handleAdvice" placeholder="请输入应急处理措施"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createEmergencyHandle('form')"
        >确 定</el-button>
        <el-button v-else type="primary" @click="updateEmergencyHandle('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEmergencyHandlesByPage,
  addEmergencyHandle,
  getEmergencyHandle,
  delEmergencyHandle,
  updEmergencyHandle
} from "@/api/bigdata/emergencyHandle";
import {
  getEmergencyLevelList
} from "@/api/bigdata/emergencyLevel";
import {
  getEmergencyEventsByPage
} from "@/api/bigdata/emergencyEvent";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹
export default {
  name: "emergencyHandle",
  directives: {
    waves
  },
  data() {
    return {
      form: {
        eventId: undefined,
        handleAdvice: undefined,
        remark: undefined,
        emergencyType: undefined,
        levelId: undefined,
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
      bd_emergencyHandle_add: false,
      bd_emergencyHandle_del: false,
      bd_emergencyHandle_edit: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      emergencyTypes: [
        {value: '1', label: '试卷管理'},
        {value: '2', label: '考场管理'},
        {value: '3', label: '自然灾害和事故'},
        {value: '4', label: '计算机系统安全'}
      ],
      emergencyLevels: [],
      levelId: '',
      emergencyEvents: []
    };
  },
  created() {
    this.getList();
    this.bd_emergencyHandle_add = this.permissions["bd_emergencyHandle_add"];
    this.bd_emergencyHandle_edit = this.permissions["bd_emergencyHandle_edit"];
    this.bd_emergencyHandle_del = this.permissions["bd_emergencyHandle_del"];
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        // 1-试卷管理 2-考场管理 3-自然灾害和事故 4-计算机系统安全
        1: "试卷管理",
        2: "考场管理",
        3: '自然灾害和事故',
        4: '计算机系统安全'
      };
      return statusMap[status];
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getEmergencyHandlesByPage(this.listQuery).then(response => {
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
      this.getEmergencyLevels();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      this.getEmergencyLevels();
      getEmergencyHandle(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    deleteEmergencyHandle(row) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delEmergencyHandle(row.id).then(() => {
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
    createEmergencyHandle(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addEmergencyHandle(this.form).then(() => {
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
    updateEmergencyHandle(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updEmergencyHandle(this.form).then(() => {
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
        eventId: undefined,
        handleAdvice: undefined,
        remark: undefined,
        emergencyType: undefined
      };
    },
    getEmergencyLevels() {
      getEmergencyLevelList().then(res => {
        this.emergencyLevels = res.data;
      });
    },
    selectEmergencyEvent() {
      this.emergencyEvents = [];
      const query = {
        current: 1,
        size: 100,
        levelId: this.levelId
      }
      getEmergencyEventsByPage(query).then(res => {
        this.emergencyEvents = res.data.records
      }) 
    }
  }
};
</script>
