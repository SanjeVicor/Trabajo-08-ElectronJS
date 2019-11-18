const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');

let mainWindow, newProductWindow;

if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}

app.on('ready', () =>{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () =>{
        app.quit();
    });
});

ipcMain.on('product:new',(e, newProduct) =>{
    //console.log(newProduct)
    // mainWindow.webContents.send(evento, data)
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
})

const templateMenu = [
    {
        label : 'File',
        submenu:[
            {
                label:'New Product',
                accelerator: 'Ctrl+N',
                click(){
                    createNewProductWindow()
                }
            },
            {
                label: 'Remove All Products',
                click(){
                    mainWindow.webContents.send('products:remove_all');
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q', //darwin == MacOS
                click(){
                    app.quit()
                }
            }
        ]
    }
];

if(process.platform === 'darwin'){
    templateMenu.unshift({
        label: app.getName()
    });
}

if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label:'DevTools',
        submenu:[
            {
                label : 'Show/Hide Dev Tools',
                accelerator: "Ctrl+D",
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}

function createNewProductWindow(){
    newProductWindow = new BrowserWindow({
        width: 400,
        height:300,
        title:"Add A New Product",
        //frame:false,
        webPreferences: {
            nodeIntegration: true
        }
    }) 
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));

    newProductWindow.on('closed', () =>{
        newProductWindow = null;
    });
}