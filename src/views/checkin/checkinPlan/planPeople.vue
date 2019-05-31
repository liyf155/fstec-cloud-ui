<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="姓名：">
          <el-input @keyup.enter.native="handleFilter"
            style="width: 200px;"
            class="filter-item"
            placeholder="模糊查询"
            v-model="listQuery.name">
          </el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input @keyup.enter.native="handleFilter"
            style="width: 200px;"
            class="filter-item"
            placeholder="模糊查询"
            v-model="listQuery.certId">
          </el-input>
        </el-form-item>
        <el-button class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter">搜索
        </el-button>
        <el-button v-if="ck_checkinPeople_add"
          class="filter-item"
          style="margin-left: 10px;"
          @click="handleCreate"
          type="primary"
          icon="el-icon-plus">添加
        </el-button>
        <el-button class="filter-item"
          type="info"
          icon="el-icon-back"
          @click="backToPlanPage">返回</el-button>
        <el-upload v-if="ck_checkinPeople_add"
          class="upload-demo"
          action="/checkin/checkinPeople/importFromExcel"
          :headers="headers"
          :data="uploadData"
          :onError="uploadError"
          :onSuccess="uploadSuccess"
          :beforeUpload="beforeUpload">
          <el-button class="filter-item"
            type="primary"
            icon="el-icon-upload">批量导入</el-button>
        </el-upload>
      </el-form>
    </div>
    <el-table :key='tableKey'
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="正在加载..."
      border
      fit
      highlight-current-row
      style="width: 99%">
      <el-table-column align="center"
        label="省份名称">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="城市名称">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="考点名称">
        <template slot-scope="scope">
          <span>{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.certId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="岗位名称">
        <template slot-scope="scope">
          <span>{{scope.row.postName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="科目名称">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.linkerPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
        label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinPeople_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="ck_checkinPeople_del"
            size="small"
            type="danger"
            @click="deleteCheckinPeople(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading"
      class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.current"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="100px">
        <el-form-item label="省份名称"
          prop="provinceId">
          <el-select v-model="form.provinceId" placeholder="==请选择==" @change="selectCityNameList(form)">
            <el-option v-for="p in provinceNameList" :key="p.areaCode" :label="p.name" :value="p.areaCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市名称"
          prop="cityId">
          <el-select v-model="form.cityId" placeholder="==请选择==" @change="getExamNodeName(form)">
            <el-option v-for="c in cityNameList" :key="c.areaCode" :label="c.name" :value="c.areaCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考点名称"
          prop="nodeId">
          <el-select v-model="form.nodeId" placeholder="==请选择==">
            <el-option v-for="n in nodeNameList" :key="n.id" :label="n.nodeName" :value="n.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名"
          prop="name">
          <el-input v-model="form.name"
            placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号"
          prop="certId">
          <el-input v-model="form.certId"
            placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="性别"
          prop="sex">
          <el-select v-model="form.sex" placeholder="==请选择==">
            <el-option v-for="s in sexList" :key="s.value" :label="s.label" :value="s.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称"
          prop="postId">
          <el-select v-model="form.postId" placeholder="==请选择==">
            <el-option v-for="p in postNameList" :key="p.id" :label="p.postName" :value="p.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目名称"
          prop="subjectId">
          <el-select v-model="form.subjectId" placeholder="==请选择==">
            <el-option v-for="s in subjectNameList" :key="s.id" :label="s.subjectName" :value="s.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式"
          prop="linkerPhone">
          <el-input v-model="form.linkerPhone"
            placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="备注"
          prop="remark">
          <el-input v-model="form.remark"
            placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="相片信息"
          prop="photoInfo">
          <el-input v-model="form.photoInfo"
            placeholder="请输入相片信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
          type="primary"
          @click="createCheckinPeople('form')">确 定
        </el-button>
        <el-button v-else
          type="primary"
          @click="updateCheckinPeople('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getCheckinPeoplesByPage,
    addCheckinPeople,
    getCheckinPeople,
    delCheckinPeople,
    updCheckinPeople
  } from '@/api/checkin/checkinPeople'
  import {getPostNameList} from '@/api/checkin/position'
  import {getAdministrativeSelect} from '@/api/base/administrative.js'
  import {getNodeNameList} from '@/api/base/examNode'
  import {getExamSubjectNameList} from '@/api/base/examSubject'
  import { mapGetters } from 'vuex'
  import store from '@/store'
  import waves from '@/directive/waves/index.js' // 水波纹
  export default {
    name: 'checkinPeople',
    props: {
      planId: {
        default: undefined
      },
      itemId: {
        default: undefined
      }
    },
    directives: {
      waves
    },
    data() {
      var checkLinkerPhone = (rule,value,callback) => {
        var p = /^((0\d{2,3}-\d{6,8})|(1[3584]\d{9}))$/
        if (!value) {
          callback(new Error('请输入联系电话'));
        }else if(!p.test(value)){
          callback(new Error("联系电话输入有误！"));
        }else{
          callback();
        }
      };
      var checkCertId = (rule,value,callback) => {
        var cert = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if(!value) {
          callback(new Error('请输入身份证号'));
        }else if(!cert.test(value)){
          callback(new Error('身份证输入有误！'));
        }else{
          callback();
        }
      };
      return {
        form: {
          planId: undefined,
          provinceId: undefined,
          provinceName: undefined,
          cityId: undefined,
          cityName: undefined,
          nodeId: undefined,
          nodeName: undefined,
          name: undefined,
          certId: undefined,
          sex: undefined,
          postId: undefined,
          postName: undefined,
          subjectId: undefined,
          subjectName: undefined,
          linkerPhone: undefined,
          remark: undefined,
          photoInfo: undefined
        },
        rules: {
          provinceId:[
          { required: true,message: '请选择省份', trigger: 'change' }
          ],
          cityId:[
          { required: true,message: '请选择城市', trigger: 'change' }
          ],
          nodeId:[
          { required: true,message: '请选择考点', trigger: 'change' }
          ],
          sex:[
          { required: true,message: '请选择性别', trigger: 'change' }
          ],
          postId:[
          { required: true,message: '请选择岗位', trigger: 'change' }
          ],
          name:[
          { required: true,message: '请输入姓名', trigger: 'blur' }
          ],
          certId: [
          { required: true,validator: checkCertId, trigger: 'blur' }
          ]
        },
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
        tableKey: 0,
        uploadData: {
          planId: this.planId
        },
        itemId2: this.itemId,
        postNameList: [],
        provinceNameList: [],
        cityNameList: [],
        sexList: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        }
        ],
        nodeNameList: [],
        subjectNameList: []
      }
    },
    created() {
      this.getList()
      this.getPostName()
      this.getAdministrativeList()
      this.getExamSubject()
      this.ck_checkinPeople_add = this.permissions['ck_checkinPeople_add']
      this.ck_checkinPeople_edit = this.permissions['ck_checkinPeople_edit']
      this.ck_checkinPeople_del = this.permissions['ck_checkinPeople_del']
    },
    computed: {
      ...mapGetters([
        'permissions'
      ]),
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
    methods: {
      getList() {
        this.listLoading = true
        getCheckinPeoplesByPage(this.listQuery).then(response => {
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
        getCheckinPeople(row.id).then(response => {
          getAdministrativeSelect(parseInt(row.provinceId)).then(response => {
            this.cityNameList = response.data
            var a;
            for(var i = 0; i < this.cityNameList.length; i ++ ){
              a = this.cityNameList[i].areaCode
              this.cityNameList[i].areaCode=a.toString()
            }
          })
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
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
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
        })
      },
      createCheckinPeople(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addCheckinPeople(this.form).then(() => {
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
      updateCheckinPeople(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            updCheckinPeople(this.form).then(() => {
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
          planId: undefined,
          provinceId: undefined,
          provinceName: undefined,
          cityId: undefined,
          cityName: undefined,
          nodeId: undefined,
          nodeName: undefined,
          name: undefined,
          certId: undefined,
          sex: undefined,
          postId: undefined,
          postName: undefined,
          subjectId: undefined,
          subjectName: undefined,
          linkerPhone: undefined,
          remark: undefined,
          photoInfo: undefined
        }
      },
      backToPlanPage() {
        this.$emit('closePlanPeopleDialog')
      },
      // 上传成功后的回调
      uploadSuccess(response) {
        if (response.code === 1) {
          this.$notify({
            title: '提示',
            message: response.msg,
            type: 'warning',
            duration: 5000
          })
        } else {
          this.getList()
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 3000
          })
        }
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
        const extension = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension) {
          this.$notify({
            title: '提示',
            message: '上传文件要求是Excel格式',
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
        return extension && isLt2M
      },
      getPostName(){
        getPostNameList().then(response => {
          this.postNameList = response.data
        })
      },
      getAdministrativeList(){
        getAdministrativeSelect(0).then(response => {
          this.provinceNameList = response.data
          var a;
          for(var i = 0; i < this.provinceNameList.length; i ++ ){
            a = this.provinceNameList[i].areaCode
            this.provinceNameList[i].areaCode=a.toString()
          }
        })
      },
      selectCityNameList(form){
        form.cityId = ''
        form.nodeId = ''
        this.nodeNameList={}
        getAdministrativeSelect(form.provinceId).then(response => {
          this.cityNameList = response.data
          var a;
          for(var i = 0; i < this.cityNameList.length; i ++ ){
            a = this.cityNameList[i].areaCode
            this.cityNameList[i].areaCode=a.toString()
          }
        })
      },
      getExamNodeName(form){
        form.nodeId = ''
        getNodeNameList(form.cityId).then(response => {
          this.nodeNameList = response.data
        })
      },
      getExamSubject(){
        getExamSubjectNameList(this.itemId2).then(response => {
          this.subjectNameList = response.data
        })
      }
    }
  }
</script>
