import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getExamSubjectsByPage(query) {
  return fetch({
    url: '/base/examSubject/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addExamSubject(obj) {
  return fetch({
    url: '/base/examSubject',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getExamSubject(id) {
  return fetch({
    url: '/base/examSubject/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delExamSubject(id) {
  return fetch({
    url: '/base/examSubject/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updExamSubject(obj) {
  return fetch({
    url: '/base/examSubject',
    method: 'put',
    data: obj
  })
}

/**
 * 获取考试科目名称列表
 * @param 
 */
export function getExamSubjectNameList() {
  return fetch({
    url: '/base/examSubject/getSubjectName',
    method: 'get'
  })
}
