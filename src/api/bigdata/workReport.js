import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getWorkReportsByPage(query) {
  return fetch({
    url: '/bigdata/workReport/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addWorkReport(obj) {
  return fetch({
    url: '/bigdata/workReport',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getWorkReport(id) {
  return fetch({
    url: '/bigdata/workReport/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delWorkReport(id) {
  return fetch({
    url: '/bigdata/workReport/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updWorkReport(obj) {
  return fetch({
    url: '/bigdata/workReport',
    method: 'put',
    data: obj
  })
}
