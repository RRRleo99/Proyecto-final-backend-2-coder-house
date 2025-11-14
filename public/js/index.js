// Este archivo puede usarse para scripts generales de la página principal

document.addEventListener('DOMContentLoaded', () => {
  // Ejemplo: Mostrar un mensaje de bienvenida
  const welcomeMsg = document.getElementById('welcome-msg');
  if (welcomeMsg) {
    welcomeMsg.textContent = '¡Bienvenido a nuestro E-commerce!';
  }

  // Ejemplo: Manejar un formulario de búsqueda de productos
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('search-input').value;
      // Redirigir a la página de resultados (ajustá la ruta según tu app)
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    });
  }
});