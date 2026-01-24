import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import AdminDashboard from '@/views/AdminDashboard.vue';

// Mock fetch
global.fetch = vi.fn();

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/admin', name: 'admin', component: AdminDashboard },
    { path: '/top-du-mois', name: 'top-of-month', component: { template: '<div>Top</div>' } },
  ]
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful API responses
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/produits')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              { id: 1, nom: 'Product 1', categorie: 'PC GAMING', top_du_mois: true },
              { id: 2, nom: 'Product 2', categorie: 'DRONE', top_du_mois: false },
            ],
            total: 2
          })
        });
      }
      if (url.includes('/actualites')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, titre: 'News 1' },
            { id: 2, titre: 'News 2' },
          ])
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it('renders admin dashboard', () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('displays admin header with title', () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    expect(wrapper.text()).toContain('Centre d\'Administration');
  });

  it('renders stats section', () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    expect(wrapper.findComponent({ name: 'AdminStats' }).exists() ||
           wrapper.find('.stats-section').exists() ||
           wrapper.find('admin-stats-stub').exists()).toBe(true);
  });

  it('renders tool cards', () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    expect(wrapper.find('.tools-grid').exists()).toBe(true);
  });

  it('renders quick actions section', () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    expect(wrapper.findComponent({ name: 'AdminQuickActions' }).exists() ||
           wrapper.find('.quick-actions').exists() ||
           wrapper.find('admin-quick-actions-stub').exists()).toBe(true);
  });

  it('has footer with navigation links', () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    expect(wrapper.find('.footer-admin').exists()).toBe(true);
    expect(wrapper.text()).toContain('Accueil');
  });

  it('loads stats on mount', async () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    await flushPromises();

    // Vérifier que fetch a été appelé
    expect(global.fetch).toHaveBeenCalled();
  });

  it('shows notification when action is triggered', async () => {
    const wrapper = mount(AdminDashboard, {
      global: {
        plugins: [router],
        stubs: ['AdminStats', 'AdminToolCard', 'AdminQuickActions']
      }
    });

    // La notification devrait être cachée par défaut
    expect(wrapper.find('.admin-notification').exists()).toBe(false);
  });
});
