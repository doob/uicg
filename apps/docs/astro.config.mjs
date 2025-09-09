import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'UICG',
      logo: {
        src: './src/assets/uicg_logo.svg',
        replacesTitle: true,
      },
      social: {
        // github: 'https://github.com/withastro/starlight',
      },
      sidebar: [
        {
          label: 'Forms',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/components/forms/' },
            { label: 'Button', link: '/components/forms/button/' },
            { label: 'Checkbox', link: '/components/forms/checkbox/' },
            { label: 'Fieldset', link: '/components/forms/fieldset/' },
            { label: 'Input', link: '/components/forms/input/' },
            { label: 'Label', link: '/components/forms/label/' },
            { label: 'Radio Group', link: '/components/forms/radio-group/' },
            { label: 'Select', link: '/components/forms/select/' },
            { label: 'Switch', link: '/components/forms/switch/' },
            { label: 'Textarea', link: '/components/forms/textarea/' },
          ],
        },
        {
          label: 'Data Display',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/components/data-display/' },
            { label: 'Accordion', link: '/components/data-display/accordion/' },
            { label: 'Tabs', link: '/components/data-display/tabs/' },
          ],
        },
        {
          label: 'Feedback',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/components/feedback/' },
            { label: 'Alert', link: '/components/feedback/alert/' },
          ],
        },
        {
          label: 'Layout',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/components/layout/' },
            { label: 'Hero', link: '/components/layout/hero/' },
            { label: 'Sidebar', link: '/components/layout/sidebar/' },
          ],
        },
        {
          label: 'Overlays',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/components/overlays/' },
            { label: 'Modal', link: '/components/overlays/modal/' },
          ],
        },
        {
          label: 'Composed Components',
          autogenerate: {
            directory: 'composed_components',
          },
        },
      ],
      customCss: ['./src/tailwind.css'],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
})
