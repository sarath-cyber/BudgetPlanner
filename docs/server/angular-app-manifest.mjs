
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/BudgetPlanner/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/BudgetPlanner"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 526, hash: '375391239b53a398f38b51b1aae61e9353d98e9faecfce3f5fd6f704675a8925', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1039, hash: 'f93e435c40e841d3c957a0b86f28d436db90d7040562c2d84b2f8a40f7cec536', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 6613, hash: '2d28cf9fc1fa97b6dbb39181fca91b9e04676ab3af51ce35ff1d5223f8c08e44', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
