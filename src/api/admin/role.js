import fetch from '@/router/axios'

/**
 * 获取系统拥有的所有角色信息
 */
export function getRoleList() {
  return fetch({
    url: '/admin/role/roleList',
    method: 'get'
  })
}

/**
 * 分页查询角色信息列表
 * @param {查询条件} query
 */
export function getRolesByPage(query) {
  return fetch({
    url: '/admin/role/page',
    method: 'get',
    params: query
  })
}

/**
 * 通过部门ID获取该部门所拥有的角色
 * @param {部门ID} deptId
 */
export function getDeptRoleList() {
  return fetch({
    url: '/admin/role/list/',
    method: 'get'
  })
}

/**
 * 通过角色ID获取角色信息
 * @param {角色ID} id
 */
export function getRole(id) {
  return fetch({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

/**
 * 添加角色
 * @param {角色信息} role
 */
export function addRole(role) {
  return fetch({
    url: '/admin/role/',
    method: 'post',
    data: role
  })
}

/**
 * 更新角色信息
 * @param {角色信息} role
 */
export function updRole(role) {
  return fetch({
    url: '/admin/role/',
    method: 'put',
    data: role
  })
}

/**
 * 删除角色
 * @param {角色ID} id
 */
export function delRole(id) {
  return fetch({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

/**
 * 更新用户权限
 * @param {角色ID} roleId
 * @param {菜单ID} menuIds
 */
export function updatePermission(roleId, menuIds) {
  return fetch({
    url: '/admin/role/menu',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

/**
 * 获取角色层级列表
 * @param {角色ID} roleId
 */
export function getRoleTree(roleId) {
  return fetch({
    url: '/admin/menu/tree/' + roleId,
    method: 'get'
  })
}

/**
 * 获取部门层级列表
 * @param {查询条件} query
 */
export function getDeptTree(query) {
  return fetch({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}
