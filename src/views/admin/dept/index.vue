<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="deptManager_btn_add" icon="el-icon-plus" @click="toAdd">添加</el-button>
        <el-button type="primary" v-if="deptManager_btn_edit" icon="el-icon-edit" @click="toEdit">编辑</el-button>
        <el-button type="primary" v-if="deptManager_btn_del" icon="el-icon-delete" @click="DeleteDept">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <!-- 菜单列 -->
      <el-col :span="8" style="margin-top: 15px">
        <el-tree 
          class="filter-tree" 
          :data="treeData" node-key="id" 
          highlight-current 
          :props="defaultProps" 
          :filter-node-method="filterNode" 
          @node-click="getNodeData" 
          default-expand-all>
        </el-tree>
      </el-col>
      <!-- 部门数据 -->
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="父级节点" prop="parentId">
              <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点"></el-input>
            </el-form-item>
            <el-form-item label="节点编号" prop="parentId" v-if="formEdit">
              <el-input v-model="form.deptId" :disabled="formEdit" placeholder="节点编号"></el-input>
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="UpdateDept">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="AddDept">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getDeptTree, getDept, addDept, delDept, updDept } from '@/api/admin/dept'
  import { mapGetters } from 'vuex'

  export default {
    name: 'menu',
    data() {
      return {
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: ['0', '1'], // 状态
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'], // 方法类型
        listQuery: { // 查询条件
          name: undefined
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        labelPosition: 'right',
        form: {
          name: undefined,
          orderNum: undefined,
          parentId: undefined,
          deptId: undefined
        },
        currentId: 0,
        deptManager_btn_add: false,
        deptManager_btn_edit: false,
        deptManager_btn_del: false
      }
    },
    filters: {
      // 类型过滤
      typeFilter(type) {
        const typeMap = {
          0: '菜单',
          1: '按钮'
        }
        return typeMap[type]
      }
    },
    created() {
      // 初始化
      this.getList()
      this.deptManager_btn_add = this.permissions['sys_dept_add']
      this.deptManager_btn_edit = this.permissions['sys_dept_edit']
      this.deptManager_btn_del = this.permissions['sys_dept_del']
    },
    computed: {
      ...mapGetters([
        'elements',
        'permissions'
      ])
    },
    methods: {
      // 获取部门层级结构
      getList() {
        getDeptTree(this.listQuery).then(res => {
          this.treeData = res.data
        })
      },
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.label.indexOf(value) !== -1
      },
      /**
       * 获取节点的数据
       */
      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        getDept(data.id).then(res => {
          this.form = res.data
        })
        this.currentId = data.id
        this.showElement = true
      },
      /**
       * 弹出新建页面
       */
      toAdd() {
        this.resetForm()
        this.formEdit = false
        this.formStatus = 'create'
      },
      AddDept() {
        addDept(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      /**
       * 弹出编辑页面
       */
      toEdit() {
        if (this.form.deptId) {
          this.formEdit = false
          this.formStatus = 'update'
        }
      },
      UpdateDept() {
        updDept(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      /**
       * 删除部门
       */
      DeleteDept() {
        this.$confirm('此操作将永久删除数据，是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDept(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
        })
      },
      /**
       * 取消
       */
      onCancel() {
        this.formEdit = true
        this.formStatus = ''
      },
      /**
       * 清空
       */
      resetForm() {
        this.form = {
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: this.currentId,
          url: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          method: undefined
        }
      }
    }
  }
</script>
