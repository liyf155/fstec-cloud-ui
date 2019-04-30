import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getNoticesByPage(query) {
  return fetch({
    url: '/bigdata/notice/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addNotice(obj) {
  return fetch({
    url: '/bigdata/notice',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getNotice(id) {
  return fetch({
    url: '/bigdata/notice/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delNotice(id) {
  return fetch({
    url: '/bigdata/notice/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updNotice(obj) {
  return fetch({
    url: '/bigdata/notice',
    method: 'put',
    data: obj
  })
}
