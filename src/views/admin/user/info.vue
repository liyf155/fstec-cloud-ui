<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-form :model="ruleForm2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" :value="ruleForm2.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleForm2.phone" placeholder="验证码登录使用"></el-input>
            </el-form-item>
            <el-form-item label="微信ID" prop="wxOpenid">
              <el-input v-model="ruleForm2.wxOpenid" placeholder="微信程序使用"></el-input>
            </el-form-item>
            <el-form-item label="QQ号" prop="qqOpenid">
              <el-input v-model="ruleForm2.qqOpenid" placeholder="QQ"></el-input>
            </el-form-item>
            <el-form-item label="头像">
              <my-upload field="file" @crop-upload-success="cropUploadSuccess" v-model="show" :width="300" :height="300" url="/api/admin/user/upload" :headers="headers" img-format="png"></my-upload>
              <img :src="ruleForm2.avatar">
              <el-button type="primary" @click="toggleShow" size="mini">选择
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import myUpload from 'vue-image-crop-upload'
import { getToken } from '@/util/auth'
import ElFormItem from 'element-ui/packages/form/src/form-item.vue'
import request from '@/router/axios'

export default {
  components: {
    ElFormItem,
    'my-upload': myUpload
  },
  data() {
    return {
      fileList: [],
      show: false,
      headers: {
        Authorization: getToken()
      },
      ruleForm2: {
        username: '',
        avatar: '',
        phone: '',
        wxOpenid: '',
        qqOpenid: ''
      }
    }
  },
  created() {
    console.log(this.userInfo)
    this.ruleForm2.username = this.userInfo.username
    this.ruleForm2.avatar = this.userInfo.avatar
    this.ruleForm2.phone = this.userInfo.phone
    this.ruleForm2.wxOpenid = this.userInfo.wxOpenid
    this.ruleForm2.qqOpenid = this.userInfo.qqOpenid
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: '/admin/user/edit',
            method: 'put',
            data: this.ruleForm2
          }).then(response => {
            if (response.data) {
              this.userInfo.phone = this.ruleForm2.phone
              this.userInfo.avatar = this.ruleForm2.avatar
              this.userInfo.wxOpenid = this.ruleForm2.wxOpenid
              this.userInfo.qqOpenid = this.ruleForm2.qqOpenid
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              // location.reload()
            } else {
              this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '修改失败',
              type: 'error',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    toggleShow() {
      this.show = !this.show
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      this.ruleForm2.avatar = jsonData.filename
      this.$store.commit('SET_AVATAR', jsonData.filename)
    }
  }
}
</script>
