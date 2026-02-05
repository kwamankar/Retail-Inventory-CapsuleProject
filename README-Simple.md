# Capsule Retail Dashboard - Docker Setup

A containerized retail inventory management system with Node.js, Express, and MySQL.

## Quick Start

### Prerequisites
- Docker Desktop
-- 2GB free disk space

### Start Application
```bash
# Clone or extract to directory
cd Vasu_Varshney_fordocker

# Start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### Access Application
- **Main App**: http://localhost:3000
- **Database Admin**: http://localhost:8080
- **Health Check**: http://localhost:3000/api/health

### Login Credentials
- **Admin**: `admin` / `admin123`
- **Demo**: `demo_user` / `demo123`

## Services

| Service | Port | Purpose |
|---------|------|---------|
| app | 3000 | Node.js application |
| mysql | 3307 | MySQL database |
| phpmyadmin | 8080 | Database management |

## Basic Commands

```bash
# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and start
docker-compose up --build -d

# View logs
docker-compose logs app

# Clean up everything (⚠️ deletes data)
docker-compose down -v
```

## Database Access

- **Host**: `localhost:3307` (external) or `mysql:3306` (internal)
- **User**: `capsule_user`
- **Password**: `secure_password_123`
- **Database**: `capsule_db`

## Features

✅ User authentication & roles  
✅ Inventory management  
✅ AI chatbot assistant  
✅ Admin dashboard  
✅ Email notifications  
✅ Activity logging  
✅ Data persistence  

## Troubleshooting

**Port conflicts**: Change ports in `docker-compose.yml`
**Database issues**: Check logs with `docker-compose logs mysql`
**App won't start**: Rebuild with `docker-compose up --build`

---

🎉 **That's it!** Your application should now be running at http://localhost:3000
