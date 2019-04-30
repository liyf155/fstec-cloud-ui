<template>
  <div>
    <el-select class="filter-item" v-model="myPlanId" filterable placeholder="请选择考试计划" @change="examPlanChange" style="width:350px">
      <el-option v-for="plan in examPlans" :key="plan.id" :label="plan.planName" :value="plan.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import {
  getExamPlans
} from '@/api/platform/examPlan'
export default {
  name: 'planComponent',
  // props: {
  //   planId: {
  //     type: String,
  //     required:
  //   }
  // }

  data() {
    return {
      myPlanId: '',
      examPlans: []
    }
  },
  created() {
    // 获取考试计划
    getExamPlans().then(res => {
      this.examPlans = res.data
      this.myPlanId = this.examPlans[0].id
      // this.planId = this.examPlans[0].id
      this.examPlanChange()
    })
  },
  computed: {
  },
  methods: {
    examPlanChange() {
      this.$emit('examPlanChange', this.myPlanId)
    }
  }
}
</script>
