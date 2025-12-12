import prisma from '../config/prisma.js';

/**
 * Log Models - Health tracking (Sleep, Activity, Meal)
 */

// ============================================
// SLEEP LOG MODEL
// ============================================
export class SleepLogModel {
  static async findById(id) {
    return await prisma.sleepLog.findUnique({
      where: { id },
    });
  }

  static async create(data) {
    return await prisma.sleepLog.create({ data });
  }

  static async update(id, data) {
    return await prisma.sleepLog.update({
      where: { id },
      data,
    });
  }

  static async findByUserId(userId, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.sleepLog.findMany({
      where: { userId },
      skip,
      take: take || 30,
      orderBy: orderBy || { date: 'desc' },
    });
  }

  static async findByDateRange(userId, startDate, endDate) {
    return await prisma.sleepLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  static async delete(id) {
    return await prisma.sleepLog.delete({
      where: { id },
    });
  }
}

// ============================================
// ACTIVITY LOG MODEL
// ============================================
export class ActivityLogModel {
  static async findById(id) {
    return await prisma.activityLog.findUnique({
      where: { id },
    });
  }

  static async create(data) {
    return await prisma.activityLog.create({ data });
  }

  static async update(id, data) {
    return await prisma.activityLog.update({
      where: { id },
      data,
    });
  }

  static async findByUserId(userId, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.activityLog.findMany({
      where: { userId },
      skip,
      take: take || 30,
      orderBy: orderBy || { date: 'desc' },
    });
  }

  static async findByDateRange(userId, startDate, endDate) {
    return await prisma.activityLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  static async getTotalCalories(userId, startDate, endDate) {
    const result = await prisma.activityLog.aggregate({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        calories: true,
      },
    });

    return result._sum.calories || 0;
  }

  static async delete(id) {
    return await prisma.activityLog.delete({
      where: { id },
    });
  }
}

// ============================================
// MEAL LOG MODEL
// ============================================
export class MealLogModel {
  static async findById(id) {
    return await prisma.mealLog.findUnique({
      where: { id },
    });
  }

  static async create(data) {
    return await prisma.mealLog.create({ data });
  }

  static async update(id, data) {
    return await prisma.mealLog.update({
      where: { id },
      data,
    });
  }

  static async findByUserId(userId, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.mealLog.findMany({
      where: { userId },
      skip,
      take: take || 30,
      orderBy: orderBy || { date: 'desc' },
    });
  }

  static async findByDateRange(userId, startDate, endDate) {
    return await prisma.mealLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  static async getNutritionSummary(userId, startDate, endDate) {
    const result = await prisma.mealLog.aggregate({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
    });

    return {
      totalCalories: result._sum.calories || 0,
      totalProtein: result._sum.protein || 0,
      totalCarbs: result._sum.carbs || 0,
      totalFat: result._sum.fat || 0,
    };
  }

  static async delete(id) {
    return await prisma.mealLog.delete({
      where: { id },
    });
  }
}

// Default export for backward compatibility
export default {
  SleepLog: SleepLogModel,
  ActivityLog: ActivityLogModel,
  MealLog: MealLogModel,
};
