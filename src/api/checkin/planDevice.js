import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPlanDevicesByPage(query) {
  return fetch({
    url: '/checkin/planDevice/page',
    method: 'get',
    params: query
  })
}

/**
 * 可用设备
 * @param query
 */
export function getUseableDevicePage(query) {
  return fetch({
    url: '/checkin/planDevice/page/useable',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPlanDevice(obj) {
  return fetch({
    url: '/checkin/planDevice',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPlanDevice(id) {
  return fetch({
    url: '/checkin/planDevice/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPlanDevice(id) {
  return fetch({
    url: '/checkin/planDevice/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPlanDevice(obj) {
  return fetch({
    url: '/checkin/planDevice',
    method: 'put',
    data: obj
  })
}
