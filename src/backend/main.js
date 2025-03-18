import { app, BrowserWindow, ipcMain, clipboard  } from "electron";
import started from "electron-squirrel-startup";

const fs = require("fs");
const path = require("path");


// Import services and initialize the database
const { initializeDatabase } = require("./database");
const GoalService = require("./services/GoalService"); // Import the GoalService
const TransactionService = require("./services/TransactionService"); // Import the TransactionService
const BudgetService = require("./services/BudgetService"); // Import the BudgetService

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // start application at max window size and remove menu bar
  mainWindow.maximize();
  mainWindow.removeMenu();

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools for debugging
  mainWindow.webContents.openDevTools();
};


// Function to export all data to JSON
const exportDataToJSON = async () => {
  try {
    const goals = await GoalService.getGoals();
    
    let budgets;
    try {
      budgets = await BudgetService.getBudgets();
      console.log("Budgets for export:", budgets);
    } catch (budgetError) {
      console.error("Error getting budgets for export:", budgetError);
      budgets = { success: false, error: "Failed to retrieve budget entries.", details: budgetError.message };
      
      // Try a test budget creation to debug
      try {
        const testResult = await BudgetService.testCreateBudget();
        console.log("Test budget creation result:", testResult);
      } catch (testError) {
        console.error("Test budget creation failed:", testError);
      }
    }
    
    const transactions = await TransactionService.getTransactions();

    const jsonData = {
      financialGoals: goals,
      transactions: transactions,
      budgets: budgets, // Include budgets data in exported JSON
    };

    const jsonString = JSON.stringify(jsonData, null, 4);

    // Copy JSON string to clipboard
    clipboard.writeText(jsonString);
    
    console.log("Data successfully copied to clipboard!");
    return { success: true };
  } catch (error) {
    console.error("Error exporting data to JSON:", error);
    return { success: false, error: error.message };
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully");
    
    // Initial test to ensure the budget table exists
    try {
      await BudgetService.checkTableExists();
    } catch (error) {
      console.error("Error checking budget table:", error);
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
  }

  // Convert DB to json and save to clipboard
  ipcMain.handle("export-json", async (event) => {
    return await exportDataToJSON(); // Export data after DB initialization
  });
  
  // IPC handlers for financial goal CRUD operations using GoalService
  ipcMain.handle("create-goal", async (event, goalData) => {
    return await GoalService.createGoal(goalData);
  });

  ipcMain.handle("get-goals", async () => {
    const goals = await GoalService.getGoals();
    console.log("Goals fetched from DB:", goals); // Debugging
    return goals;
  });

  ipcMain.handle("update-goal", async (event, id, updatedData) => {
    return await GoalService.updateGoal(id, updatedData);
  }); 

  ipcMain.handle("delete-goal", async (event, id) => {
    return await GoalService.deleteGoal(id);
  });

  // IPC handlers for transaction CRUD operations using TransactionService
  ipcMain.handle("create-transaction", async (event, transactionData) => {
    return await TransactionService.createTransaction(transactionData);
  });

  ipcMain.handle("get-transactions", async () => {
    const transactions = await TransactionService.getTransactions();
    console.log("Transactions fetched from DB:", transactions); // Debugging
    return transactions;
  });

  ipcMain.handle("update-transaction", async (event, id, updatedData) => {
    return await TransactionService.updateTransaction(id, updatedData);
  });

  ipcMain.handle("delete-transaction", async (event, id) => {
    return await TransactionService.deleteTransaction(id);
  });

  // IPC handlers for budget operations
  ipcMain.handle("create-budget", async (event, {budgetData}) => {
    console.log("Received Budget Data for create:", budgetData);  // Log received data
    try {
      const result = await BudgetService.createBudget(budgetData);
      console.log("Create budget result:", result);
      return result;
    } catch (error) {
      console.error("Error in create-budget handler:", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("get-budgets", async () => {
    try {
      console.log("Attempting to get budgets...");
      const result = await BudgetService.getBudgets();
      console.log("Budgets fetched from DB:", result); // Debugging
      return result;
    } catch (error) {
      console.error("Error in get-budgets handler:", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("update-budget", async (event, {id, budgetData}) => {
    console.log("Updating budget", id, budgetData);
    try {
      const result = await BudgetService.updateBudget(id, budgetData);
      console.log("Update budget result:", result);
      return result;
    } catch (error) {
      console.error("Error in update-budget handler:", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("delete-budget", async (event, id) => {
    console.log("Deleting budget", id);
    try {
      const result = await BudgetService.deleteBudget(id);
      console.log("Delete budget result:", result);
      return result;
    } catch (error) {
      console.error("Error in delete-budget handler:", error);
      return { success: false, error: error.message };
    }
  });
  
  // Handler for saving a complete budget with multiple expenses
  ipcMain.handle("save-budget", async (event, budgetData) => {
    console.log("Saving complete budget:", budgetData);
    try {
      const result = await BudgetService.saveBudget(budgetData);
      console.log("Save budget result:", result);
      return result;
    } catch (error) {
      console.error("Error in save-budget handler:", error);
      return { success: false, error: error.message };
    }
  });
  
  // Handler for clearing all budgets
  ipcMain.handle("clear-budgets", async () => {
    console.log("Clearing all budgets");
    try {
      const result = await BudgetService.clearBudgets();
      console.log("Clear budgets result:", result);
      return result;
    } catch (error) {
      console.error("Error in clear-budgets handler:", error);
      return { success: false, error: error.message };
    }
  });

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.