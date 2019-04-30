import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamEndsByPage(query) {
  return fetch({
    url: '/bigdata/examEnd/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamEnd(obj) {
  return fetch({
    url: '/bigdata/examEnd',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamEnd(id) {
  return fetch({
    url: '/bigdata/examEnd/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamEnd(id) {
  return fetch({
    url: '/bigdata/examEnd/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamEnd(obj) {
  return fetch({
    url: '/bigdata/examEnd',
    method: 'put',
    data: obj
  })
}
