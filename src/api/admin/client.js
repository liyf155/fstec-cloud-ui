import fetch from '@/router/axios'

export function getClientsByPage(query) {
  return fetch({
    url: '/admin/client/page',
    method: 'get',
    params: query
  })
}

export function addClient(obj) {
  return fetch({
    url: '/admin/client/',
    method: 'post',
    data: obj
  })
}

export function getClient(id) {
  return fetch({
    url: '/admin/client/' + id,
    method: 'get'
  })
}

export function delClient(id) {
  return fetch({
    url: '/admin/client/' + id,
    method: 'delete'
  })
}

export function updClient(obj) {
  return fetch({
    url: '/admin/client',
    method: 'put',
    data: obj
  })
}
