document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inventory-form");
  const tableBody = document.querySelector("#inventory-table tbody");

  // Fetch and display items on page load
  fetchItems();

  // Submit handler for Save Item
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      quantity: form.quantity.value,
      price: form.price.value,
      category: form.category.value,
      supplier: form.supplier.value
    };

    // Save to backend
    const res = await fetch("/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      form.reset();
      fetchItems(); // Refresh table after saving
    } else {
      alert("Failed to save item.");
    }
  });

  // Fetch items and show in table
  async function fetchItems() {
    const res = await fetch("/inventory-data");
    const items = await res.json();

    tableBody.innerHTML = "";

    items.forEach((item, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.category}</td>
        <td>${item.supplier}</td>
        <td>
          <button class="delete-btn" data-id="${item.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Attach delete buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const confirmed = confirm("Are you sure you want to delete this item?");
        if (confirmed) {
          const res = await fetch(`/inventory/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchItems(); // Refresh table after delete
          } else {
            alert("Failed to delete item.");
          }
        }
      });
    });
  }
});
