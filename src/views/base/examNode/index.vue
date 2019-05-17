<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-form>
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                          placeholder="模糊查询" v-model="listQuery.name">
                </el-input>
                <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
                </el-button>
                <el-button v-if="mt_examNode_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate"
                           type="primary" icon="el-icon-plus">添加
                </el-button>
            </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" element-loading-text="正在加载..." border fit
                  highlight-current-row style="width: 99%">
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
            <el-table-column align="center" label="考点名称">
                <template slot-scope="scope">
                    <span>{{scope.row.nodeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考点地址">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系人">
                <template slot-scope="scope">
                    <span>{{scope.row.linkerName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联系电话">
                <template slot-scope="scope">
                    <span>{{scope.row.linkerPhone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考场数量">
                <template slot-scope="scope">
                    <span>{{scope.row.roomCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="座位数">
                <template slot-scope="scope">
                    <span>{{scope.row.seatCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="地理经度">
                <template slot-scope="scope">
                    <span>{{scope.row.lng}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="地理纬度">
                <template slot-scope="scope">
                    <span>{{scope.row.lat}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="交通">
                <template slot-scope="scope">
                    <span>{{scope.row.traffic}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建人">
                <template slot-scope="scope">
                    <span>{{scope.row.createBy}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="mt_examNode_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="mt_examNode_del" size="small" type="danger" @click="deleteExamNode(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]"
                           :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
                           :total="total"></el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="所属省份ID" prop="provinceId">
                    <el-input v-model="form.provinceId" placeholder="请输入所属省份ID"></el-input>
                </el-form-item>
                <el-form-item label="所属省份名称" prop="provinceName">
                    <el-input v-model="form.provinceName" placeholder="请输入所属省份名称"></el-input>
                </el-form-item>
                <el-form-item label="所属城市ID" prop="cityId">
                    <el-input v-model="form.cityId" placeholder="请输入所属城市ID"></el-input>
                </el-form-item>
                <el-form-item label="所属城市名称" prop="cityName">
                    <el-input v-model="form.cityName" placeholder="请输入所属城市名称"></el-input>
                </el-form-item>
                <el-form-item label="考点名称" prop="nodeName">
                    <el-input v-model="form.nodeName" placeholder="请输入考点名称"></el-input>
                </el-form-item>
                <el-form-item label="考点地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入考点地址"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="linkerName">
                    <el-input v-model="form.linkerName" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="linkerPhone">
                    <el-input v-model="form.linkerPhone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="考场数量" prop="roomCount">
                    <el-input v-model="form.roomCount" placeholder="请输入考场数量"></el-input>
                </el-form-item>
                <el-form-item label="座位数" prop="seatCount">
                    <el-input v-model="form.seatCount" placeholder="请输入座位数"></el-input>
                </el-form-item>
                <el-form-item label="地理经度" prop="lng">
                    <el-input v-model="form.lng" placeholder="请输入地理经度"></el-input>
                </el-form-item>
                <el-form-item label="地理纬度" prop="lat">
                    <el-input v-model="form.lat" placeholder="请输入地理纬度"></el-input>
                </el-form-item>
                <el-form-item label="交通" prop="traffic">
                    <el-input v-model="form.traffic" placeholder="请输入交通"></el-input>
                </el-form-item>
                <el-form-item label="创建人" prop="createBy">
                    <el-input v-model="form.createBy" placeholder="请输入创建人"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-input v-model="form.createTime" placeholder="请输入创建时间"></el-input>
                </el-form-item>
                <el-form-item label="修改人" prop="updateBy">
                    <el-input v-model="form.updateBy" placeholder="请输入修改人"></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="updateTime">
                    <el-input v-model="form.updateTime" placeholder="请输入修改时间"></el-input>
                </el-form-item>
                <el-form-item label="删除状态 0-未删除 1-逻辑删除处理 2-逻辑删除完成" prop="delFlag">
                    <el-input v-model="form.delFlag" placeholder="请输入删除状态 0-未删除 1-逻辑删除处理 2-逻辑删除完成"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createExamNode('form')">确 定</el-button>
                <el-button v-else type="primary" @click="updateExamNode('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import { getExamNodesByPage, addExamNode, getExamNode, delExamNode, updExamNode } from '@/api/base/examNode'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves/index.js' // 水波纹
  export default {
    name: 'examNode',
    directives: {
      waves
    },
    data() {
      return {
        form: {
          provinceId: undefined,
          provinceName: undefined,
          cityId: undefined,
          cityName: undefined,
          nodeName: undefined,
          address: undefined,
          linkerName: undefined,
          linkerPhone: undefined,
          roomCount: undefined,
          seatCount: undefined,
          lng: undefined,
          lat: undefined,
          traffic: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          delFlag: undefined
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
        mt_examNode_add: false,
        mt_examNode_del: false,
        mt_examNode_edit: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList()
      this.mt_examNode_add = this.permissions['mt_examNode_add']
      this.mt_examNode_edit = this.permissions['mt_examNode_edit']
      this.mt_examNode_del = this.permissions['mt_examNode_del']
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
        this.listLoading = true
        getExamNodesByPage(this.listQuery).then(response => {
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
        getExamNode(row.id).then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      },
      deleteExamNode(row) {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delExamNode(row.id).then(() => {
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
      createExamNode(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addExamNode(this.form).then(() => {
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
      updateExamNode(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            updExamNode(this.form).then(() => {
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
          provinceId: undefined,
          provinceName: undefined,
          cityId: undefined,
          cityName: undefined,
          nodeName: undefined,
          address: undefined,
          linkerName: undefined,
          linkerPhone: undefined,
          roomCount: undefined,
          seatCount: undefined,
          lng: undefined,
          lat: undefined,
          traffic: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          delFlag: undefined
        }
      }
    }
  }
</script>
