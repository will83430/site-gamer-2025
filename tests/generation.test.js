// tests/generation.test.js
// Tests de génération de fiches HTML
const { generateFicheHTML } = require('../backend/utils/ficheGenerator');

describe('Fiche Generation', () => {
  const mockProduct = {
    id: 'prod_test',
    nom: 'Test Product',
    titre_affiche: 'Test Product Display',
    categorie: 'drone',
    image: 'test.png',
    description: 'Test description',
    prix: '999€',
    donnees_fiche: ['Feature 1', 'Feature 2'],
    fonctionnalites_avancees: ['Advanced 1', 'Advanced 2']
  };

  test('Should generate valid HTML', () => {
    const html = generateFicheHTML(mockProduct);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="fr">');
    expect(html).toContain('</html>');
  });

  test('Should include product title', () => {
    const html = generateFicheHTML(mockProduct);
    expect(html).toContain(mockProduct.titre_affiche);
  });

  test('Should include product image', () => {
    const html = generateFicheHTML(mockProduct);
    expect(html).toContain('/assets/images/test.png');
  });

  test('Should include fallback for missing titre_affiche', () => {
    const productWithoutTitle = { ...mockProduct, titre_affiche: null };
    const html = generateFicheHTML(productWithoutTitle);
    expect(html).toContain(mockProduct.nom);
  });

  test('Should handle missing image', () => {
    const productWithoutImage = { ...mockProduct, image: null };
    const html = generateFicheHTML(productWithoutImage);
    expect(html).toContain('placeholder.png');
  });

  test('Should include scripts and styles', () => {
    const html = generateFicheHTML(mockProduct);
    expect(html).toContain('/assets/css/styles.min.css');
    expect(html).toContain('/assets/js/fiche-produit.min.js');
    expect(html).toContain('/assets/js/utils.js');
  });
});
