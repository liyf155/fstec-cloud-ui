import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamNodesByPage(query) {
  return fetch({
    url: '/base/examNode/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamNode(obj) {
  return fetch({
    url: '/base/examNode',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamNode(id) {
  return fetch({
    url: '/base/examNode/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamNode(id) {
  return fetch({
    url: '/base/examNode/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamNode(obj) {
  return fetch({
    url: '/base/examNode',
    method: 'put',
    data: obj
  })
}

/**
 * 获取所有考点名称
 * @param obj
 */
export function getNodeNameList() {
  return fetch({
    url: '/base/examNode/getNodeName',
    method: 'get'
  })
}
