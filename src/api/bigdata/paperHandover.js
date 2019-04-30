import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPaperHandoversByPage(query) {
  return fetch({
    url: '/bigdata/paperHandover/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPaperHandover(obj) {
  return fetch({
    url: '/bigdata/paperHandover',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPaperHandover(id) {
  return fetch({
    url: '/bigdata/paperHandover/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPaperHandover(id) {
  return fetch({
    url: '/bigdata/paperHandover/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPaperHandover(obj) {
  return fetch({
    url: '/bigdata/paperHandover',
    method: 'put',
    data: obj
  })
}
