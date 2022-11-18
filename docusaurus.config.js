// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Silviu Alexandru Avram',
  tagline: `Silviu's personal blog, focused on technology and lifestyle.`,
  url: 'https://silviuaavram.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'silviuaavram', // Usually your GitHub org/user name.
  projectName: 'silviuaavram', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/silviuaavram/silviuaavram/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Silviu Alexandru Avram',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.png',
        },
        items: [
          {to: '/', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/silviuaavram',
            label: 'GitHub',
            position: 'right',
            icon: 'github',
          },
          {
            href: 'https://www.linkedin.com/in/silviuaavram',
            label: 'LinkedIn',
            position: 'right',
            icon: 'linkedin',
          },
          {
            href: 'https://www.instagram.com/silviuaavram/',
            label: 'Instagram',
            position: 'right',
            icon: 'instagram',
          },
          {
            href: 'https://twitter.com/silviuaavram',
            label: 'Twitter',
            position: 'right',
            icon: 'twitter',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Silviu Alexandru Avram.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
