import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCompareStore } from '@/stores/compareStore';

describe('compareStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockProduct1 = {
    id: 'prod_1',
    nom: 'Test Product 1',
    categorie: 'PC GAMING',
    prix: '999.99'
  };

  const mockProduct2 = {
    id: 'prod_2',
    nom: 'Test Product 2',
    categorie: 'SOURIS',
    prix: '59.99'
  };

  const mockProduct3 = {
    id: 'prod_3',
    nom: 'Test Product 3',
    categorie: 'CLAVIER',
    prix: '149.99'
  };

  it('starts with empty compare list', () => {
    const store = useCompareStore();
    expect(store.compareCount).toBe(0);
    expect(store.compareList).toEqual([]);
  });

  it('adds product to compare list', () => {
    const store = useCompareStore();
    const result = store.addToCompare(mockProduct1);

    expect(result.success).toBe(true);
    expect(store.compareCount).toBe(1);
    expect(store.compareList[0].id).toBe('prod_1');
  });

  it('removes product from compare list', () => {
    const store = useCompareStore();
    store.addToCompare(mockProduct1);
    const result = store.removeFromCompare('prod_1');

    expect(result.success).toBe(true);
    expect(store.compareCount).toBe(0);
  });

  it('toggles product in compare list', () => {
    const store = useCompareStore();

    // First toggle adds
    store.toggleCompare(mockProduct1);
    expect(store.compareCount).toBe(1);

    // Second toggle removes
    store.toggleCompare(mockProduct1);
    expect(store.compareCount).toBe(0);
  });

  it('prevents duplicate products', () => {
    const store = useCompareStore();
    store.addToCompare(mockProduct1);
    const result = store.addToCompare(mockProduct1);

    expect(result.success).toBe(false);
    expect(store.compareCount).toBe(1);
  });

  it('limits to maxItems products', () => {
    const store = useCompareStore();
    store.addToCompare(mockProduct1);
    store.addToCompare(mockProduct2);
    store.addToCompare(mockProduct3);
    store.addToCompare({ id: 'prod_4', nom: 'Product 4', prix: '99.99' });

    // Try to add 5th product
    const result = store.addToCompare({ id: 'prod_5', nom: 'Product 5', prix: '99.99' });

    expect(result.success).toBe(false);
    expect(store.compareCount).toBe(4);
    expect(store.isFull).toBe(true);
  });

  it('checks if product is in compare list', () => {
    const store = useCompareStore();
    store.addToCompare(mockProduct1);

    expect(store.isInCompare('prod_1')).toBe(true);
    expect(store.isInCompare('prod_2')).toBe(false);
  });

  it('returns canCompare when 2+ products', () => {
    const store = useCompareStore();
    expect(store.canCompare).toBe(false);

    store.addToCompare(mockProduct1);
    expect(store.canCompare).toBe(false);

    store.addToCompare(mockProduct2);
    expect(store.canCompare).toBe(true);
  });

  it('clears all products', () => {
    const store = useCompareStore();
    store.addToCompare(mockProduct1);
    store.addToCompare(mockProduct2);
    store.clearCompare();

    expect(store.compareCount).toBe(0);
    expect(store.compareList).toEqual([]);
  });

  it('opens and closes modal', () => {
    const store = useCompareStore();
    expect(store.isModalOpen).toBe(false);

    store.openModal();
    expect(store.isModalOpen).toBe(true);

    store.closeModal();
    expect(store.isModalOpen).toBe(false);
  });

  it('returns compareIds correctly', () => {
    const store = useCompareStore();
    store.addToCompare(mockProduct1);
    store.addToCompare(mockProduct2);

    expect(store.compareIds).toEqual(['prod_1', 'prod_2']);
  });
});
