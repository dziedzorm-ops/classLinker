# ClassLinker Setup Guide 🚀

This guide will help you set up and run the ClassLinker Online Student Result & Report Card Portal on your local machine or deploy it to production.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 16.x or higher
- **MongoDB**: Version 4.4 or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control

### External Services (Optional)
- **MongoDB Atlas**: For cloud database
- **Cloudinary**: For image storage
- **Twilio**: For SMS notifications
- **Gmail**: For email notifications

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd classlinker
```

### 2. Install Backend Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env` and update with your configuration:

```bash
cp .env.example .env
```

#### Required Environment Variables:
```env
# Database - Use local MongoDB or MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/classlinker

# JWT Secret - Generate a strong secret key
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# API URL for frontend
REACT_APP_API_URL=http://localhost:5000/api
```

#### Optional Service Configurations:
```env
# Email Service (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### 5. Frontend Configuration

Update the client-side environment:
```bash
cd client
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Both Frontend and Backend Together
```bash
# From the root directory
npm run dev
```

#### Option 2: Run Frontend and Backend Separately
```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend client
npm run client
```

### Production Mode

#### Build the Frontend
```bash
cd client
npm run build
cd ..
```

#### Start Production Server
```bash
npm start
```

## 🌐 Accessing the Application

Once running, you can access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 👥 Initial Setup

### 1. Create Your First School Admin Account

Navigate to the registration page and create an admin account:
- **Role**: Select "Admin"
- **Email**: Use your email address
- **Password**: Strong password with uppercase, lowercase, and numbers

### 2. School Configuration

After logging in as admin:
1. Go to **School Settings**
2. Update school information:
   - Basic details (name, address, contact)
   - Upload school logo
   - Set school motto
   - Configure academic year and terms

### 3. Add Subjects and Classes

1. **Add Subjects**:
   - Go to School Settings → Subjects
   - Add subjects like Mathematics, English, Science, etc.
   - Set pass marks and subject codes

2. **Add Classes**:
   - Go to School Settings → Classes
   - Add classes like "Grade 1A", "Form 2B", etc.
   - Set capacity and assign class teachers

### 4. Create Teacher Accounts

1. Go to **Teachers** → **Add Teacher**
2. Create teacher accounts
3. Assign subjects and classes to teachers

### 5. Register Students

1. Go to **Students** → **Add Student**
2. Fill in student information
3. Assign parents/guardians
4. Set current class and level

## 📊 Sample Data

### Creating Test Data

You can create sample data for testing:

```javascript
// Sample subjects
const subjects = [
  { name: "Mathematics", code: "MATH", level: "Primary", isCore: true, passMark: 50 },
  { name: "English Language", code: "ENG", level: "Primary", isCore: true, passMark: 50 },
  { name: "Science", code: "SCI", level: "Primary", isCore: true, passMark: 50 },
  { name: "Social Studies", code: "SOC", level: "Primary", isCore: false, passMark: 50 }
];

// Sample classes
const classes = [
  { name: "Grade 1A", level: "Primary", capacity: 30 },
  { name: "Grade 2B", level: "Primary", capacity: 35 },
  { name: "Grade 3A", level: "Primary", capacity: 32 }
];
```

## 🔧 Configuration Options

### Grading System Setup

Configure your school's grading system:

```javascript
// Percentage-based grading
{
  type: "Percentage",
  scale: [
    { grade: "A+", minScore: 90, maxScore: 100, description: "Excellent" },
    { grade: "A", minScore: 80, maxScore: 89, description: "Very Good" },
    { grade: "B+", minScore: 75, maxScore: 79, description: "Good" },
    { grade: "B", minScore: 70, maxScore: 74, description: "Good" },
    { grade: "C+", minScore: 65, maxScore: 69, description: "Average" },
    { grade: "C", minScore: 60, maxScore: 64, description: "Average" },
    { grade: "D+", minScore: 55, maxScore: 59, description: "Below Average" },
    { grade: "D", minScore: 50, maxScore: 54, description: "Below Average" },
    { grade: "E", minScore: 40, maxScore: 49, description: "Poor" },
    { grade: "F", minScore: 0, maxScore: 39, description: "Fail" }
  ],
  passMarkDefault: 50
}
```

### Notification Settings

Configure email and SMS notifications:
- Result publication alerts
- Report card availability
- Account registration confirmations
- Password reset emails

## 🛡️ Security Configuration

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### JWT Configuration
- Tokens expire in 7 days by default
- Refresh tokens available
- Secure cookie settings in production

### Rate Limiting
- 100 requests per 15 minutes per IP
- Additional limits on auth endpoints
- Configurable in production

## 📱 Mobile Optimization

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

Progressive Web App features:
- Offline viewing of cached data
- Install prompt on mobile devices
- Push notifications (when configured)

## 🚀 Deployment

### Heroku Deployment

1. **Prepare for deployment**:
   ```bash
   # Create Procfile
   echo "web: node server/index.js" > Procfile
   
   # Update package.json scripts
   npm run build
   ```

2. **Deploy to Heroku**:
   ```bash
   heroku create classlinker-app
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-atlas-connection-string
   heroku config:set JWT_SECRET=your-production-secret
   git push heroku main
   ```

### Vercel Deployment (Frontend)

1. **Build and deploy frontend**:
   ```bash
   cd client
   npm run build
   vercel --prod
   ```

### DigitalOcean Deployment

1. **Create droplet**
2. **Install dependencies**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Deploy application**:
   ```bash
   git clone <repository>
   cd classlinker
   npm install
   cd client && npm install && npm run build && cd ..
   pm2 start server/index.js --name classlinker
   ```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check firewall settings

2. **JWT Token Issues**:
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

3. **CORS Errors**:
   - Verify CLIENT_URL in backend `.env`
   - Check REACT_APP_API_URL in frontend

4. **File Upload Issues**:
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify upload permissions

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
DEBUG=classlinker:*
```

## 📞 Support

For technical support:
- Check the troubleshooting section above
- Review API documentation
- Check server logs for errors
- Verify environment configuration

## 🔄 Updates

To update the application:
```bash
git pull origin main
npm install
cd client && npm install && cd ..
npm run build
```

## 📋 Checklist

### Pre-Launch Checklist

- [ ] MongoDB connection established
- [ ] Environment variables configured
- [ ] School information updated
- [ ] Subjects and classes added
- [ ] Teacher accounts created
- [ ] Sample students registered
- [ ] Grading system configured
- [ ] Email/SMS services tested
- [ ] Report card generation tested
- [ ] Mobile responsiveness verified
- [ ] Security settings reviewed
- [ ] Backup strategy implemented

---

**Congratulations! 🎉**

Your ClassLinker Online Student Result & Report Card Portal is now ready to help schools manage student results efficiently and provide parents with secure access to their children's academic progress.

For additional features, customizations, or enterprise support, please refer to the main documentation or contact the development team.