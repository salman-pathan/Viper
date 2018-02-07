const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const dialog = require('electron').dialog;
const path = require('path');
const url = require('url');
const webp = require('webp-converter');

let sourceFilePath, destinationFolder;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 400});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

const appMenu = Menu.buildFromTemplate([
    {
        label: 'Menu',
        submenu: [
            {label: 'About'},
            {type: 'separator'},
            {
                label: 'Exit',
                click() {
                    app.quit();
                }
            }
        ]
    }
]);

Menu.setApplicationMenu(appMenu);

ipcMain.on('onClickSelectFile', () => {
  const callback = (data) => {
    console.log('onClickSelectFileResult: ' + data);
    sourceFilePath = data;
  };
  const options = {
    filters: [
      {name: 'WebP Image', extensions: ['webp']}
    ],
    properties: ['openFile']
  };
  dialog.showOpenDialog(options, callback);
});

ipcMain.on('onClickSelectFolder', () => {
  const callback = (data) => {
    console.log('onClickSelectFolderResult' + data);
    destinationFolder = data+"/unnamed.jpg";
  };
  const options = {
    properties: ['openDirectory']
  };
  dialog.showOpenDialog(options, callback);
});

ipcMain.on('onClickConvert', () => {
  if (!sourceFilePath) {
    dialog.showErrorBox('Error', 'Please select WebP image!');
    return;
  }

  if (!destinationFolder) {
    dialog.showErrorBox('Error', 'Please select destination folder!');
    return;
  }

  webp.dwebp(sourceFilePath, destinationFolder+'/convertedFile.jpg', '-o', (status) => {
    console.log('Conversion Status: ' + status);
    if (status === 100) {
      let options = {
        title: 'Success',
        message: 'Conversion Successful!'
      };
      dialog.showMessageBox({options: options});
      sourceFilePath = null;
      destinationFolder = null;
      return;
    }
    dialog.showErrorBox('Error', 'Conversion Unsuccessful!');
  });
});