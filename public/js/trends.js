document.addEventListener("DOMContentLoaded", async () => {
  // Fetch inventory data
  const res = await fetch("/inventory-data");
  const inventory = await res.json();

  // Prepare data for charts
  const categories = {};
  let lowStock = 0, highStock = 0, normalStock = 0;
  inventory.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
    if (item.quantity < 5) lowStock++;
    else if (item.quantity > 15) highStock++;
    else normalStock++;
  });

  // Pie chart: Inventory by Category
  new Chart(document.getElementById('categoryPie'), {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#2a5298', '#f4b400', '#db4437', '#0f9d58', '#ab47bc', '#00acc1']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  // Doughnut chart: High/Low/Normal Stock
  new Chart(document.getElementById('stockDoughnut'), {
    type: 'doughnut',
    data: {
      labels: ['Low Stock', 'Normal Stock', 'High Stock'],
      datasets: [{
        data: [lowStock, normalStock, highStock],
        backgroundColor: ['#db4437', '#f4b400', '#0f9d58']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });

  // Bar chart: Inventory Quantity by Item
  new Chart(document.getElementById('itemBar'), {
    type: 'bar',
    data: {
      labels: inventory.map(i => i.name),
      datasets: [{
        label: 'Quantity',
        data: inventory.map(i => i.quantity),
        backgroundColor: '#2a5298'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } },
      scales: { x: { title: { display: true, text: 'Item' } }, y: { title: { display: true, text: 'Quantity' } } }
    }
  });
});
