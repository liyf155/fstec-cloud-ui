import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getDevicesByPage(query) {
  return fetch({
    url: '/platform/rfidDevice/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addDevice(obj) {
  return fetch({
    url: '/platform/rfidDevice',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getDevice(id) {
  return fetch({
    url: '/platform/rfidDevice/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delDevice(id) {
  return fetch({
    url: '/platform/rfidDevice/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updDevice(obj) {
  return fetch({
    url: '/platform/rfidDevice',
    method: 'put',
    data: obj
  })
}
