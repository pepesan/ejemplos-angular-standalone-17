/**
 * Pruebas BDD del backend con Cucumber: escenarios en español que llaman a la API con HTTP real.
 * Son independientes del navegador (el perfil de la raíz, `cucumber.js`, es el de la interfaz).
 * Ejecutar: `npm run test:backend:bdd`.
 */
module.exports = {
  default: {
    paths: ['backend/features/**/*.feature'],
    import: ['backend/features/support/**/*.mjs', 'backend/features/steps/**/*.mjs'],
    format: ['progress'],
    publishQuiet: true,
  },
};
