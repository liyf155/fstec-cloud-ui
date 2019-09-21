<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item label="考试计划">
              <exam-plan @examPlanChange="fetchYsCamerasByPage"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备名称">
              <el-input style="width:200px" class="filter-item" placeholder="模糊查询" v-model="listQuery.channelName" @keyup.enter.native="handleFilter">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button v-if="bd_ysCamera_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
            <el-button class="filter-item" icon="el-icon-download" style="margin-left: 10px;" @click="downloadExcelTemplate">下载Excel模板</el-button>
          </el-col>
          <el-col :span="20">
            <el-upload class="upload-demo" 
              action="/bigdata/ysCamera/upload" 
              :headers = "headers"
              :data="uploadData" 
              :onError="uploadError"
              :onSuccess="uploadSuccess"
              :beforeUpload="beforeUpload">
              <el-button class="filter-item" type="primary" icon="el-icon-upload">批量导入</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载..." border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" label="序列号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.deviceSerial}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省市" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.administrativeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="考点名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="设备名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.channelName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="直播地址" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.rtmpHd}}</span>
        </template>
      </el-table-column>
      <el-table-column label="验证码" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.validateCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否加密">
        <template slot-scope="scope">
          <span>{{scope.row.encryptStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button v-if="bd_ysCamera_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="bd_ysCamera_del" size="small" type="danger" @click="deleteYsCamera(scope.row)">删除
          </el-button>
          <el-button size="small" type="warning" @click="showVideo(scope.row)">预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 萤石视频信息会话 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="考点" prop="nodeId">
          <el-select class="filter-item" v-model="form.nodeId" filterable placeholder="请选择考点">
            <el-option v-for="item in examNodes" :key="item.nodeId" :label="item.nodeName" :value="item.nodeId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="序列号" prop="deviceSerial">
          <el-input v-model="form.deviceSerial" placeholder="序列号【提示：摄像头底部，例如：C03971006】"></el-input>
        </el-form-item>

        <el-form-item label="设备名称" prop="channelName">
          <el-input v-model="form.channelName" placeholder="请输入设备名称【例如：南宁学院考场监控001】"></el-input>
        </el-form-item>

        <el-form-item label="直播地址" prop="rtmpHd">
          <el-input v-model="form.rtmpHd" placeholder="直播地址【例如：rtmp://rtmp.open.ys7.com/openlive/00bdeeddb7e647a99f71bede573e3f60.hd】"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="validateCode">
          <el-input v-model="form.validateCode" placeholder="请输入设备验证码【提示：摄像头底部， 例如：TQVUWU】"></el-input>
        </el-form-item>

        <el-form-item label="排 序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序值"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createYsCamera('form')">确 定</el-button>
        <el-button v-else type="primary" @click="updateYsCamera('form')">修 改</el-button>
        <el-button @click="cancel('form')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 视频预览 -->
    <el-dialog title="视频预览" :visible.sync="dialogMonitorVisible">
      <div class="app-container calendar-list-container">
        <div class="t-b-part">
          <div class="hd-video-wrap">
            <video id="hd-video" width="100%" controls playsInline webkit-playsinline autoplay>
              <source src="rtmp://rtmp.open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.hd" />
              <source src="http://hls.open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.hd.m3u8" type="application/x-mpegURL" />
            </video>
            <div class="title">Test</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getYsCamerasByPage, addYsCamera, getYsCamera, delYsCamera, updYsCamera, downloadExcel } from '@/api/bigdata/ysCamera'
import { getPlanNodesByPlanId } from '@/api/platform/planNode'
import { parseTime } from '@/util/util'
import store from '@/store'
import waves from '@/directive/waves/index.js' // 水波纹
import { mapGetters } from 'vuex'

export default {
  name: 'table_ysCamera',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      planId: '',
      listQuery: {
        planId: '',
        current: 1,
        size: 10
      },
      rules: {
        channelName: [
          {
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 120,
            message: '长度在 3 到 120 个字符',
            trigger: 'blur'
          }
        ],
        deviceSerial: [
          {
            required: true,
            message: '请输入序列号',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        validateCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        orgId: [
          {
            required: true,
            message: '请选择培训机构',
            trigger: 'blur'
          }
        ],
        rtmpHd: [
          {
            required: true,
            message: '请输入直播地址',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 200,
            message: '长度在 3 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      form: {
        id: '',
        planId: '',
        nodeId: '',
        nodeName: '',
        channelName: '',
        sort: 1,
        validateCode: '',
        rtmpHd: '',
        deviceSerial: ''
      },
      statusOptions: ['0', '1', '2'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0,
      index: undefined,
      uploadData: {
        planId: this.planId
      },
      examPlans: [],
      templateName: '萤石云视频导入模板.xlsx',
      examNodes: [],
      administrativeId: undefined,
      administrativeName: undefined,
      nodeId: undefined,
      nodeName: undefined,
      dialogMonitorVisible: false
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    headers() {
      return {
        'Authorization': 'Bearer ' + store.getters.access_token
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
  created() {
    this.bd_ysCamera_add = this.permissions['bd_ysCamera_add']
    this.bd_ysCamera_edit = this.permissions['bd_ysCamera_edit']
    this.bd_ysCamera_del = this.permissions['bd_ysCamera_del']
  },
  watch: {
  },
  methods: {
    /**
     * 获取萤石视频列表
     */
    fetchYsCamerasByPage(planId) {
      this.planId = planId
      this.uploadData.planId = planId
      this.listLoading = true
      this.listQuery.planId = planId
      getYsCamerasByPage(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    /**
     * 分页
     */
    handleFilter() {
      this.listQuery.size = 1
      this.fetchYsCamerasByPage(this.planId)
    },
    /**
     * 每页大小
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.fetchYsCamerasByPage(this.planId)
    },
    /**
     * 当前页码
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.fetchYsCamerasByPage(this.planId)
    },
    /**
     * 清除输入框
     */
    resetTemp() {
      this.form = {
        id: undefined,
        planId: this.listQuery.planId,
        nodeId: '',
        nodeName: '',
        channelName: '',
        sort: 1,
        validateCode: '',
        rtmpHd: '',
        deviceSerial: ''
      }
    },
    /**
     * 萤石视频弹出框
     */
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.fetchPlanNodes()
      if (this.examNodes) {
        this.form.nodeName = this.examNodes[0].nodeName
      }
    },
    handleUpdate(row) {
      this.fetchPlanNodes()
      getYsCamera(row.id).then(res => {
        this.form = res.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    /**
     * 添加萤石视频
     */
    createYsCamera(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.form.installDate = parseTime(this.form.installDate)
          addYsCamera(this.form).then(() => {
            this.dialogFormVisible = false
            this.fetchYsCamerasByPage(this.planId)
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
      this.$refs[formName].resetFields()
    },
    updateYsCamera(formName) {
      const set = this.$refs
      this.form.installDate = parseTime(this.form.installDate)
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.examNodes.find((item) => {
            if (item.nodeId === this.form.nodeId) {
              this.form.nodeName = item.nodeName
            }
          })
          updYsCamera(this.form).then(() => {
            this.dialogFormVisible = false
            this.fetchYsCamerasByPage(this.planId)
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    deleteYsCamera(row) {
      this.$confirm(
        '此操作将永久删除该计划下的摄像头数据【' + row.channelName + '】, 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delYsCamera(row.id)
          .then(() => {
            this.fetchYsCamerasByPage(this.planId)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
          .cache(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
      }).catch(() => {})
    },
    downloadExcelTemplate() {
      downloadExcel(this.templateName).then((res) => {
        if (res.data) {
          const filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '萤石云视频导入模板.xlsx'
          const blob = new Blob([res.data], { type: '' })
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = (e) => {
            const a = document.createElement('a')
            a.download = filename
            a.href = e.target.result
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }
        }
      })
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
      this.fetchYsCamerasByPage(this.planId)
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
      return extension || extension2 && isLt2M
    },
    showVideo(row) {
      this.dialogMonitorVisible = true
    },
    fetchPlanNodes() {
      getPlanNodesByPlanId(this.planId).then((res) => {
        this.examNodes = res.data
      })
    }
  }
}

</script>
