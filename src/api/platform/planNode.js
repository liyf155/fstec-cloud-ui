import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPlanNodesByPage(query) {
  return fetch({
    url: '/platform/planNode/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPlanNode(obj) {
  return fetch({
    url: '/platform/planNode',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPlanNode(id) {
  return fetch({
    url: '/platform/planNode/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPlanNode(id) {
  return fetch({
    url: '/platform/planNode/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPlanNode(obj) {
  return fetch({
    url: '/platform/planNode',
    method: 'put',
    data: obj
  })
}

export function getPlanNodesByPlanId(planId) {
  return fetch({
    url: '/platform/planNode/list/' + planId,
    method: 'get'
  })
}
