import fetch from '@/router/axios'

/**
 * 获取部门层级机构
 * @param {查询条件} query
 */
export function getDeptTree(query) {
  return fetch({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}

/**
 * 添加部门
 * @param {部门对象} obj
 */
export function addDept(obj) {
  return fetch({
    url: '/admin/dept/',
    method: 'post',
    data: obj
  })
}

/**
 * 删除部门
 * @param {部门ID} id
 */
export function delDept(id) {
  return fetch({
    url: '/admin/dept/' + id,
    method: 'delete'
  })
}

/**
 * 更新部门信息
 * @param {部门对象} obj
 */
export function updDept(obj) {
  return fetch({
    url: '/admin/dept/',
    method: 'put',
    data: obj
  })
}

/**
 * 通过部门ID获取部门信息
 * @param {部门ID} id
 */
export function getDept(id) {
  return fetch({
    url: '/admin/dept/' + id,
    method: 'get'
  })
}
