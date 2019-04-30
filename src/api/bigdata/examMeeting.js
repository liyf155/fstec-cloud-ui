import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamMeetingsByPage(query) {
  return fetch({
    url: '/bigdata/examMeeting/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamMeeting(obj) {
  return fetch({
    url: '/bigdata/examMeeting',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamMeeting(id) {
  return fetch({
    url: '/bigdata/examMeeting/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamMeeting(id) {
  return fetch({
    url: '/bigdata/examMeeting/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamMeeting(obj) {
  return fetch({
    url: '/bigdata/examMeeting',
    method: 'put',
    data: obj
  })
}
