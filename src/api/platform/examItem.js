import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamItemsByPage(query) {
  return fetch({
    url: '/platform/examItem/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamItem(obj) {
  return fetch({
    url: '/platform/examItem',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamItem(id) {
  return fetch({
    url: '/platform/examItem/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamItem(id) {
  return fetch({
    url: '/platform/examItem/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamItem(obj) {
  return fetch({
    url: '/platform/examItem',
    method: 'put',
    data: obj
  })
}
