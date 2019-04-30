import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamPapersByPage(query) {
  return fetch({
    url: '/bigdata/examPaper/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamPaper(obj) {
  return fetch({
    url: '/bigdata/examPaper',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamPaper(id) {
  return fetch({
    url: '/bigdata/examPaper/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamPaper(id) {
  return fetch({
    url: '/bigdata/examPaper/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamPaper(obj) {
  return fetch({
    url: '/bigdata/examPaper',
    method: 'put',
    data: obj
  })
}
