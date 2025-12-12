# Prisma Model Classes

This directory contains model classes that provide a clean abstraction layer over Prisma Client.

## Purpose

These model classes serve as an ORM-like interface that:
- Encapsulates common Prisma queries
- Provides reusable methods for CRUD operations
- Maintains consistency across the application
- Makes code more maintainable and testable

## Available Models

### Core Models
- **CentralUserModel** - Authentication and user management
- **UserModel** - User profiles and health data
- **ExpertModel** - Expert profiles and services
- **CenterModel** - Wellness center management
- **AppointmentModel** - Appointment scheduling

### Health Tracking Models
- **SleepLogModel** - Sleep tracking
- **ActivityLogModel** - Activity and exercise tracking
- **MealLogModel** - Nutrition and meal tracking

## Usage Examples

### Basic CRUD Operations

```javascript
import UserModel from '../models/userModel.js';

// Find user by ID
const user = await UserModel.findById(userId);

// Create new user
const newUser = await UserModel.create({
  user_id: centralUserId,
  fullName: 'John Doe',
  email: 'john@example.com',
});

// Update user
const updated = await UserModel.update(userId, {
  fullName: 'Jane Doe',
});

// List users with pagination
const users = await UserModel.findMany(
  { gender: 'female' },
  { skip: 0, take: 20 }
);
```

### Expert Operations

```javascript
import ExpertModel from '../models/expertModel.js';

// Get approved experts
const experts = await ExpertModel.findApproved({
  take: 10,
  orderBy: { rating: 'desc' },
});

// Approve expert
await ExpertModel.approve(expertId);

// Update rating
await ExpertModel.updateRating(expertId, 4.5, 100);
```

### Appointment Queries

```javascript
import AppointmentModel from '../models/appointmentModel.js';

// Get upcoming appointments
const upcoming = await AppointmentModel.findUpcoming(userId, 'user');

// Get past appointments
const past = await AppointmentModel.findPast(expertId, 'expert');

// Update status
await AppointmentModel.updateStatus(appointmentId, 'completed');
```

### Health Log Analytics

```javascript
import { MealLogModel, ActivityLogModel } from '../models/logModel.js';

// Get nutrition summary
const summary = await MealLogModel.getNutritionSummary(
  userId,
  new Date('2026-01-01'),
  new Date('2026-01-31')
);

// Get total calories burned
const calories = await ActivityLogModel.getTotalCalories(
  userId,
  startDate,
  endDate
);
```

## Model Methods

### Common Methods (All Models)
- `findById(id)` - Find single record by ID
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `delete(id)` - Delete record
- `findMany(where, options)` - List records with filters
- `count(where)` - Count records

### Specialized Methods

**CentralUserModel:**
- `findByEmail(email)`
- `findByGoogleId(googleId)`
- `updateLastLogin(id)`
- `activate(id)` / `deactivate(id)`

**ExpertModel & CenterModel:**
- `findApproved(options)`
- `findPending(options)`
- `approve(id)` / `reject(id)`
- `updateRating(id, rating, totalReviews)`

**AppointmentModel:**
- `findByUserId(userId, options)`
- `findByExpertId(expertId, options)`
- `findUpcoming(userId, role)`
- `findPast(userId, role)`
- `updateStatus(id, status)`

**Log Models:**
- `findByDateRange(userId, startDate, endDate)`
- `getNutritionSummary(userId, startDate, endDate)` (MealLog)
- `getTotalCalories(userId, startDate, endDate)` (ActivityLog)

## Best Practices

1. **Use Models in Services**: Import and use model classes in service files
2. **Keep Business Logic in Services**: Models should only handle data access
3. **Add Methods as Needed**: Extend models with new methods for common queries
4. **Include Relations Wisely**: Use `includeRelations` parameter to control data loading
5. **Use Transactions**: For complex operations, use Prisma transactions in services

## Architecture

```
Controllers
    ↓
Services (Business Logic)
    ↓
Models (Data Access)
    ↓
Prisma Client
    ↓
Database
```

## Adding New Models

To add a new model:

1. Create new file in `models/` directory
2. Import Prisma client
3. Create class with static methods
4. Export the class
5. Document methods in this README

Example template:

```javascript
import prisma from '../config/prisma.js';

class MyModel {
  static async findById(id) {
    return await prisma.myTable.findUnique({
      where: { id },
    });
  }

  static async create(data) {
    return await prisma.myTable.create({ data });
  }

  // Add more methods...
}

export default MyModel;
```

## Migration from Old Models

Old model files using raw SQL have been replaced with these Prisma-based models. The new models provide:
- ✅ Type safety
- ✅ SQL injection prevention
- ✅ Better error handling
- ✅ Consistent API
- ✅ Easier testing
