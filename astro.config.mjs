// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://3dyuval.github.io',
	base: '/nvim-learn-by-examples',
	integrations: [
		starlight({
			title: 'Neovim Learn by Examples',
			description: 'Practical Neovim examples and workflows',
			sidebar: [
				{
					label: 'Examples',
					items: [
						{
							label: 'Large Files & Scratch Buffers',
							slug: 'guides/large-files-scatch-buffer'
						}
					]
				}
			]
		})
	]
});
