import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPaperRecyclesByPage(query) {
  return fetch({
    url: '/bigdata/paperRecycle/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPaperRecycle(obj) {
  return fetch({
    url: '/bigdata/paperRecycle',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPaperRecycle(id) {
  return fetch({
    url: '/bigdata/paperRecycle/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPaperRecycle(id) {
  return fetch({
    url: '/bigdata/paperRecycle/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPaperRecycle(obj) {
  return fetch({
    url: '/bigdata/paperRecycle',
    method: 'put',
    data: obj
  })
}
