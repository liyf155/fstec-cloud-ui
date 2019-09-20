import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getRfidRecycleNodesByPage(query) {
  return fetch({
    url: '/platform/rfidRecycleNode/page',
    method: 'get',
    params: query
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function initRecycleData(planId) {
  return fetch({
    url: '/platform/rfidRecycleNode/initData/' + planId,
    method: 'get'
  })
}

/**
 * 考试科目列表
 * @param query
 */
export function getRfidSubjectList(planId) {
  return fetch({
    url: '/platform/rfidRecycleNode/subjects/' + planId,
    method: 'get'
  })
}

