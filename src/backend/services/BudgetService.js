const Budget = require('../models/Budget');

class BudgetService {
  async createBudget(budgetData) {
    try {
      console.log("Data to be saved:", budgetData);
      const newBudget = await Budget.create(budgetData);
      return { success: true, budget: newBudget };
    } catch (error) {
      console.error('Error creating budget:', error);
      return { error: 'Failed to create budget.' };
    }
  }

  async getBudgets() {
    try {
      const budgets = await Budget.findAll();
      return { success: true, budgets };
    } catch (error) {
      console.error('Error retrieving budgets:', error);
      return { error: 'Failed to retrieve budgets.' };
    }
  }

  async updateBudget(id, updatedData) {
    try {
      const [updatedCount] = await Budget.update(updatedData, { where: { id } });
      if (updatedCount > 0) {
        return { success: true };
      } else {
        return { error: 'Budget not found or not updated.' };
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      return { error: 'Failed to update budget.' };
    }
  }

  async deleteBudget(id) {
    try {
      const deletedCount = await Budget.destroy({ where: { id: parseInt(id) } });
      if (deletedCount > 0) {
        return { success: true };
      } else {
        console.error(`No goal found with ID: ${id}`);  // Debugging
        return { error: 'Budget not found or not deleted.' };
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      return { error: 'Failed to delete budget.' };
    }
  }
}

module.exports = new BudgetService();
