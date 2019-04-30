import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getSigninsByPage(query) {
  return fetch({
    url: '/bigdata/signin/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addSignin(obj) {
  return fetch({
    url: '/bigdata/signin',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getSignin(id) {
  return fetch({
    url: '/bigdata/signin/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delSignin(id) {
  return fetch({
    url: '/bigdata/signin/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updSignin(obj) {
  return fetch({
    url: '/bigdata/signin',
    method: 'put',
    data: obj
  })
}
