import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getDisciplineHandlesByPage(query) {
  return fetch({
    url: '/bigdata/disciplineHandle/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addDisciplineHandle(obj) {
  return fetch({
    url: '/bigdata/disciplineHandle',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getDisciplineHandle(id) {
  return fetch({
    url: '/bigdata/disciplineHandle/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delDisciplineHandle(id) {
  return fetch({
    url: '/bigdata/disciplineHandle/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updDisciplineHandle(obj) {
  return fetch({
    url: '/bigdata/disciplineHandle',
    method: 'put',
    data: obj
  })
}
