import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { updateSEOMetadata, PAGE_SEO, DEFAULT_SEO } from './utils/seo'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Set up SEO metadata updates on route changes
router.afterEach((to) => {
  // Map route name to SEO config key
  let seoKey: string = 'home'
  
  if (to.name) {
    const routeName = String(to.name)
    // Extract page name from route names like 'help-overview' -> 'overview'
    if (routeName.startsWith('help-')) {
      const pageName = routeName.replace('help-', '')
      // Convert kebab-case to camelCase
      seoKey = pageName.replace(/-([a-z])/g, (_, letter) => (letter || '').toUpperCase())
    } else if (routeName === 'about') {
      seoKey = 'about'
    }
  }
  
  // Get SEO config for the page, fallback to default
  const seoConfig = PAGE_SEO[seoKey as keyof typeof PAGE_SEO] || DEFAULT_SEO
  updateSEOMetadata(seoConfig)
  
  // Scroll to top on route change
  window.scrollTo(0, 0)
})

app.mount('#app')
