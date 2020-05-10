const path = require('path')
const autoprefixer = require('autoprefixer')
const purgecss = require('@fullhuman/postcss-purgecss')

const purgecssConfig = require('./purgecss.config')
const appConfig = require('./app.config')

const postcssPlugins = []

if (process.env.NODE_ENV === 'production') postcssPlugins.push(purgecss(purgecssConfig))

postcssPlugins.push(autoprefixer({
  cascade: false
}))

const remarkPlugins = [
  ['gridsome-plugin-remark-prismjs-all', { noInlineHighlight: true }]
]

module.exports = {
  siteName: appConfig.name,
  siteDescription: appConfig.description,
  siteUrl: appConfig.url,
  titleTemplate: `%s · ${appConfig.name}`,
  outputDir: 'public',
  permalinks: {
    slugify: {
      use: '@sindresorhus/slugify',
      options: {
        decamelize: false,
        customReplacements: [['.js', 'js']]
      }
    }
  },
  plugins: [
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        cacheTime: 600000,
      }
    },
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-143076148-1'
      }
    }
  ],
  transformers: {
    remark: {
      plugins: remarkPlugins,
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      slug: true,
      autolinkHeadings: {
        content: {
          type: 'element',
          tagName: 'span',
          properties: { className: ['reference'] }
        }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: postcssPlugins,
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('static', path.resolve(__dirname, 'static'))
    config.module.rules.delete('svg')
    config.module.rule('svg')
      .test(/\.svg$/).use('vue').loader('vue-loader').end()
      .use('svg-to-vue-component').loader('svg-to-vue-component/loader')
  }
}
