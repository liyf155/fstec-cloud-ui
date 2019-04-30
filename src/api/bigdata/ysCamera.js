import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getYsCamerasByPage(query) {
  return fetch({
    url: '/bigdata/ysCamera/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addYsCamera(obj) {
  return fetch({
    url: '/bigdata/ysCamera',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getYsCamera(id) {
  return fetch({
    url: '/bigdata/ysCamera/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delYsCamera(id) {
  return fetch({
    url: '/bigdata/ysCamera/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updYsCamera(obj) {
  return fetch({
    url: '/bigdata/ysCamera',
    method: 'put',
    data: obj
  })
}

export function downloadExcel(filename) {
  return fetch({
    url: '/api/train/ysCamera/template/download/' + filename,
    method: 'post',
    responseType: 'arraybuffer'
  })
}
