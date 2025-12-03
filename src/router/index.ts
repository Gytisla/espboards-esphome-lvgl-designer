import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HelpView from '../views/HelpView.vue'
import OverviewView from '../views/help/OverviewView.vue'
import GettingStartedView from '../views/help/GettingStartedView.vue'
import UserGuideView from '../views/help/UserGuideView.vue'
import KeyboardShortcutsView from '../views/help/KeyboardShortcutsView.vue'
import FAQView from '../views/help/FAQView.vue'
import IssuesView from '../views/help/IssuesView.vue'
import TroubleshootingView from '../views/help/TroubleshootingView.vue'
import WidgetSupportView from '../views/help/WidgetSupportView.vue'
import ShowcaseView from '../views/help/ShowcaseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/help',
      component: HelpView,
      children: [
        {
          path: '',
          redirect: 'overview',
        },
        {
          path: 'overview',
          name: 'help-overview',
          component: OverviewView,
        },
        {
          path: 'getting-started',
          name: 'help-getting-started',
          component: GettingStartedView,
        },
        {
          path: 'user-guide',
          name: 'help-user-guide',
          component: UserGuideView,
        },
        {
          path: 'keyboard-shortcuts',
          name: 'help-keyboard-shortcuts',
          component: KeyboardShortcutsView,
        },
        {
          path: 'faq',
          name: 'help-faq',
          component: FAQView,
        },
        {
          path: 'issues',
          name: 'help-issues',
          component: IssuesView,
        },
        {
          path: 'troubleshooting',
          name: 'help-troubleshooting',
          component: TroubleshootingView,
        },
        {
          path: 'widget-support',
          name: 'help-widget-support',
          component: WidgetSupportView,
        },
        {
          path: 'showcase',
          name: 'help-showcase',
          component: ShowcaseView,
        },
      ],
    },
  ],
})

export default router
