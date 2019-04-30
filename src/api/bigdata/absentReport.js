import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getAbsentReportsByPage(query) {
  return fetch({
    url: '/bigdata/absentReport/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addAbsentReport(obj) {
  return fetch({
    url: '/bigdata/absentReport',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getAbsentReport(id) {
  return fetch({
    url: '/bigdata/absentReport/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delAbsentReport(id) {
  return fetch({
    url: '/bigdata/absentReport/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updAbsentReport(obj) {
  return fetch({
    url: '/bigdata/absentReport',
    method: 'put',
    data: obj
  })
}
