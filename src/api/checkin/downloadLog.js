import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getDownloadLogsByPage(query) {
  return fetch({
    url: '/checkin/downloadLog/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addDownloadLog(obj) {
  return fetch({
    url: '/checkin/downloadLog',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getDownloadLog(id) {
  return fetch({
    url: '/checkin/downloadLog/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delDownloadLog(id) {
  return fetch({
    url: '/checkin/downloadLog/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updDownloadLog(obj) {
  return fetch({
    url: '/checkin/downloadLog',
    method: 'put',
    data: obj
  })
}
