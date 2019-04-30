import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getAdministrativesByPage(query) {
  return fetch({
    url: '/platform/administrative/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addAdministrative(obj) {
  return fetch({
    url: '/platform/administrative',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getAdministrative(id) {
  return fetch({
    url: '/platform/administrative/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delAdministrative(id) {
  return fetch({
    url: '/platform/administrative/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updAdministrative(obj) {
  return fetch({
    url: '/platform/administrative',
    method: 'put',
    data: obj
  })
}
