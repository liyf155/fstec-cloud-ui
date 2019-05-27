import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCollectSocketsByPage(query) {
  return fetch({
    url: '/checkin/collectSocket/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCollectSocket(obj) {
  return fetch({
    url: '/checkin/collectSocket',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCollectSocket(id) {
  return fetch({
    url: '/checkin/collectSocket/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCollectSocket(id) {
  return fetch({
    url: '/checkin/collectSocket/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCollectSocket(obj) {
  return fetch({
    url: '/checkin/collectSocket',
    method: 'put',
    data: obj
  })
}
