# ERP Billing & Manufacturing System

A full-stack ERP system for managing sales, inventory, manufacturing, and customer relationships.

## 🚀 Features

- **Sales Management**: Create invoices with customer details (name, store, contact)
- **Sales History**: View sales history with customer analytics and sorting
- **Inventory Management**: Track raw materials and finished products
- **Manufacturing**: Log production processes and manage workflows
- **Purchase Management**: Handle purchase orders and supplier relationships
- **Customer Analytics**: Sort by recent customers, most sales, and high-value customers
- **User Authentication**: Secure JWT-based authentication
- **Dashboard**: Real-time analytics and insights

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## 📦 Project Structure

```
billingSoftware/
├── apps/
│   ├── backend/          # Express.js API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── index.js
│   │   └── package.json
│   └── frontend/         # Next.js App
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── utils/
│       └── package.json
├── package.json          # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Nidhiradadiya/my-first-repo.git
cd my-first-repo
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

**Backend** (`apps/backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/erp_billing
JWT_SECRET=your_secret_key
NODE_ENV=development
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start development servers
```bash
npm run dev
```

This will start:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

## 📱 Usage

1. Navigate to `http://localhost:3000`
2. Register a new user account
3. Login with your credentials
4. Start managing your business!

## 🌐 Deployment

See [DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md) for deployment instructions.

**Recommended Stack:**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

## 📊 Features Overview

### Sales Management
- Create new sales with customer details
- Add multiple items to invoice
- Calculate taxes and totals
- Store customer information (name, store, contact)

### Customer Analytics
- View top customers by:
  - Recent purchases
  - Most sales count
  - Highest total value
- Track last sale date
- Monitor customer spending patterns

### Inventory
- Manage raw materials
- Track finished products
- Monitor stock levels
- Get low stock alerts

### Manufacturing
- Log manufacturing processes
- Track raw material consumption
- Monitor finished product production
- View manufacturing history

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT-based authentication
- Protected API routes
- Environment variable configuration

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Sales
- `GET /api/sales` - Get all sales (paginated)
- `POST /api/sales` - Create new sale
- `GET /api/sales/analytics/customers` - Get customer analytics

### Inventory
- `GET /api/inventory/raw` - Get raw materials
- `POST /api/inventory/raw` - Add raw material
- `GET /api/inventory/finished` - Get finished products
- `POST /api/inventory/finished` - Add finished product

### Manufacturing
- `GET /api/manufacturing` - Get manufacturing logs
- `POST /api/manufacturing` - Create manufacturing log

### Purchase
- `GET /api/purchase` - Get purchases
- `POST /api/purchase` - Create purchase

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Nidhi Radadiya**

## 🙏 Acknowledgments

- Built with Next.js and Express.js
- UI inspired by modern ERP systems
- Icons by Lucide React
