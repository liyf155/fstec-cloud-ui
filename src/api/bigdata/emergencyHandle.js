import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getEmergencyHandlesByPage(query) {
  return fetch({
    url: '/bigdata/emergencyHandle/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addEmergencyHandle(obj) {
  return fetch({
    url: '/bigdata/emergencyHandle',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getEmergencyHandle(id) {
  return fetch({
    url: '/bigdata/emergencyHandle/' + id,
    method: 'get'
  })
}

export function getHandleByEventId(eventId) {
  return fetch({
    url: '/bigdata/emergencyHandle/getByEventId/' + eventId,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delEmergencyHandle(id) {
  return fetch({
    url: '/bigdata/emergencyHandle/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updEmergencyHandle(obj) {
  return fetch({
    url: '/bigdata/emergencyHandle',
    method: 'put',
    data: obj
  })
}
