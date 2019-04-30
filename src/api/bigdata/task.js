import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getTasksByPage(query) {
  return fetch({
    url: '/bigdata/task/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addTask(obj) {
  return fetch({
    url: '/bigdata/task',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getTask(id) {
  return fetch({
    url: '/bigdata/task/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delTask(id) {
  return fetch({
    url: '/bigdata/task/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updTask(obj) {
  return fetch({
    url: '/bigdata/task',
    method: 'put',
    data: obj
  })
}
