import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getTaskTemplatesByPage(query) {
  return fetch({
    url: '/bigdata/taskTemplate/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addTaskTemplate(obj) {
  return fetch({
    url: '/bigdata/taskTemplate',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getTaskTemplate(id) {
  return fetch({
    url: '/bigdata/taskTemplate/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delTaskTemplate(id) {
  return fetch({
    url: '/bigdata/taskTemplate/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updTaskTemplate(obj) {
  return fetch({
    url: '/bigdata/taskTemplate',
    method: 'put',
    data: obj
  })
}

/**
 * 根据考试类型获取任务模板
 * @param {考试类型} examType
 */
export function getTemplatesByType(examType) {
  return fetch({
    url: '/bigdata/taskTemplate/getTemplatesByType/' + examType,
    method: 'get'
  })
}
