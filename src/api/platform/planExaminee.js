import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPlanExamineesByPage(query) {
  return fetch({
    url: '/platform/planExaminee/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPlanExaminee(obj) {
  return fetch({
    url: '/platform/planExaminee',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPlanExaminee(id) {
  return fetch({
    url: '/platform/planExaminee/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPlanExaminee(id) {
  return fetch({
    url: '/platform/planExaminee/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPlanExaminee(obj) {
  return fetch({
    url: '/platform/planExaminee',
    method: 'put',
    data: obj
  })
}
