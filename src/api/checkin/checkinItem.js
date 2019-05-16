import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCheckinItemsByPage(query) {
  return fetch({
    url: '/checkin/checkinItem/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCheckinItem(obj) {
  return fetch({
    url: '/checkin/checkinItem',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCheckinItem(id) {
  return fetch({
    url: '/checkin/checkinItem/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCheckinItem(id) {
  return fetch({
    url: '/checkin/checkinItem/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCheckinItem(obj) {
  return fetch({
    url: '/checkin/checkinItem',
    method: 'put',
    data: obj
  })
}
