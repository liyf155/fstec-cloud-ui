import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPlanItemRelationsByPage(query) {
  return fetch({
    url: '/checkin/planItemRelation/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPlanItemRelation(obj) {
  return fetch({
    url: '/checkin/planItemRelation',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPlanItemRelation(id) {
  return fetch({
    url: '/checkin/planItemRelation/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPlanItemRelation(id) {
  return fetch({
    url: '/checkin/planItemRelation/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPlanItemRelation(obj) {
  return fetch({
    url: '/checkin/planItemRelation',
    method: 'put',
    data: obj
  })
}
