import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase = repositoryName && !repositoryName.endsWith('.github.io') ? `/${repositoryName}/` : '/'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: process.env.GITHUB_ACTIONS ? githubPagesBase : '/',
})
