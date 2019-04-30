import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getTaskDetailsByPage(query) {
  return fetch({
    url: '/bigdata/taskDetail/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addTaskDetail(obj) {
  return fetch({
    url: '/bigdata/taskDetail',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getTaskDetail(id) {
  return fetch({
    url: '/bigdata/taskDetail/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delTaskDetail(id) {
  return fetch({
    url: '/bigdata/taskDetail/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updTaskDetail(obj) {
  return fetch({
    url: '/bigdata/taskDetail',
    method: 'put',
    data: obj
  })
}

export function completeTask(obj) {
  return fetch({
    url: '/bigdata/taskDetail/completeTask',
    method: 'post',
    data: obj
  })
}
