import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getEmergencyEventsByPage(query) {
  return fetch({
    url: '/bigdata/emergencyEvent/page',
    method: 'get',
    params: query
  })
}

export function getEmergencyEventList() {
  return fetch({
    url: '/bigdata/emergencyEvent/list',
    method: 'get'
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addEmergencyEvent(obj) {
  return fetch({
    url: '/bigdata/emergencyEvent',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getEmergencyEvent(id) {
  return fetch({
    url: '/bigdata/emergencyEvent/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delEmergencyEvent(id) {
  return fetch({
    url: '/bigdata/emergencyEvent/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updEmergencyEvent(obj) {
  return fetch({
    url: '/bigdata/emergencyEvent',
    method: 'put',
    data: obj
  })
}
