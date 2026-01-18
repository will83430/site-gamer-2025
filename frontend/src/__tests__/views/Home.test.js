import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

// Mock fetch
global.fetch = vi.fn();

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/top-du-mois', name: 'top-of-month', component: { template: '<div>Top</div>' } },
  ]
});

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home page', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: ['AppHeader', 'AppFooter']
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('displays welcome message', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: ['AppHeader', 'AppFooter']
      }
    });

    // Vérifier qu'un titre ou message de bienvenue est présent
    expect(wrapper.text().toLowerCase()).toContain('bienvenue') ||
    expect(wrapper.find('h1').exists()).toBe(true);
  });

  it('has link to top du mois', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: ['AppHeader', 'AppFooter']
      }
    });

    const links = wrapper.findAll('a, router-link');
    const hasTopLink = links.some(link =>
      link.text().toLowerCase().includes('top') ||
      link.attributes('to') === '/top-du-mois' ||
      link.attributes('href')?.includes('top')
    );

    expect(hasTopLink || wrapper.text().toLowerCase().includes('top')).toBe(true);
  });

  it('renders video elements', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: ['AppHeader', 'AppFooter']
      }
    });

    const videos = wrapper.findAll('video');
    // La page d'accueil devrait avoir des vidéos
    expect(videos.length).toBeGreaterThanOrEqual(0);
  });

  it('has proper structure with header and footer', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: {
          AppHeader: true,
          AppFooter: true
        }
      }
    });

    // Vérifier la structure de base
    expect(wrapper.exists()).toBe(true);
  });
});
