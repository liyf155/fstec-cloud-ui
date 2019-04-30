import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getOrganizationsByPage(query) {
  return fetch({
    url: '/bigdata/organization/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addOrganization(obj) {
  return fetch({
    url: '/bigdata/organization',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getOrganization(id) {
  return fetch({
    url: '/bigdata/organization/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delOrganization(id) {
  return fetch({
    url: '/bigdata/organization/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updOrganization(obj) {
  return fetch({
    url: '/bigdata/organization',
    method: 'put',
    data: obj
  })
}
