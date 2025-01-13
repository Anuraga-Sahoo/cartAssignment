document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".product-container table");
  const subtotalElement = document.querySelector(".subtotal-price-card");
  const totalElement = document.querySelector(".total-price-card");
  const checkoutButton = document.querySelector(".checkout-btn");

  // add loder
  const loader = document.createElement("div");
    loader.classList.add("loader");
    document.body.appendChild(loader);
    loader.style.display = "block";


  // Fetch cart data from the API
  fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889") 
      .then(response => response.json())
      .then(data => {
          const items = data.items;
          // hide loder
          loader.style.display = "none";
          let total = 0;
          let newSubtotal;

          items.forEach(item => {
            //creating a row
              const itemRow = document.createElement("tr");

              // creating product image and title
              const productCell = document.createElement("td");
              productCell.classList.add("product-img-title");
              const productImage = document.createElement("img");
              productImage.src = item.image;
              productImage.alt = item.title;
              productImage.classList.add("product-img");
              const productTitle = document.createElement("p");
              productTitle.classList.add("title");
              productTitle.textContent = item.title;
              productCell.appendChild(productImage);
              productCell.appendChild(productTitle);

              // Price
              const priceCell = document.createElement("td");
              priceCell.classList.add("price");
              priceCell.textContent = `₹ ${item.presentment_price.toLocaleString()}`;

              // Quantity
              const quantityCell = document.createElement("td");
              quantityCell.classList.add("quantity");
              const quantityInput = document.createElement("input");
              quantityInput.type = "number";
              quantityInput.value = item.quantity;
              quantityInput.min = item.quantity_rule.min;
              quantityInput.classList.add("quantity-container");
              quantityCell.appendChild(quantityInput);

              // Subtotal
              const subtotalCell = document.createElement("td");
              subtotalCell.classList.add("subtotal");
              const subtotal = item.presentment_price * item.quantity;
              subtotalCell.textContent = `₹ ${subtotal.toLocaleString()}`;
              subtotalElement.innerHTML = `₹ ${subtotal.toLocaleString()}`;

              // Delete Icon
              const deleteCell = document.createElement("td");
              deleteCell.classList.add("delete-icon");
              const deleteIcon = document.createElement("i");
              deleteIcon.classList.add("fa-solid", "fa-trash");
              deleteIcon.style.color = "#FFD43B";
              deleteCell.appendChild(deleteIcon);

              // Append all cells to the row
              itemRow.appendChild(productCell);
              itemRow.appendChild(priceCell);
              itemRow.appendChild(quantityCell);
              itemRow.appendChild(subtotalCell);
              itemRow.appendChild(deleteCell);

              // Append the row to the table
              cartContainer.appendChild(itemRow);

              // Update total
              total += subtotal;
              totalElement.textContent = `₹ ${total.toLocaleString()}`;

              // Event listener for quantity change
              quantityInput.addEventListener("change", (e) => {
                  const newQuantity = parseInt(e.target.value);
                   newSubtotal = item.presentment_price * newQuantity;
                  subtotalCell.textContent = `₹ ${newSubtotal.toLocaleString()}`;
                  subtotalElement.textContent = `₹ ${newSubtotal.toLocaleString()}`;
                  total =  newSubtotal;
                  totalElement.textContent = `₹ ${total.toLocaleString()}`;
                  
              });

              // Event listener for delete icon
              deleteIcon.addEventListener("click", () => {
                showModal(() => {
                  itemRow.remove();
                  // updateTotal();
                  saveCart();
                })
                 
                  
              });
              function showModal(confirmCallback) {
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
                  subtotalElement.textContent = `${total-newSubtotal}`
                  totalElement.textContent = `${total-newSubtotal}`
                  confirmCallback();
                });
        
                modal.querySelector(".cancel-btn").addEventListener("click", () => {
                    modal.remove();
                });
            }
          });

          // Checkout button functionality
          checkoutButton.addEventListener("click", () => {
              alert("Proceeding to checkout!");
          });
      })
      .catch(error => {console.error("Error fetching cart data:", error)
         loader.style.display = "block"; 
      });
});