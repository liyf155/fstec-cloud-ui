import fetch from '@/router/axios'

/**
 * 获取字典值
 */
export const getDic = (type) => {
  return new Promise((resolve, reject) => {
    resolve({ data: {}})
  })
}

/**
 * 分页获取字典值
 * @param {查询条件} query
 */
export function getDictsByPage(query) {
  return fetch({
    url: '/admin/dict/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加记录
 * @param {字典对象} obj
 */
export function addDict(obj) {
  return fetch({
    url: '/admin/dict/',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取字典
 * @param {ID} id
 */
export function getDict(id) {
  return fetch({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

/**
 * 删除记录
 * @param {值} row
 */
export function delDict(row) {
  return fetch({
    url: '/admin/dict/' + row.id + '/' + row.type,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param {字典对象} obj
 */
export function updDict(obj) {
  return fetch({
    url: '/admin/dict/',
    method: 'put',
    data: obj
  })
}

export function remote(type) {
  return fetch({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}
