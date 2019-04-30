import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getSignPeoplesByPage(query) {
  return fetch({
    url: '/checkin/signPeople/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addSignPeople(obj) {
  return fetch({
    url: '/checkin/signPeople',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getSignPeople(id) {
  return fetch({
    url: '/checkin/signPeople/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delSignPeople(id) {
  return fetch({
    url: '/checkin/signPeople/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updSignPeople(obj) {
  return fetch({
    url: '/checkin/signPeople',
    method: 'put',
    data: obj
  })
}

export function exportSignPeople(query) {
  return fetch({
    url: '/checkin/signPeople/export',
    method: 'post',
    params: query,
    responseType: 'arraybuffer'
  }).then((response) => { // 处理返回的文件流
    const blob = new Blob([response], { type: 'application/x-msdownload' })
    const filename = 'test.xlsx'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function() {
      URL.revokeObjectURL(blob)
      document.body.removeChild(link)
    }, 0)
  })
}
