import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamPreparesByPage(query) {
  return fetch({
    url: '/bigdata/examPrepare/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamPrepare(obj) {
  return fetch({
    url: '/bigdata/examPrepare',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamPrepare(id) {
  return fetch({
    url: '/bigdata/examPrepare/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamPrepare(id) {
  return fetch({
    url: '/bigdata/examPrepare/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamPrepare(obj) {
  return fetch({
    url: '/bigdata/examPrepare',
    method: 'put',
    data: obj
  })
}
