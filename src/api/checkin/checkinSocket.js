import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCheckinSocketsByPage(query) {
  return fetch({
    url: '/checkin/checkinSocket/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCheckinSocket(obj) {
  return fetch({
    url: '/checkin/checkinSocket',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCheckinSocket(id) {
  return fetch({
    url: '/checkin/checkinSocket/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCheckinSocket(id) {
  return fetch({
    url: '/checkin/checkinSocket/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCheckinSocket(obj) {
  return fetch({
    url: '/checkin/checkinSocket',
    method: 'put',
    data: obj
  })
}

/**
 * 导出数据
 * @param query
 */
export function downloadCheckinSocket(query) {
  return fetch({
    url: '/checkin/checkinSocket/download',
    method: 'get',
    params: query
  })
}

