import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getReceivePaperTimesByPage(query) {
  return fetch({
    url: '/bigdata/receivePaperTime/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addReceivePaperTime(obj) {
  return fetch({
    url: '/bigdata/receivePaperTime',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getReceivePaperTime(id) {
  return fetch({
    url: '/bigdata/receivePaperTime/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delReceivePaperTime(id) {
  return fetch({
    url: '/bigdata/receivePaperTime/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updReceivePaperTime(obj) {
  return fetch({
    url: '/bigdata/receivePaperTime',
    method: 'put',
    data: obj
  })
}
