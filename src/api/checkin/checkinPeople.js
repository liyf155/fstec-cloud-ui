import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCheckinPeoplesByPage(query) {
  return fetch({
    url: '/checkin/checkinPeople/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCheckinPeople(obj) {
  return fetch({
    url: '/checkin/checkinPeople',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCheckinPeople(id) {
  return fetch({
    url: '/checkin/checkinPeople/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCheckinPeople(id) {
  return fetch({
    url: '/checkin/checkinPeople/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCheckinPeople(obj) {
  return fetch({
    url: '/checkin/checkinPeople',
    method: 'put',
    data: obj
  })
}

export function allcatedExamNodes(planId) {
  return fetch({
    url: '/checkin/checkinPeople/allocated/examNodes/' + planId,
    method: 'get'
  })
}

