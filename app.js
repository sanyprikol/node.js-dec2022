// Modules
// const {sayHello} = require('./helpers/say.Hello.helper');
// sayHello();
// Global variables
// console.log(__dirname);
// console.log(__filename);
// console.log(process.cwd());
// path
// const path = require('path');
// const joinPath = path.join('folder', 'folder2', 'text.txt');
// const notmalizePath = path.normalize('//////test///\/test2/test3////////test4');
// const resolvedPath = path.resolve('folder', 'folder2', 'text.txt');
// console.log(resolvedPath);
//OS
// const os = require('os');
// console.log(os.cpus());
// console.log(os.arch());

//FS
// const fs = require('fs');
// const path = require('path');
// const text2Path = path.join(__dirname, 'folder', 'folder2', 'text2.txt');

// fs.writeFile(text2Path, 'Hello', (err)=> {
//     if (err) throw new Error(err.message);
// })
//
// fs.readFile(text2Path, {encoding: 'utf-8'}, (err, data)=> {
//     if (err) throw new Error(err.message);
//     console.log(data);
// })
// fs.appendFile(text2Path, '\nhello world', (err)=>{
//     if (err) throw new Error(err.message);
// })
//
// fs.readdir(path.join(__dirname, 'folder'),{withFileTypes: true}, (err, files)=>{
//     if (err) throw new Error(err.message);
//     console.log(files);
//     files.forEach(file=>{
//         console.log(file.isDirectory());
//     })
// })
// fs.mkdir(path.join(__dirname,'folder', 'folder4'),(err)=>{
//     if (err) throw new Error(err.message);
// })
// fs.unlink(text2Path, (err)=>{
//     if (err) throw new Error(err.message);
// })
// fs.rmdir(path.join(__dirname, 'folder4'),(err)=>{
//     if (err) throw new Error(err.message);
// })

const fs = require('node:fs/promises');
const path = require('node:path');

// const foo = async () => {
//     const basePath = path.join(process.cwd(), 'baseFolder');
//
//     await fs.mkdir(basePath, {recursive: true});
//     const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt'];
//     const folderNames = ['folder1', 'folder2', 'folder3', 'folder4', 'folder5'];
//
//     for (const folder of folderNames) {
//         await fs.mkdir(path.join(basePath, folder), {recursive: true})
//     }
//
//     for (const file of fileNames) {
//         await fs.writeFile(path.join(basePath, file), 'Hello')
//     }
//
//     const files = await fs.readdir(basePath);
//     for (const file of files) {
//         const stat = await fs.stat(path.join(basePath, file));
//         console.log(path.join(basePath, file), ' : ', stat.isDirectory() ? 'folder' : 'file');
//     }
// }
// foo();

const foo = async () => {
    const basePath = path.join(process.cwd(), 'baseFolder');

    await fs.mkdir(basePath, {recursive:true});
    const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt'];
    const folderNames = ['folder1', 'folder2', 'folder3', 'folder4', 'folder5'];

    await Promise.all(fileNames.map(async (folder) => {
        const folderPath = path.join(basePath, folder);
        await fs.mkdir(folderPath, {recursive:true})
        await Promise.all(fileNames.map(async (file) => {
            await fs.writeFile(path.join(folderPath, file), 'Hello')
        }));
    }));

    const files = await fs.readdir(basePath);
    for (const file of files) {
        const stat = await fs.stat(path.join(basePath, file));
        console.log(path.join(basePath, file), ' : ', stat.isDirectory() ? 'folder' : 'file');
    }
}

foo();