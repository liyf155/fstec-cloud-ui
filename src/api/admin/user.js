import fetch from '@/router/axios'

/**
 * 分页获取用户列表
 * @param {查询条件} query
 */
export function getUsersByPage(query) {
  return fetch({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加用户信息
 * @param {用户数据} user
 */
export function addUser(user) {
  return fetch({
    url: '/admin/user/',
    method: 'post',
    data: user
  })
}

/**
 * 通过用户ID查找用户信息
 * @param {用户ID} id
 */
export function getUser(id) {
  return fetch({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

/**
 * 删除用户
 * @param {用户ID} id
 */
export function delUser(id) {
  return fetch({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

/**
 * 更新用户信息
 * @param {用户信息} user
 */
export function updUser(user) {
  return fetch({
    url: '/admin/user',
    method: 'put',
    data: user
  })
}

/**
 * 重置密码
 * @param {用户ID} id
 */
export function resetPasswd(id) {
  return fetch({
    url: '/admin/user/resetPasswd/' + id,
    method: 'put'
  })
}
