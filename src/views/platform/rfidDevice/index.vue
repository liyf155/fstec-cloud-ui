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
          v-if="pf_device_add"
          class="filter-item"
          style="margin-left: 10px;"
          @click="handleCreate"
          type="primary"
          icon="el-icon-plus"
        >添加</el-button>
      </el-form>
    </div>
    <el-upload
      class="upload-demo"
      action="/platform/rfidDevice/upload"
      :headers="headers"
      :onError="uploadError"
      :onSuccess="uploadSuccess"
      :beforeUpload="beforeUpload"
      :show-file-list="false"
    >
      <el-button class="filter-item" type="primary" icon="el-icon-upload">批量导入</el-button>
    </el-upload>
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
      <el-table-column align="center" label="设备串号">
        <template slot-scope="scope">
          <span>{{scope.row.imeiNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{scope.row.deviceType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生产商">
        <template slot-scope="scope">
          <span>{{scope.row.manufacturer}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.useable}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="容量(单位：G)">
        <template slot-scope="scope">
          <span>{{scope.row.capacity}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="pf_device_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="pf_device_del"
            size="small"
            type="danger"
            @click="deleteDevice(scope.row)"
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
        <el-form-item label="设备串号" prop="imeiNo">
          <el-input v-model="form.imeiNo" placeholder="请输入设备串号"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="==请选择==">
            <el-option v-for="d in deviceTypeList" :key="d.value" :label="d.label" :value="d.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产商"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="useable">
          <el-input v-model="form.useable" placeholder="请输入状态 0 可用  1 不可用"></el-input>
        </el-form-item>
        <el-form-item label="容量(单位：G)" prop="capacity">
          <el-input v-model="form.capacity" placeholder="请输入容量(单位：G)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDevice('form')" :disabled="disabledButton">确 定</el-button>
        <el-button v-else type="primary" @click="updateDevice('form')" :disabled="disabledButton">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDevicesByPage,
  addDevice,
  getDevice,
  delDevice,
  updDevice
} from '@/api/platform/rfidDevice'
import store from '@/store'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'device',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        imeiNo: undefined,
        deviceType: undefined,
        manufacturer: undefined,
        useable: undefined,
        capacity: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined
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
      pf_device_add: false,
      pf_device_del: false,
      pf_device_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      deviceTypeList: [
        {
          label: '人证机',
          value: '0'
        },
        {
          label: '智能抓拍机',
          value: '1'
        }
      ],
      disabledButton: false
    }
  },
  created() {
    this.getList()
    this.pf_device_add = this.permissions['pf_device_add']
    this.pf_device_edit = this.permissions['pf_device_edit']
    this.pf_device_del = this.permissions['pf_device_del']
  },
  computed: {
    ...mapGetters(['permissions']),
    headers() {
      return {
        Authorization: 'Bearer ' + store.getters.access_token
      }
    }
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
      this.listLoading = true
      getDevicesByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getDevice(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteDevice(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDevice(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    },
    createDevice(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addDevice(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    updateDevice(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updDevice(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp() {
      this.form = {
        imeiNo: undefined,
        deviceType: undefined,
        manufacturer: undefined,
        useable: undefined,
        capacity: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined
      }
    },
    // 上传成功后的回调
    uploadSuccess(response) {
      if (response.code === 1) {
        this.$notify({
          title: '失败',
          message: response.msg,
          type: 'warning',
          duration: 5000
        })
      } else {
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success',
          duration: 3000
        })
      }
      this.getList()
    },
    // 上传错误
    uploadError(response) {
      this.$notify({
        title: '失败',
        message: '上传文件失败，请检查文件内容格式是否正确',
        type: 'error',
        duration: 3000
      })
    },
    // 上传前对文件的大小的判断
    beforeUpload(file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$notify({
          title: '提示',
          message: '上传文件要求是xls或xlsx格式',
          type: 'warning',
          duration: 3000
        })
      }
      if (!isLt2M) {
        this.$notify({
          title: '提示',
          message: '上传文件大于10M，请联系管理员进行处理',
          type: 'warning',
          duration: 3000
        })
      }
      return extension || (extension2 && isLt2M)
    }
  }
}
</script>
