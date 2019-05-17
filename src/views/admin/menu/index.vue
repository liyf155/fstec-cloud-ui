<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="menuManager_btn_add" icon="el-icon-plus" @click="toAdd">添加</el-button>
        <el-button type="primary" v-if="menuManager_btn_edit" icon="el-icon-edit" @click="toEdit">编辑</el-button>
        <el-button type="primary" v-if="menuManager_btn_del" icon="el-icon-delete" @click="DeleteMenu">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-tree
          class="filter-tree"
          node-key="id"
          highlight-current
          :data="treeData"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="getNodeData"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="父级节点" prop="parentId">
              <el-input v-model="form.parentId" placeholder="请输入父级节点"></el-input>
            </el-form-item>
            <el-form-item label="节点ID" prop="menuId">
              <el-input v-model="form.menuId" :disabled="formEdit" placeholder="请输入节点ID"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="name">
              <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="form.permission" :disabled="formEdit" placeholder="请输入权限标识"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select class="filter-item" v-model="form.type"  :disabled="formEdit"  placeholder="请选择资源请求类型">
                <el-option v-for="item in  typeOptions" :key="item" :label="item | typeFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用途" prop="useForType">
              <el-select class="filter-item" v-model="form.useForType"  :disabled="formEdit"  placeholder="请选择菜单类型">
                <el-option v-for="item in typeOptions" :key="item" :label="item | useForTypeFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input type="number" v-model="form.sort" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="component">
              <el-input v-model="form.component" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="前端地址" prop="component">
              <el-input v-model="form.path" :disabled="formEdit" placeholder="iframe嵌套地址"></el-input>
            </el-form-item>
            <el-form-item label="路由缓冲" prop="component">
              <el-switch v-model="form.keepAlive" :disabled="formEdit" active-color="#13ce66" inactive-color="#ff4949" :active-value='"1"' :inactive-value='"0"'>
              </el-switch>
            </el-form-item>
            <el-form-item v-if="formStatus === 'update'">
              <el-button type="primary" @click="UpdateMenu">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button type="primary" @click="AddMenu">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getMenuTree, getMenu, addMenu, delMenu, updMenu } from '@/api/admin/menu'
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
        oExpandedKey: {
          // key (from tree id) : expandedOrNot boolean
        },
        oTreeNodeChildren: {
          // id1 : [children] (from tree node id1)
          // id2 : [children] (from tree node id2)
        },
        aExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        labelPosition: 'right',
        form: {
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          path: undefined,
          useForType: undefined
        },
        currentId: -1,
        menuManager_btn_add: false,
        menuManager_btn_edit: false,
        menuManager_btn_del: false
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
      },
      useForTypeFilter(type) {
        const typeMap = {
          0: 'WEB菜单',
          1: 'APP菜单'
        }
        return typeMap[type]
      }
    },
    created() {
      // 初始化
      this.getList()
      this.menuManager_btn_add = this.permissions['sys_menu_add']
      this.menuManager_btn_edit = this.permissions['sys_menu_edit']
      this.menuManager_btn_del = this.permissions['sys_menu_del']
    },
    computed: {
      ...mapGetters([
        'elements',
        'permissions'
      ])
    },
    methods: {
      // 获取菜单层级结构
      getList() {
        getMenuTree(this.listQuery).then(res => {
          this.treeData = res.data
        })
      },
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.label.indexOf(value) !== -1
      },
      nodeExpand(data) {
        const aChildren = data.children
        if (aChildren.length > 0) {
          this.oExpandedKey[data.id] = true
          this.oTreeNodeChildren[data.id] = aChildren
        }
        this.setExpandedKeys()
      },
      nodeCollapse(data) {
        this.oExpandedKey[data.id] = false
        // 如果有子节点
        this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
          this.oExpandedKey[oNode.id] = false
        })
        this.setExpandedKeys()
      },
      setExpandedKeys() {
        const oTemp = this.oExpandedKey
        this.aExpandedKeys = []
        for (const sKey in oTemp) {
          if (oTemp[sKey]) {
            this.aExpandedKeys.push(parseInt(sKey))
          }
        }
      },
      treeRecursion(aChildren, fnCallback) {
        if (aChildren) {
          for (let i = 0; i < aChildren.length; ++i) {
            const oNode = aChildren[i]
            fnCallback && fnCallback(oNode)
            this.treeRecursion(oNode.children, fnCallback)
          }
        }
      },
      /**
       * 获取节点的数据
       */
      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        getMenu(data.id).then(res => {
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
      AddMenu() {
        addMenu(this.form).then(() => {
          this.getList() // 刷新列表
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 3 * 1000
          })
        })
      },
      /**
       * 弹出编辑页面
       */
      toEdit() {
        if (this.form.menuId) {
          this.formEdit = false
          this.formStatus = 'update'
        }
      },
      UpdateMenu() {
        updMenu(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 3 * 1000
          })
        })
      },
      /**
       * 删除菜单
       */
      DeleteMenu() {
        this.$confirm('此操作将永久删除数据，是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delMenu(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
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
          method: undefined,
          path: undefined,
          useForType: undefined
        }
      }
    }
  }
</script>
