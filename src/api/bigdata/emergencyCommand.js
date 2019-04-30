import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getEmergencyCommandsByPage(query) {
  return fetch({
    url: '/bigdata/emergencyCommand/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addEmergencyCommand(obj) {
  return fetch({
    url: '/bigdata/emergencyCommand',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getEmergencyCommand(id) {
  return fetch({
    url: '/bigdata/emergencyCommand/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delEmergencyCommand(id) {
  return fetch({
    url: '/bigdata/emergencyCommand/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updEmergencyCommand(obj) {
  return fetch({
    url: '/bigdata/emergencyCommand',
    method: 'put',
    data: obj
  })
}
