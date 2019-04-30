import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getFaceStatisticssByPage(query) {
  return fetch({
    url: '/bigdata/faceStatistics/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addFaceStatistics(obj) {
  return fetch({
    url: '/bigdata/faceStatistics',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getFaceStatistics(id) {
  return fetch({
    url: '/bigdata/faceStatistics/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delFaceStatistics(id) {
  return fetch({
    url: '/bigdata/faceStatistics/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updFaceStatistics(obj) {
  return fetch({
    url: '/bigdata/faceStatistics',
    method: 'put',
    data: obj
  })
}
