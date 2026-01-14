const db = require('./config/db');

async function setupSampleData() {
  try {
    console.log('🚀 Setting up sample data...');

    // Check if admin user exists
    const [adminExists] = await db.execute("SELECT * FROM users WHERE role = 'admin'");
    if (adminExists.length === 0) {
      console.log('Creating admin user...');
      await db.execute(
        "INSERT INTO users (username, email, password, role, created_at, last_login) VALUES (?, ?, ?, ?, NOW(), NOW())",
        ['admin', 'admin@retaildashboard.com', 'admin123', 'admin']
      );
    }

    // Check if regular users exist
    const [userCount] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    if (userCount[0].count === 0) {
      console.log('Creating sample users...');
      await db.execute(
        "INSERT INTO users (username, email, password, role, created_at, last_login) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 2 HOUR))",
        ['john_doe', 'john@example.com', 'password123', 'user']
      );
      await db.execute(
        "INSERT INTO users (username, email, password, role, created_at, last_login) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 HOUR))",
        ['jane_smith', 'jane@example.com', 'password123', 'user']
      );
      await db.execute(
        "INSERT INTO users (username, email, password, role, created_at, last_login) VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW())",
        ['demo_user', 'demo@example.com', 'demo123', 'user']
      );
    }

    // Check if inventory exists or if we need more items
    const [inventoryCount] = await db.execute("SELECT COUNT(*) as count FROM inventory");
    if (inventoryCount[0].count < 10) {
      console.log('Creating sample inventory items...');
      
      // Clear existing inventory first if any
      if (inventoryCount[0].count > 0) {
        await db.execute("DELETE FROM inventory");
      }
      
      const inventoryItems = [
        ['Laptop Computers', 15, 999.99, 'Electronics', 'Tech Supplier Inc'],
        ['Office Chairs', 8, 199.50, 'Furniture', 'Office Depot'],
        ['Wireless Mice', 3, 25.99, 'Electronics', 'Tech Supplier Inc'], // Low stock
        ['Desk Lamps', 25, 45.00, 'Furniture', 'Furniture World'], // High stock
        ['USB Keyboards', 12, 35.75, 'Electronics', 'Tech Supplier Inc'],
        ['Coffee Makers', 2, 89.99, 'Appliances', 'Home Essentials'], // Low stock
        ['Printer Paper', 30, 15.99, 'Office Supplies', 'Paper Co'], // High stock
        ['Bluetooth Speakers', 7, 79.99, 'Electronics', 'Audio Tech'],
        ['Standing Desks', 4, 299.99, 'Furniture', 'Ergonomic Solutions'], // Low stock
        ['Water Bottles', 50, 12.99, 'Office Supplies', 'Eco Products'], // High stock
        ['Tablets', 1, 599.99, 'Electronics', 'Tech Supplier Inc'], // Low stock
        ['Monitor Stands', 20, 89.50, 'Furniture', 'Office Depot'], // High stock
        ['Webcams', 9, 149.99, 'Electronics', 'Audio Tech'],
        ['Desk Organizers', 35, 19.99, 'Office Supplies', 'Paper Co'], // High stock
        ['Phone Chargers', 4, 29.99, 'Electronics', 'Tech Supplier Inc'] // Low stock
      ];

      for (const item of inventoryItems) {
        await db.execute(
          "INSERT INTO inventory (name, quantity, price, category, supplier) VALUES (?, ?, ?, ?, ?)",
          item
        );
      }
    }

    // Check if user activity exists
    const [activityCount] = await db.execute("SELECT COUNT(*) as count FROM user_activity");
    if (activityCount[0].count === 0) {
      console.log('Creating sample user activity...');
      
      // Get user IDs
      const [users] = await db.execute("SELECT id, username FROM users");
      
      for (const user of users) {
        // Add some login activities
        await db.execute(
          "INSERT INTO user_activity (user_id, activity_type, activity_description, created_at) VALUES (?, ?, ?, ?)",
          [user.id, 'LOGIN', `User ${user.username} logged in`, new Date(Date.now() - Math.random() * 86400000)]
        );
        
        if (user.username !== 'admin') {
          // Add some inventory activities for regular users
          await db.execute(
            "INSERT INTO user_activity (user_id, activity_type, activity_description, created_at) VALUES (?, ?, ?, ?)",
            [user.id, 'INVENTORY_ADD', `Added new inventory item`, new Date(Date.now() - Math.random() * 86400000)]
          );
          
          await db.execute(
            "INSERT INTO user_activity (user_id, activity_type, activity_description, created_at) VALUES (?, ?, ?, ?)",
            [user.id, 'INVENTORY_DELETE', `Removed inventory item`, new Date(Date.now() - Math.random() * 86400000)]
          );
        }
      }
    }

    console.log('✅ Sample data setup complete!');
    console.log('\n📋 Summary:');
    
    const [finalUserCount] = await db.execute("SELECT COUNT(*) as count FROM users");
    const [finalInventoryCount] = await db.execute("SELECT COUNT(*) as count FROM inventory");
    const [finalActivityCount] = await db.execute("SELECT COUNT(*) as count FROM user_activity");
    
    console.log(`👥 Users: ${finalUserCount[0].count}`);
    console.log(`📦 Inventory Items: ${finalInventoryCount[0].count}`);
    console.log(`📊 Activity Records: ${finalActivityCount[0].count}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Demo User: demo_user / demo123');
    console.log('John Doe: john_doe / password123');
    console.log('Jane Smith: jane_smith / password123');

  } catch (error) {
    console.error('❌ Error setting up sample data:', error);
  } finally {
    process.exit();
  }
}

// Run the setup
setupSampleData();
