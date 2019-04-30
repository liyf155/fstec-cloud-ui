import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamWorkersByPage(query) {
  return fetch({
    url: '/bigdata/examWorker/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamWorker(obj) {
  return fetch({
    url: '/bigdata/examWorker',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamWorker(id) {
  return fetch({
    url: '/bigdata/examWorker/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamWorker(id) {
  return fetch({
    url: '/bigdata/examWorker/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamWorker(obj) {
  return fetch({
    url: '/bigdata/examWorker',
    method: 'put',
    data: obj
  })
}

/**
 * 获取工作人员树
 * @param {考试计划ID} planId
 * @param {Tab序号} index
 */
export function getExamWorkerTree(planId, index) {
  return fetch({
    url: '/bigdata/examWorker/tree/' + planId + '/' + index,
    method: 'get'
  })
}
