# Capsule Retail Dashboard - Docker Deployment

A complete retail inventory management system built with Node.js, Express, and MySQL, fully containerized with Docker.

## 🚀 Features

- **User Management**: Admin and regular user roles with authenticationklnzfmvnfv
- **Inventory Management**: Add, view, edit, and delete inventory items
- **Real-time Chatbot**: AI-powered assistant for inventory queries
- **Admin Dashboard**: Comprehensive analytics and user management
- **Notifications**: Low stock alerts and activity tracking
- **Email Support**: Contact form with email notifications
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v3.8+
- At least 2GB free disk space
- Internet connection for initial image downloads

## 🔧 Quick Start

### 1. Clone or Download the Project
```bash
# If using git
git clone <your-repository-url>
cd Vasu_Varshney_fordocker

# Or extract the ZIP file and navigate to the directory
```

### 2. Start the Application
```bash
# Start all services (MySQL database + Node.js app + phpMyAdmin)
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### 3. Access the Application

Once the containers are running, you can access:

- **Main Application**: http://localhost:3000
- **phpMyAdmin** (Database management): http://localhost:8080  
- **Health Check**: http://localhost:3000/api/health

## 👤 Default Login Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Features**: Full dashboard access, user management, analytics

### Demo Users
- **Username**: `demo_user` | **Password**: `demo123`
- **Username**: `john_doe` | **Password**: `password123`
- **Username**: `jane_smith` | **Password**: `password123`

## 🐳 Docker Services

### Application Service (`app`)
- **Image**: Built from local Dockerfile
- **Port**: 3000
- **Environment**: Production-ready Node.js application
- **Features**: Health checks, logging, persistent data

### MySQL Service (`mysql`)
- **Image**: MySQL 8.0
- **Port**: 3306
- **Database**: `capsule_db`
- **Features**: Automatic initialization, data persistence, health checks

### phpMyAdmin Service (`phpmyadmin`)
- **Image**: Official phpMyAdmin
- **Port**: 8080
- **Purpose**: Database administration interface

## 📁 Data Persistence

The following data is persisted using Docker volumes:

- **MySQL Data**: `capsule-mysql-data`
- **Application Logs**: `capsule-app-logs`
- **Application Backups**: `capsule-app-backups`

## 🔧 Configuration

### Environment Variables

The application uses the following key environment variables (configured in `.env`):

```bash
# Database Configuration
DB_HOST=mysql
DB_USER=capsule_user
DB_PASSWORD=secure_password_123
DB_NAME=capsule_db

# Application Settings
SESSION_SECRET=your-super-strong-random-session-key
LOW_STOCK_THRESHOLD=5
HIGH_STOCK_THRESHOLD=15

# Email Configuration (Update with your credentials)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Email Setup (Optional)

To enable contact form functionality:

1. Get a Gmail App Password:
   - Enable 2FA on your Google account
   - Go to https://myaccount.google.com/apppasswords
   - Generate an app password for "Mail"

2. Update `.env` file:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## 🛠️ Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v

# Rebuild and restart
docker-compose up --build -d
```

### Individual Service Management
```bash
# Restart just the app
docker-compose restart app

# View app logs
docker-compose logs -f app

# View database logs
docker-compose logs -f mysql

# Execute commands in containers
docker-compose exec app sh
docker-compose exec mysql mysql -u capsule_user -p capsule_db
```

### Health Monitoring
```bash
# Check service status
docker-compose ps

# Check health status
docker-compose exec app wget --spider http://localhost:3000/api/health
```

## 🗃️ Database Information

### Connection Details
- **Host**: `mysql` (from within Docker network) or `localhost` (external)
- **Port**: `3306` (internal) / `3307` (external access)
- **Database**: `capsule_db`
- **Username**: `capsule_user`
- **Password**: `secure_password_123`

### Tables
- `users` - User accounts and roles
- `inventory` - Product inventory data
- `user_activity` - Activity logging
- `inventory_logs` - Inventory change tracking

### Sample Data
The database automatically populates with:
- 4 user accounts (1 admin, 3 regular users)
- 15 sample inventory items
- Sample user activity logs

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the ports
netstat -an | findstr :3000
netstat -an | findstr :3306

# Stop existing services or change ports in docker-compose.yml
```

**Database Connection Failed**
```bash
# Check MySQL container status
docker-compose logs mysql

# Verify database is healthy
docker-compose exec mysql mysqladmin ping -h localhost -u capsule_user -p
```

**Application Won't Start**
```bash
# Check application logs
docker-compose logs app

# Rebuild the application image
docker-compose build app --no-cache
docker-compose up -d
```

**Email Not Working**
- Verify Gmail App Password is correct
- Check that 2FA is enabled on Gmail
- Ensure EMAIL_USER and EMAIL_PASS are properly set

### Performance Optimization

**For Development**
```bash
# Use bind mounts for live code changes
# Add to docker-compose.yml app service:
volumes:
  - .:/app
  - /app/node_modules
```

**For Production**
- Increase MySQL memory allocation
- Set up proper logging aggregation
- Configure SSL/HTTPS
- Set up regular database backups

## 🔒 Security Notes

### Default Passwords
⚠️ **Important**: Change these default credentials in production:

1. **MySQL root password**: `rootpassword123`
2. **MySQL user password**: `secure_password_123`  
3. **Session secret**: Update `SESSION_SECRET` in `.env`
4. **Admin password**: Change via the application interface

### Production Recommendations
- Use Docker secrets for sensitive data
- Set up proper SSL certificates
- Configure firewall rules
- Regular security updates
- Monitor logs for suspicious activity

## 📚 API Endpoints

### Public Endpoints
- `GET /` - Home page
- `GET /login` - Login page
- `GET /register` - Registration page
- `GET /api/health` - Health check

### Authenticated Endpoints
- `GET /dashboard` - User dashboard
- `GET /inventory` - Inventory management
- `GET /chatbot` - AI assistant
- `POST /inventory` - Add inventory item
- `DELETE /inventory/:id` - Delete item

### Admin Endpoints
- `GET /admin-dashboard` - Admin dashboard
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - User management

## 🔄 Backup & Recovery

### Manual Backup
```bash
# Backup database
docker-compose exec mysql mysqldump -u capsule_user -p capsule_db > backup.sql

# Backup volumes
docker run --rm -v capsule-mysql-data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz -C /data .
```

### Restore Database
```bash
# Restore from SQL file
docker-compose exec -T mysql mysql -u capsule_user -p capsule_db < backup.sql
```

## 📈 Monitoring

### Health Checks
All services include health checks:
- MySQL: Connection and query test
- App: HTTP endpoint availability
- Automatic restart on failure

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mysql
```

## 🚪 Shutting Down

### Graceful Shutdown
```bash
# Stop services but keep data
docker-compose down

# Stop services and remove containers/networks
docker-compose down --remove-orphans
```

### Complete Cleanup (⚠️ Deletes all data)
```bash
# Remove everything including volumes
docker-compose down -v --remove-orphans
docker system prune -a
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker and application logs
3. Verify all prerequisites are met
4. Check GitHub issues (if applicable)

## 🎯 Next Steps

After successful deployment:
1. Change default passwords
2. Configure email settings
3. Set up regular backups
4. Configure monitoring
5. Customize the application for your needs

---

**🎉 Congratulations!** Your Capsule Retail Dashboard is now running in Docker containers with full functionality and data persistence.
