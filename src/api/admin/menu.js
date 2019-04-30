import fetch from '@/router/axios'

export function GetMenu(clientType) {
  return fetch({
    url: '/admin/menu',
    method: 'get',
    params: { clientType: clientType }
  })
}

export function getAllMenu() {
  return fetch({
    url: '/admin/menu/userMenu',
    method: 'get'
  })
}

export function getMenuTree(query) {
  return fetch({
    url: '/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function addMenu(obj) {
  return fetch({
    url: '/admin/menu/',
    method: 'post',
    data: obj
  })
}

export function getMenu(id) {
  return fetch({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delMenu(id) {
  return fetch({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function updMenu(obj) {
  return fetch({
    url: '/admin/menu/',
    method: 'put',
    data: obj
  })
}
