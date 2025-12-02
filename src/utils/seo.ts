/**
 * SEO Configuration for ESPHome LVGL Designer
 * 
 * This file contains all SEO-related configuration and utilities
 * for the ESPHome LVGL UI Designer application.
 */

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterCard: string
  canonical: string
}

export const BASE_URL = 'https://www.espboards.dev/tools/esphome-lvgl-designer/'

export const DEFAULT_SEO: SEOConfig = {
  title: 'ESPHome LVGL UI Designer - Free Online Visual Editor',
  description: 'Create stunning graphical user interfaces for ESPHome devices with our free online LVGL visual designer. Drag-and-drop widgets, live preview, instant YAML export.',
  keywords: [
    'ESPHome LVGL Designer',
    'ESPHome LVGL UI',
    'ESPHome LVGL editor',
    'ESPHome LVGL online',
    'ESPHome designer',
    'LVGL UI designer',
    'LVGL visual editor',
    'ESP32 UI',
    'embedded UI designer',
    'esphome display editor',
    'esphome ui online',
    'free ui builder',
    'graphical interface builder',
    'LVGL widgets',
    'esp32 display designer',
    'online UI tool',
    'no-code UI builder'
  ],
  ogTitle: 'ESPHome LVGL UI Designer - Free Online Visual Editor',
  ogDescription: 'Create stunning UI interfaces for ESPHome devices without coding. Drag-and-drop LVGL widgets, live preview, and instant YAML export.',
  ogImage: `${BASE_URL}/favicon.ico`,
  ogUrl: BASE_URL,
  twitterCard: 'summary_large_image',
  canonical: BASE_URL,
}

export const PAGE_SEO: Record<string, SEOConfig> = {
  home: {
    title: 'ESPHome LVGL UI Designer - Free Online Visual Editor',
    description: 'Create stunning graphical user interfaces for ESPHome devices with our free online LVGL visual designer. Drag-and-drop widgets, live preview, instant YAML export.',
    keywords: DEFAULT_SEO.keywords,
    ogTitle: 'ESPHome LVGL UI Designer',
    ogDescription: 'Free online LVGL UI designer for ESP32 and ESPHome devices. Create beautiful interfaces without coding.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: BASE_URL,
    twitterCard: 'summary_large_image',
    canonical: BASE_URL,
  },
  
  overview: {
    title: 'ESPHome LVGL Designer Overview - Features & Getting Help',
    description: 'Learn about ESPHome LVGL Designer features, system requirements, and how to get help. Comprehensive overview of the visual UI builder for ESPHome.',
    keywords: [
      'ESPHome LVGL Designer overview',
      'LVGL features',
      'UI builder features',
      'ESPHome requirements',
      'getting help'
    ],
    ogTitle: 'ESPHome LVGL Designer Overview',
    ogDescription: 'Discover features and capabilities of the free ESPHome LVGL UI Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/overview`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/overview`,
  },
  
  gettingStarted: {
    title: 'Getting Started with ESPHome LVGL Designer - Quick Tutorial',
    description: 'Quick start guide to create your first UI with ESPHome LVGL Designer. Learn the 5-step process from canvas creation to YAML export.',
    keywords: [
      'ESPHome LVGL tutorial',
      'getting started LVGL',
      'UI designer tutorial',
      'how to use ESPHome designer',
      'LVGL quick start'
    ],
    ogTitle: 'Getting Started with ESPHome LVGL Designer',
    ogDescription: '5-step tutorial to create your first UI interface with ESPHome LVGL Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/getting-started`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/getting-started`,
  },
  
  userGuide: {
    title: 'ESPHome LVGL Designer User Guide - Complete Feature Reference',
    description: 'Complete guide to all features and capabilities of ESPHome LVGL Designer. Learn about widgets, canvas management, properties, and more.',
    keywords: [
      'ESPHome LVGL user guide',
      'LVGL widgets reference',
      'UI designer guide',
      'canvas management',
      'widget properties',
      'LVGL documentation'
    ],
    ogTitle: 'ESPHome LVGL Designer User Guide',
    ogDescription: 'Complete feature reference and guide for ESPHome LVGL UI Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/user-guide`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/user-guide`,
  },
  
  keyboardShortcuts: {
    title: 'ESPHome LVGL Designer - Keyboard Shortcuts Reference',
    description: 'Quick reference guide for keyboard shortcuts in ESPHome LVGL Designer. Improve your workflow with keyboard commands.',
    keywords: [
      'keyboard shortcuts',
      'hotkeys',
      'ESPHome shortcuts',
      'productivity tips',
      'workflow shortcuts'
    ],
    ogTitle: 'Keyboard Shortcuts - ESPHome LVGL Designer',
    ogDescription: 'Learn keyboard shortcuts to work faster in ESPHome LVGL Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/keyboard-shortcuts`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/keyboard-shortcuts`,
  },
  
  faq: {
    title: 'FAQ - ESPHome LVGL Designer Frequently Asked Questions',
    description: 'Answers to common questions about ESPHome LVGL Designer. Find solutions to design, colors, interactions, fonts, and more.',
    keywords: [
      'ESPHome LVGL FAQ',
      'frequently asked questions',
      'troubleshooting',
      'design tips',
      'LVGL colors',
      'LVGL fonts'
    ],
    ogTitle: 'FAQ - ESPHome LVGL Designer',
    ogDescription: 'Find answers to frequently asked questions about ESPHome LVGL Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/faq`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/faq`,
  },
  
  widgetSupport: {
    title: 'Widget Support - ESPHome LVGL Designer Implementation Status',
    description: 'Complete list of LVGL widgets supported in ESPHome LVGL Designer. See which widgets are implemented and which are planned.',
    keywords: [
      'LVGL widgets',
      'widget support',
      'ESPHome widgets',
      'implemented widgets',
      'widget status',
      'LVGL components'
    ],
    ogTitle: 'Widget Support - ESPHome LVGL Designer',
    ogDescription: 'View the status of all LVGL widgets in ESPHome LVGL Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/widget-support`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/widget-support`,
  },
  
  issues: {
    title: 'Report Issues - ESPHome LVGL Designer Bug Reports & Contributions',
    description: 'Learn how to report bugs and submit feature requests for ESPHome LVGL Designer. GitHub contribution guidelines and issue templates.',
    keywords: [
      'report bug',
      'feature request',
      'GitHub issues',
      'bug report',
      'contributions',
      'open source'
    ],
    ogTitle: 'Report Issues - ESPHome LVGL Designer',
    ogDescription: 'Help improve ESPHome LVGL Designer by reporting bugs and requesting features on GitHub.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/issues`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/issues`,
  },
  
  troubleshooting: {
    title: 'Troubleshooting - ESPHome LVGL Designer Common Issues & Solutions',
    description: 'Troubleshooting guide for ESPHome LVGL Designer. Solutions to common problems with design, import/export, and interactions.',
    keywords: [
      'troubleshooting',
      'common issues',
      'problem solving',
      'ESPHome problems',
      'LVGL issues',
      'design problems'
    ],
    ogTitle: 'Troubleshooting - ESPHome LVGL Designer',
    ogDescription: 'Find solutions to common issues with ESPHome LVGL Designer.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/help/troubleshooting`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/help/troubleshooting`,
  },
  
  about: {
    title: 'About ESPHome LVGL Designer - Open Source UI Builder',
    description: 'Learn about ESPHome LVGL Designer, an open-source visual UI builder for creating interfaces for ESPHome devices.',
    keywords: [
      'about',
      'open source',
      'project information',
      'ESPHome community'
    ],
    ogTitle: 'About - ESPHome LVGL Designer',
    ogDescription: 'Learn about the ESPHome LVGL Designer project.',
    ogImage: `${BASE_URL}/favicon.ico`,
    ogUrl: `${BASE_URL}/about`,
    twitterCard: 'summary',
    canonical: `${BASE_URL}/about`,
  },
}

/**
 * Update document metadata for SEO
 * Call this function when page route changes
 */
export function updateSEOMetadata(config: SEOConfig): void {
  // Update title
  document.title = config.title

  // Update or create meta tags
  updateMetaTag('name', 'description', config.description)
  updateMetaTag('name', 'keywords', config.keywords.join(', '))
  updateMetaTag('property', 'og:title', config.ogTitle)
  updateMetaTag('property', 'og:description', config.ogDescription)
  updateMetaTag('property', 'og:image', config.ogImage)
  updateMetaTag('property', 'og:url', config.ogUrl)
  updateMetaTag('property', 'twitter:title', config.ogTitle)
  updateMetaTag('property', 'twitter:description', config.ogDescription)
  updateMetaTag('property', 'twitter:image', config.ogImage)
  
  // Update canonical link
  updateCanonicalLink(config.canonical)
}

function updateMetaTag(type: 'name' | 'property', attribute: string, content: string): void {
  let element = document.querySelector(`meta[${type}="${attribute}"]`) as HTMLMetaElement | null
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(type, attribute)
    document.head.appendChild(element)
  }
  
  element.content = content
}

function updateCanonicalLink(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  
  link.href = url
}
