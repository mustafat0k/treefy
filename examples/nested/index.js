import fs from 'fs'
import path from 'path'
import { load } from 'cheerio';
import {parse} from '../../lib/netscape';
import {traversal} from '../../lib/tree';

var xml = fs.readFileSync('./xml.xml')

// let side = document.querySelector('.side');

let nested = [];
let total = 0;
let folderCount = 0;
const map1 = new Map();


try {
    const bookmarks = parse(xml);
    bookmarks.map(item=>traversal({group:item, c:1, folderCount, total}))
   // bookmarks.map(item=>generateTraverse(null,item))
   // console.log({group:bookmarks, c:1, folderCount, total})
    fs.writeFile('./tree.json', JSON.stringify(nested) , function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
  
  
    // fs.writeFile('./tree.json', JSON.stringify(bookmarks) , function (err) {
    //   if (err) throw err;
    //   console.log('File is created successfully.');
    // });
    //console.log(JSON.stringify(nested))
  } catch (e) {
    console.error(e);
  }
  
  
 /**


const regenerate = (data) =>{
  const newData = [];
  data.forEach(el=>{
    let generated = generateTraverse(el);
    newData.push(generated)
  })
  return newData;
}

const generateTraverse = data =>{
  let newObj = {id:data.title, type:data.type, children:[]};
   data?.children?.forEach(d=>{
      if(d.type=='folder'){
         console.log(d.type)
       }
       if(d.type=='bookmark'){
         console.log('---',d.type)
       }

       let children = generateTraverse(d)
       newObj?.children?.push(children || []);
    })
  return nested.push(newObj);
}
**/