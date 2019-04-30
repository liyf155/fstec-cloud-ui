import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getOrgPersonsByPage(query) {
  return fetch({
    url: '/bigdata/orgPerson/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addOrgPerson(obj) {
  return fetch({
    url: '/bigdata/orgPerson',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getOrgPerson(id) {
  return fetch({
    url: '/bigdata/orgPerson/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delOrgPerson(id) {
  return fetch({
    url: '/bigdata/orgPerson/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updOrgPerson(obj) {
  return fetch({
    url: '/bigdata/orgPerson',
    method: 'put',
    data: obj
  })
}
