var electronInstaller = require('electron-winstaller');

var resultPromise = electronInstaller.createWindowsInstaller({
    description: "WebP to JPG converter",
    appDirectory: './Viper-win32-x64',
    outputDirectory: '/installer',
    authors: 'Codiodes',
    exe: 'Viper.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));