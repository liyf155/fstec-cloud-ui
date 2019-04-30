<template>
  <div class="app-container calendar-list-container">
    <el-form :model="form" :rules="rules" ref="form" class="filter-container">
      <el-row>
        <el-col :span="20">
          <el-form-item label="考试计划：" prop="planId">
            <el-select v-model="form.planId" filterable placeholder="请选择考试计划" style="width:500px">
              <el-option v-for="item in examPlans" :key="item.id" :label="item.planName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="考试类型：" prop="examType">
            <el-select v-model="form.examType" placeholder="请选择考试类型" @change="switchTaskTemplates">
              <el-option v-for="item in examTypes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="任务模板：" prop="templateId">
            <el-select v-model="form.templateId" placeholder="请选择任务模板" style="width:500px">
              <el-option v-for="item in taskTemplates" :key="item.id" :label="item.templateName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务开始时间：" prop="beginTime">
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              placeholder="选择任务开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务结束时间：" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择任务结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item prop="checkedKeys" style="width:710px">
            <el-tabs type="border-card" @tab-click="handleTabClick">
              <el-tab-pane label="按岗位分组">
                <el-tree class="filter-tree"
                  :data="positionGroupData"
                  show-checkbox
                  node-key="id"
                  highlight-current 
                  :props="defaultProps"
                  ref="positionTree"
                  :filter-node-method="filterNode"
                  default-expand-all>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="按考点分组">
                <el-tree class="filter-tree"
                  :data="nodeGroupData"
                  show-checkbox
                  node-key="id"
                  highlight-current 
                  :props="defaultProps" 
                  :filter-node-method="filterNode"
                  ref="nodeTree"
                  default-expand-all>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="float:right">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button type="primary" @click="createTask('form')">确 定</el-button>
    </div>
  </div>
</template>
<script>
import {
  addTask
} from '@/api/bigdata/task'
import {
  getExamPlans
} from '@/api/platform/examPlan'
import {
  getTemplatesByType
} from '@/api/bigdata/taskTemplate'
import {
  getExamWorkerTree
} from '@/api/bigdata/examWorker'
import waves from '@/directive/waves/index.js' // 水波纹
import { mapGetters } from 'vuex'
export default {
  name: 'task_step_config',
  directives: {
    waves
  },
  data() {
    return {
      examTypes: [
        { value: '1', label: '纸笔考试' },
        { value: '0', label: '计算机考试' }
      ],
      form: {
        examType: '1',
        templateId: undefined,
        complateStatus: undefined,
        enable: '0',
        sort: undefined,
        planId: '',
        delFlag: '0',
        unCompleteCount: 0,
        completeCount: 0,
        beginTime: undefined,
        endTime: undefined,
        checkedKeys: undefined
      },
      rules: {
        planId: [{
          required: true,
          message: '请选择要创建任务的考试计划',
          trigger: 'blur'
        }],
        templateId: [{
          required: true,
          message: '请选择创建任务的模板',
          trigger: 'blur'
        }],
        beginTime: [{
          required: true,
          message: '请选择任务开始时间',
          trigger: 'blur'
        }],
        endTime: [{
          required: true,
          message: '请选择任务结束时间',
          trigger: 'blur'
        }],
        checkedKeys: [{
          required: true,
          message: '请选择分配任务的工作人员名单',
          trigger: 'blur'
        }]
      },
      active: 0,
      dialogStatus: undefined,
      examPlans: [],
      taskTemplates: [],
      checkedKeys: [],
      tabIndex: 0, // 默认按岗位分组
      positionGroupData: [],
      nodeGroupData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.fetchExamPlans()
    this.fetchTemplatesByType(this.form.examType)
  },
  watch: {},
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  methods: {
    fetchExamPlans() {
      getExamPlans().then(response => {
        this.examPlans = response.data
        this.form.planId = this.examPlans[0].id
        this.getWorkerTree(this.form.planId, 0)
      })
    },
    fetchTemplatesByType(examType) {
      getTemplatesByType(examType).then(response => {
        this.taskTemplates = response.data
      })
    },
    switchTaskTemplates() {
      this.fetchTemplatesByType(this.form.examType)
    },
    getWorkerTree(planId, tabIndex) {
      getExamWorkerTree(planId, tabIndex).then(res => {
        if (tabIndex === 0) {
          this.positionGroupData = res.data
        } else {
          this.nodeGroupData = res.data
        }
      })
    },
    handleTabClick(tab, event) {
      this.tabIndex = tab.index
      if (!this.form.planId) {
        this.$notify({
          title: '提示',
          message: '请先选择考试计划',
          type: 'warning',
          duration: 3000
        })
      } else {
        // 0--按岗位分组  1--按考点分组
        this.getWorkerTree(this.form.planId, tab.index)
      }
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    createTask(formName) {
      // / 获取已选择的叶子节点
      if (this.tabIndex === 0) {
        this.form.checkedKeys = this.$refs.positionTree.getCheckedKeys(true).join(',')
      } else {
        this.form.checkedKeys = this.$refs.nodeTree.getCheckedKeys(true).join(',')
      }
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addTask(this.form).then(() => {
            this.$emit('closeTaskStep')
            this.$notify({
              title: '成功',
              message: '创建任务成功',
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
      this.$emit('closeTaskStep')
    }
  }
}
</script>

