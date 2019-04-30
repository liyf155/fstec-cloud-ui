import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamStartsByPage(query) {
  return fetch({
    url: '/bigdata/examStart/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamStart(obj) {
  return fetch({
    url: '/bigdata/examStart',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamStart(id) {
  return fetch({
    url: '/bigdata/examStart/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamStart(id) {
  return fetch({
    url: '/bigdata/examStart/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamStart(obj) {
  return fetch({
    url: '/bigdata/examStart',
    method: 'put',
    data: obj
  })
}
