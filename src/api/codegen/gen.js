import fetch from '@/router/axios'

/**
 * 获取表列表
 * @param {查询条件} query
 */
export function fetchList(query) {
  return fetch({
    url: '/gen/generator/page',
    method: 'get',
    params: query
  })
}

/**
 * 生成代码并下载
 * @param {表名} table
 */
export function generateAndDownload(tables) {
  return fetch({
    url: '/gen/generator/code',
    method: 'post',
    data: tables,
    responseType: 'arraybuffer'
  }).then((response) => { // 处理返回的文件流
    const blob = new Blob([response], { type: 'application/zip' })
    const filename = 'codegen.zip'
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
