import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamNodesByPage(query) {
  return fetch({
    url: '/checkin/examNode/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamNode(obj) {
  return fetch({
    url: '/checkin/examNode',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamNode(id) {
  return fetch({
    url: '/checkin/examNode/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamNode(id) {
  return fetch({
    url: '/checkin/examNode/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamNode(obj) {
  return fetch({
    url: '/checkin/examNode',
    method: 'put',
    data: obj
  })
}
