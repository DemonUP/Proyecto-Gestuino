describe('Login en Gestuino', () => {
  it('Debe completar el login con usuario válido', () => {
    // 1. Abre la pantalla de login
    cy.visit('https://gestuino.netlify.app/'); // Ajusta la URL si es diferente

    // 2. Escribe el usuario
    cy.get('input[placeholder="Usuario"]').type('admin');

    // 3. Escribe la contraseña
    cy.get('input[placeholder="••••••••"]').type('123');

    // 4. Haz clic en el botón "Acceder al sistema"
    cy.contains('Acceder al sistema').click();
  });
});
