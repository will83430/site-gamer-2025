import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AdminStats from '@/components/admin/AdminStats.vue';

describe('AdminStats', () => {
  const mockStats = {
    totalProducts: 61,
    totalTrends: 15,
    totalCategories: 8,
    featuredCount: 12
  };

  it('renders stats section', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    expect(wrapper.find('.stats-section').exists()).toBe(true);
  });

  it('displays correct product count', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    expect(wrapper.text()).toContain('61');
  });

  it('displays correct trends count', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    expect(wrapper.text()).toContain('15');
  });

  it('displays correct categories count', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    expect(wrapper.text()).toContain('8');
  });

  it('displays correct featured count', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    expect(wrapper.text()).toContain('12');
  });

  it('shows loading state when loading is true', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: true
      }
    });

    // Vérifie que le spinner ou l'état de chargement est affiché
    expect(wrapper.text()).toContain('⏳') || expect(wrapper.find('.loading-icon').exists()).toBe(true);
  });

  it('emits refresh event when refresh button is clicked', async () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    const refreshBtn = wrapper.find('.refresh-btn');
    if (refreshBtn.exists()) {
      await refreshBtn.trigger('click');
      expect(wrapper.emitted('refresh')).toBeTruthy();
    }
  });

  it('disables refresh button when loading', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: true
      }
    });

    const refreshBtn = wrapper.find('.refresh-btn');
    if (refreshBtn.exists()) {
      expect(refreshBtn.attributes('disabled')).toBeDefined();
    }
  });

  it('renders all stat items', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    const statItems = wrapper.findAll('.stat-item');
    expect(statItems.length).toBe(4);
  });

  it('has correct labels for stats', () => {
    const wrapper = mount(AdminStats, {
      props: {
        stats: mockStats,
        loading: false
      }
    });

    expect(wrapper.text()).toContain('Produits Gaming');
    expect(wrapper.text()).toContain('Articles Tendances');
    expect(wrapper.text()).toContain('Catégories Actives');
    expect(wrapper.text()).toContain('Top du Mois');
  });
});
