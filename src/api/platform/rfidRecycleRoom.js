import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getRfidRecycleRoomsByPage(query) {
  return fetch({
    url: '/platform/rfidRecycleRoom/page',
    method: 'get',
    params: query
  })
}

