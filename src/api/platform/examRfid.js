import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamRfidsByPage(query) {
  return fetch({
    url: '/platform/examRfid/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamRfid(obj) {
  return fetch({
    url: '/platform/examRfid',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamRfid(id) {
  return fetch({
    url: '/platform/examRfid/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamRfid(id) {
  return fetch({
    url: '/platform/examRfid/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamRfid(obj) {
  return fetch({
    url: '/platform/examRfid',
    method: 'put',
    data: obj
  })
}
