<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-tabs v-model="activeName"
        @tab-click="handleClick">
        <el-tab-pane label="可分配设备"
          name="first">
          <UseableDevice :planId="this.planId"
            ref="UseableDevice"></UseableDevice>
        </el-tab-pane>
        <el-tab-pane label="已分配设备"
          name="second">
          <AllocatedDevice :planId="planId"
            ref="AllocatedDevice"></AllocatedDevice>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { allcatedExamNodes } from '@/api/platform/planExaminee'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'deviceConfig',
  props: {
    planId: {
      default: undefined
    }
  },
  components: {
    'AllocatedDevice': () => import('./allocatedDevice'),
    'UseableDevice': () => import('./useableDevice')
  },
  directives: {
    waves
  },
  data() {
    return {
      listLoading: false,
      listQuery: {},
      total: undefined,
      activeName: 'first',
      useableDevices: [],
      currentDevices: [],
      allocatedExamNodes: [],
      nodeId: undefined
    }
  },
  created() {
    this.getAllocatedExamNodes(this.planId)
    this.activeName = 'first'
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
    handleClick(tab, event) {
      if (tab.index === '0') {
        this.$refs.UseableDevice.getList(this.planId)
        this.$refs.UseableDevice.allocatedExamNodes = this.allocatedExamNodes
      }
      if (tab.index === '1') {
        this.$refs.AllocatedDevice.getList(this.planId)
      }
    },
    getAllocatedExamNodes(planId) {
      allcatedExamNodes(planId).then(res => {
        this.allocatedExamNodes = res.data
        this.$refs.UseableDevice.allocatedExamNodes = this.allocatedExamNodes
      })
    }
  }
}
</script>
