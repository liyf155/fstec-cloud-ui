import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamRoomsByPage(query) {
  return fetch({
    url: '/platform/examRoom/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamRoom(obj) {
  return fetch({
    url: '/platform/examRoom',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamRoom(id) {
  return fetch({
    url: '/platform/examRoom/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamRoom(id) {
  return fetch({
    url: '/platform/examRoom/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamRoom(obj) {
  return fetch({
    url: '/platform/examRoom',
    method: 'put',
    data: obj
  })
}
