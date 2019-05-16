import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCollectPhotosByPage(query) {
  return fetch({
    url: '/checkin/collectPhoto/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCollectPhoto(obj) {
  return fetch({
    url: '/checkin/collectPhoto',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCollectPhoto(id) {
  return fetch({
    url: '/checkin/collectPhoto/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCollectPhoto(id) {
  return fetch({
    url: '/checkin/collectPhoto/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCollectPhoto(obj) {
  return fetch({
    url: '/checkin/collectPhoto',
    method: 'put',
    data: obj
  })
}
