import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCheckinSubjectsByPage(query) {
  return fetch({
    url: '/checkin/checkinSubject/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCheckinSubject(obj) {
  return fetch({
    url: '/checkin/checkinSubject',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCheckinSubject(id) {
  return fetch({
    url: '/checkin/checkinSubject/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCheckinSubject(id) {
  return fetch({
    url: '/checkin/checkinSubject/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCheckinSubject(obj) {
  return fetch({
    url: '/checkin/checkinSubject',
    method: 'put',
    data: obj
  })
}
