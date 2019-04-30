import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamineeEntrancesByPage(query) {
  return fetch({
    url: '/bigdata/examineeEntrance/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamineeEntrance(obj) {
  return fetch({
    url: '/bigdata/examineeEntrance',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamineeEntrance(id) {
  return fetch({
    url: '/bigdata/examineeEntrance/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamineeEntrance(id) {
  return fetch({
    url: '/bigdata/examineeEntrance/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamineeEntrance(obj) {
  return fetch({
    url: '/bigdata/examineeEntrance',
    method: 'put',
    data: obj
  })
}
