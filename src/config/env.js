let baseUrl = ''
const iconfontVersion = ['567566_r22zi6t8noas8aor', '599693_0b5sleso3f1j1yvi', '667895_xte3dcfrvbo6r']
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`
const codeUrl = `/code`
if (process.env.NODE_ENV === 'development') {
  baseUrl = `http://127.0.0.1:9999/`
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = `http://39.106.120.121`
}

export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl
}
