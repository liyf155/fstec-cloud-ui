import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getArrangementsByPage(query) {
  return fetch({
    url: '/bigdata/arrangement/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addArrangement(obj) {
  return fetch({
    url: '/bigdata/arrangement',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getArrangement(id) {
  return fetch({
    url: '/bigdata/arrangement/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delArrangement(id) {
  return fetch({
    url: '/bigdata/arrangement/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updArrangement(obj) {
  return fetch({
    url: '/bigdata/arrangement',
    method: 'put',
    data: obj
  })
}
