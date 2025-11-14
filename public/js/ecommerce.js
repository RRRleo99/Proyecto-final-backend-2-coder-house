// Ejemplo: Agregar producto al carrito usando fetch
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const productId = e.target.dataset.productId;
      const cartId = e.target.dataset.cartId; // Si usás un carrito por usuario

      try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Producto agregado al carrito');
        } else {
          alert('Error al agregar producto');
        }
      } catch (error) {
        alert('Error de red');
      }
    });
  });
});

// Ejemplo: Mostrar mensaje de éxito o error
function showMessage(message, type = 'success') {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = message;
  msgDiv.className = type === 'success' ? 'msg-success' : 'msg-error';
  document.body.appendChild(msgDiv);
  setTimeout(() => msgDiv.remove(), 3000);
}