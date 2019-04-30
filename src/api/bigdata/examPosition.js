import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamPositionsByPage(query) {
  return fetch({
    url: '/bigdata/examPosition/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamPosition(obj) {
  return fetch({
    url: '/bigdata/examPosition',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamPosition(id) {
  return fetch({
    url: '/bigdata/examPosition/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamPosition(id) {
  return fetch({
    url: '/bigdata/examPosition/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamPosition(obj) {
  return fetch({
    url: '/bigdata/examPosition',
    method: 'put',
    data: obj
  })
}
