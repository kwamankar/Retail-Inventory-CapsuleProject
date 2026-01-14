# Capsule Project - Environment Configuration Guide

## Overview
This guide explains how to set up environment variables for the Capsule Project. Environment variables help keep sensitive information like database passwords, API keys, and session secrets secure and separate from your code.

## Quick Setup

1. **Copy the example environment file:**
   ```bash
   copy .env.example .env
   ```
   
2. **Edit the `.env` file with your actual values**

3. **Start your application:**
   ```bash
   npm start
   ```

## Environment Variables Reference

### 🔧 Server Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3000` | No |
| `NODE_ENV` | Application environment | `development` | No |

### 🗄️ Database Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database hostname | `localhost` | No |
| `DB_USER` | Database username | `root` | No |
| `DB_PASSWORD` | Database password | `root` | No |
| `DB_NAME` | Database name | `capsule_db` | No |
| `DB_PORT` | Database port | `3306` | No |

### 🔐 Session Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SESSION_SECRET` | Session encryption key | Generated default | **Yes** |
| `SESSION_MAX_AGE` | Session duration (ms) | `1800000` | No |
| `SECURE_COOKIES` | Use secure cookies | `false` | No |

### 📧 Email Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EMAIL_SERVICE` | Email service provider | `gmail` | No |
| `EMAIL_USER` | Your email address | - | **Yes** |
| `EMAIL_PASS` | Email password/app password | - | **Yes** |
| `SUPPORT_EMAIL` | Support email recipient | Same as `EMAIL_USER` | No |

### 🛡️ Security Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` | No |

### 📊 Application Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `LOW_STOCK_THRESHOLD` | Low stock alert threshold | `5` | No |
| `HIGH_STOCK_THRESHOLD` | High stock alert threshold | `15` | No |
| `MAX_LOGIN_ATTEMPTS` | Max failed login attempts | `5` | No |

### 👤 Admin Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ADMIN_USERNAME` | Default admin username | `admin` | No |
| `ADMIN_EMAIL` | Default admin email | `admin@capsule.local` | No |
| `ADMIN_PASSWORD` | Default admin password | `admin123` | No |

### 🔧 Development Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEBUG_MODE` | Enable debug logging | `true` | No |
| `POPULATE_SAMPLE_DATA` | Auto-populate sample data | `false` | No |

### 📁 Backup Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BACKUP_DIR` | Backup directory path | `./backups` | No |
| `BACKUP_RETENTION_DAYS` | Days to keep backups | `30` | No |

## Important Security Notes

### 🔑 Session Secret
**Always change the default session secret in production!**
Generate a strong random key:
```bash
# Windows PowerShell
-join ((1..64) | ForEach {[char]((65..90)+(97..122)+(48..57) | Get-Random)})

# Online generators
# Visit: https://randomkeygen.com/ or https://passwordsgenerator.net/
```

### 📧 Gmail App Password
For Gmail, use an **App Password** instead of your regular password:
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use this 16-character password in `EMAIL_PASS`

### 🗄️ Database Security
- Use a strong database password
- Consider creating a dedicated database user for the application
- Limit database user permissions to only what's needed

## Environment File Example

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_USER=capsule_user
DB_PASSWORD=root
DB_NAME=capsule_db
DB_PORT=3306

# Session Configuration
SESSION_SECRET=your-super-strong-random-session-key-here-64-chars-min
SESSION_MAX_AGE=1800000
SECURE_COOKIES=true

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=vasuvarshney2002@gmail.com
EMAIL_PASS=spsq ulhf ockl eumq
SUPPORT_EMAIL=support@your-domain.com
```

## Troubleshooting

### Common Issues

**Database Connection Errors:**
- Verify database credentials in `.env`
- Ensure MySQL service is running
- Check if the database `capsule_db` exists

**Email Sending Errors:**
- Ensure 2FA is enabled on Gmail
- Use App Password, not regular password
- Check EMAIL_USER and EMAIL_PASS variables

**Session Issues:**
- Verify SESSION_SECRET is set
- Check if cookies are being sent properly

**Permission Errors:**
- Ensure the application has read access to `.env`
- Check file permissions on the `.env` file

### Environment Loading Issues

If environment variables aren't loading:
1. Ensure `.env` file is in the project root
2. Restart the application after changing `.env`
3. Check for syntax errors in `.env` file
4. Verify `dotenv` package is installed

## Best Practices

1. **Never commit `.env` files** - They're in `.gitignore` for a reason
2. **Use different `.env` files for different environments**
3. **Regularly rotate sensitive keys and passwords**
4. **Use strong, unique passwords for all services**
5. **Limit environment variable access** - Only include what's necessary
6. **Document any custom environment variables** - Update this guide when adding new variables

## Getting Help

If you encounter issues with environment configuration:
1. Check the troubleshooting section above
2. Verify all required variables are set correctly
3. Ensure sensitive information (passwords, keys) are properly formatted
4. Check the application logs for specific error messages

---

**⚠️ Security Warning:** Never share your `.env` file or commit it to version control. Always use `.env.example` for sharing configuration templates.
