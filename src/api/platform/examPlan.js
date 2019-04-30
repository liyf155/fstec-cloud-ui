import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamPlansByPage(query) {
  return fetch({
    url: '/platform/examPlan/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamPlan(obj) {
  return fetch({
    url: '/platform/examPlan',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamPlan(id) {
  return fetch({
    url: '/platform/examPlan/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamPlan(id) {
  return fetch({
    url: '/platform/examPlan/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamPlan(obj) {
  return fetch({
    url: '/platform/examPlan',
    method: 'put',
    data: obj
  })
}

/**
 * 获取考试计划列表
 */
export function getExamPlans() {
  return fetch({
    url: '/platform/examPlan/list',
    method: 'get'
  })
}
