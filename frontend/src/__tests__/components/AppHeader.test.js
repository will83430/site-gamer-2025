import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/top-du-mois', name: 'top-of-month', component: { template: '<div>Top</div>' } },
    { path: '/produits', name: 'products', component: { template: '<div>Products</div>' } },
  ]
});

describe('AppHeader', () => {
  it('renders header element', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    });

    expect(wrapper.find('.entete').exists()).toBe(true);
  });

  it('displays logo image', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    });

    const logo = wrapper.find('img');
    expect(logo.exists()).toBe(true);
  });

  it('shows "Top du Mois" link on home page', async () => {
    await router.push('/');
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    });

    expect(wrapper.text()).toContain('Top');
  });

  it('shows "Accueil" link on non-home pages', async () => {
    await router.push('/produits');
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    });

    expect(wrapper.text()).toContain('Accueil');
  });

  it('has clickable navigation links', async () => {
    await router.push('/');
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    });

    const link = wrapper.find('a, router-link');
    expect(link.exists()).toBe(true);
  });
});
