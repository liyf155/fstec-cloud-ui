<template>
  <div class="top">
    <div class="top-button is-left">
      <div class="tags-breadcrumb">
        <i class="icon-navicon tag-collapse" :class="[{ 'tag-collapse_right': isCollapse }]" @click="showCollapse"></i>
      </div>
    </div>
    <h1 class="top-title">
      <topMenu></topMenu>
    </h1>
    <div class="top-button is-right">
      <!-- <el-tooltip class="item" effect="dark" content="主题色" placement="bottom">
        <span class="top-item">
          <top-theme></top-theme>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="锁屏" placement="bottom">
        <span class="top-item">
          <top-lock></top-lock>
        </span>
      </el-tooltip> -->      
      <el-tooltip class="item" effect="dark" :content="isFullScren?'退出全屏':'全屏'" placement="bottom">
        <span class="top-item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'" @click="handleScreen"></i>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="用户头像" placement="bottom">
        <img class="top-userImg" :src="userInfo.avatar">
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">个人信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/passwd">修改密码</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { fullscreenToggel, listenfullscreen } from '@/util/util'
import topLock from './top-lock'
import topMenu from './top-menu'
import topTheme from './top-theme'
import Screenfull from '@/components/Screenfull'
export default {
  components: { topLock, topMenu, topTheme, Screenfull },
  name: 'top',
  data() {
    return {}
  },
  filters: {},
  created() {},
  mounted() {
    listenfullscreen(this.setScreen)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['isFullScren', 'isCollapse'])
  },
  methods: {
    showCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    handleScreen() {
      fullscreenToggel()
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREN')
    },
    logout() {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用前端退出
        this.$store.dispatch('LogOut').then(() => {
          // location.reload() // 为了重新实例化vue-router对象 避免bug
          this.$router.push({ path: '/login' })
        })

        // this.$store.dispatch('LogOut').then(() => {
        //   this.$router.push({ path: '/login' })
        // })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

