import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getEmergencyLevelsByPage(query) {
  return fetch({
    url: '/bigdata/emergencyLevel/page',
    method: 'get',
    params: query
  })
}

export function getEmergencyLevelList() {
  return fetch({
    url: '/bigdata/emergencyLevel/list',
    method: 'get'
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addEmergencyLevel(obj) {
  return fetch({
    url: '/bigdata/emergencyLevel',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getEmergencyLevel(id) {
  return fetch({
    url: '/bigdata/emergencyLevel/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delEmergencyLevel(id) {
  return fetch({
    url: '/bigdata/emergencyLevel/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updEmergencyLevel(obj) {
  return fetch({
    url: '/bigdata/emergencyLevel',
    method: 'put',
    data: obj
  })
}
