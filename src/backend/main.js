import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';

// Import services and initialize the database
const { initializeDatabase } = require('./database');
const GoalService = require('./services/GoalService'); // Import the GoalService

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

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  initializeDatabase();

  // IPC handlers for financial goal CRUD operations using GoalService
  ipcMain.handle('create-goal', async (event, goalData) => {
    return await GoalService.createGoal(goalData);
  });

  ipcMain.handle('get-goals', async () => {
    const goals = await GoalService.getGoals();
    console.log("Goals fetched from DB:", goals); // Debugging
    return goals;
  });

  ipcMain.handle('update-goal', async (event, id, updatedData) => {
    return await GoalService.updateGoal(id, updatedData);
  });

  ipcMain.handle('delete-goal', async (event, id) => {
    return await GoalService.deleteGoal(id);
  });

  createWindow();

 // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
