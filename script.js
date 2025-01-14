document.addEventListener("DOMContentLoaded", () => {
  const cartTable = document.querySelector(".product-container table");
  const subtotalDisplay = document.querySelector(".subtotal-price-card");
  const totalDisplay = document.querySelector(".total-price-card");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // Add loader
  const displayLoader = document.createElement("div");
  displayLoader.classList.add("loader");
  document.body.appendChild(displayLoader);
  displayLoader.style.display = "block";

  // Fetch cart data from the API
  fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889")
    .then(response => response.json())
    .then(cartData => {
      const cartItems = cartData.items;

      // Hide loader
      displayLoader.style.display = "none";

      let totalPrice = 0;

      cartItems.forEach(cartItem => {
        // Create a row for each product
        const productRow = document.createElement("tr");

        // Create a cell for product image and title
        const productInfoCell = document.createElement("td");
        productInfoCell.classList.add("product-img-title");
        const productImg = document.createElement("img");
        productImg.src = cartItem.image;
        productImg.alt = cartItem.title;
        productImg.classList.add("product-img");
        const productTitle = document.createElement("p");
        productTitle.classList.add("title");
        productTitle.textContent = cartItem.title;
        productInfoCell.appendChild(productImg);
        productInfoCell.appendChild(productTitle);

        // Price cell
        const priceCell = document.createElement("td");
        priceCell.classList.add("price");
        priceCell.textContent = `₹ ${cartItem.presentment_price.toLocaleString()}`;

        // Quantity cell
        const quantityCell = document.createElement("td");
        quantityCell.classList.add("quantity");
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = cartItem.quantity;
        quantityInput.min = cartItem.quantity_rule.min;
        quantityInput.classList.add("quantity-container");
        quantityCell.appendChild(quantityInput);

        // Subtotal cell
        const subtotalCell = document.createElement("td");
        subtotalCell.classList.add("subtotal");
        const itemSubtotal = cartItem.presentment_price * cartItem.quantity;
        subtotalCell.textContent = `₹ ${itemSubtotal.toLocaleString()}`;
        subtotalDisplay.innerHTML = `₹ ${itemSubtotal.toLocaleString()}`;

        // Delete icon cell
        const deleteCell = document.createElement("td");
        deleteCell.classList.add("delete-icon");
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash");
        deleteIcon.style.color = "#FFD43B";
        deleteCell.appendChild(deleteIcon);

        // Append all cells to the row
        productRow.appendChild(productInfoCell);
        productRow.appendChild(priceCell);
        productRow.appendChild(quantityCell);
        productRow.appendChild(subtotalCell);
        productRow.appendChild(deleteCell);

        // Append the row to the table
        cartTable.appendChild(productRow);

        // Update total price
        totalPrice += itemSubtotal;
        totalDisplay.textContent = `₹ ${totalPrice.toLocaleString()}`;

        // Event listener for quantity change
        quantityInput.addEventListener("change", (e) => {
          const updatedQuantity = parseInt(e.target.value);
          const newItemSubtotal = cartItem.presentment_price * updatedQuantity;
          subtotalCell.textContent = `₹ ${newItemSubtotal.toLocaleString()}`;
          subtotalDisplay.textContent = `₹ ${newItemSubtotal.toLocaleString()}`;
          totalPrice = newItemSubtotal;
          totalDisplay.textContent = `₹ ${totalPrice.toLocaleString()}`;
        });

        // Event listener for delete icon
        deleteIcon.addEventListener("click", () => {
          showConfirmationModal(() => {
            productRow.remove();
            subtotalDisplay.textContent = `${totalPrice - itemSubtotal}`;
            totalDisplay.textContent = `${totalPrice - itemSubtotal}`;
          });
        });

        function showConfirmationModal(confirmCallback) {
          const modal = document.createElement("div");
          modal.classList.add("modal");
          modal.innerHTML = `
              <div class="modal-content">
                  <p>Are you sure you want to remove this item?</p>
                  <button class="confirm-btn">Yes</button>
                  <button class="cancel-btn">No</button>
              </div>
          `;
          document.body.appendChild(modal);

          modal.querySelector(".confirm-btn").addEventListener("click", () => {
            modal.remove();
            confirmCallback();
          });

          modal.querySelector(".cancel-btn").addEventListener("click", () => {
            modal.remove();
          });
        }
      });

      // Checkout button functionality
      checkoutBtn.addEventListener("click", () => {
        alert("Proceeding to checkout!");
      });
    })
    .catch(error => {
      console.error("Error fetching cart data:", error);
      displayLoader.style.display = "block";
    });
});