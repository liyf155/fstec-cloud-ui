import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamInspectsByPage(query) {
  return fetch({
    url: '/bigdata/examInspect/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamInspect(obj) {
  return fetch({
    url: '/bigdata/examInspect',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamInspect(id) {
  return fetch({
    url: '/bigdata/examInspect/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamInspect(id) {
  return fetch({
    url: '/bigdata/examInspect/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamInspect(obj) {
  return fetch({
    url: '/bigdata/examInspect',
    method: 'put',
    data: obj
  })
}
