import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getEndReportsByPage(query) {
  return fetch({
    url: '/bigdata/endReport/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addEndReport(obj) {
  return fetch({
    url: '/bigdata/endReport',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getEndReport(id) {
  return fetch({
    url: '/bigdata/endReport/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delEndReport(id) {
  return fetch({
    url: '/bigdata/endReport/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updEndReport(obj) {
  return fetch({
    url: '/bigdata/endReport',
    method: 'put',
    data: obj
  })
}
