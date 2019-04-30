import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamRoundsByPage(query) {
  return fetch({
    url: '/platform/examRound/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamRound(obj) {
  return fetch({
    url: '/platform/examRound',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamRound(id) {
  return fetch({
    url: '/platform/examRound/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamRound(id) {
  return fetch({
    url: '/platform/examRound/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamRound(obj) {
  return fetch({
    url: '/platform/examRound',
    method: 'put',
    data: obj
  })
}

/**
 * 所有场次
 * @param {考试计划ID} planId
 */
export function getRoundsByPlanId(planId) {
  return fetch({
    url: '/platform/examRound/list/' + planId,
    method: 'get'
  })
}
