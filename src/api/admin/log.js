import fetch from '@/router/axios'

export function getLogsByPage(query) {
  return fetch({
    url: '/admin/log/page',
    method: 'get',
    params: query
  })
}

export function delLog(id) {
  return fetch({
    url: '/admin/log/' + id,
    method: 'delete'
  })
}
