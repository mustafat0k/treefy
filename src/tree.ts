
export type TreeState = {
    children?: TreeState[]|any;
    parent: string|null;
    slug?: string|null;
    idx?: number|null;

}
// tree to list
export const fromTree = (data:TreeState[], sort:string='') => {
    let list:TreeState[] = [];
  
    data.map((item:TreeState,i:number) =>{
         let itm = {...item}
         let idx = i;
         
         if(item.children?.length>0){
          let children: TreeState[] = [];
  
          let child = fromTree(itm?.children)
          let newChild = child.map((c:TreeState,key:number)=>{
            children.push({...c, idx: ++key})
          })
          list = [...list, ...children];
        }
        itm.idx=idx;
        delete itm.children
        if(!itm.parent) itm.parent = null;
        //delete itm.parent
        //delete itm._id
        list.push(itm)
    })
  
      return list.sort((a:TreeState|any, b:TreeState|any):any => {
        if(!sort){
          a.idx > b.idx ? 1 : -1
        }else{
          a.idx < b.idx ? 1 : -1
        }
      })
  
}

// treeify
export const makeTree = (data:TreeState[]|any, mode=false) : any => {
    const pro = localStorage.getItem('pro')

    // Top-level elements
    let children:any = []; 
    let map = new Map(data.map((item:TreeState) => [item.slug, item ])).set(null, {children}); 

    // closed nested
    if(pro) { // ==true
        
        for (let item of data.slice().sort((a:any, b:any) => a.idx > b.idx ? 1 : -1)) { // children sorting
        // @ts-ignore
            (map.get(item.parent || null).children ??= [])
            .push(item.slug ? map.get(item.slug) : item);
        }

        return children.sort((a:any, b:any) => a.idx > b.idx ? 1 : -1)
    }else{
        return data.filter((d:any)=>{
        if(!d.parent) return true;
        }).sort((a:any, b:any):any => a.idx > b.idx ? 1 : -1)
    }
}

export const updateTree =  (data:any, id:any, newItem:any) => {

    let list = fromTree(data);
    let newList:any = [];
    list.map((l:any)=>{
        let n = {...l};
        if(n._id == id){
            n = {
            ...n,
            ...newItem,
            new:false
            }
        }
        newList.push(n)
    })
    let tree = makeTree(newList)
    return tree;
}

export const removeFromTree =  (data:any, id:number|string) => {
    let list = fromTree(data);
    let newList:any = [];
    list.map((l:any)=>{
        if(l._id != id){
        let n = {...l};
        // TODO:// Backend action
        newList.push(n)
        
        }
    })
    let tree = makeTree(newList)  
    return tree;
}

export const removeManyFromTree =  (data:any, id:string|number) => {
    let list = [...fromTree(data)];

    let newList:any = [];
    list.map((l:any)=>{
        if(l._id != id){
        let n = {...l};
        // TODO:// Backend action
        newList.push(n)
        
        }else{
        // list.map(li=>{
        //   if(li.parent == l.slug){
        //     console.log('children', li.title)
        //     removeManyFromTree(list, li._id);
        //   }
        // })
        // console.log('title', l.title)
        // 
        // removeFromTree(list, l._id);
        }
    })

    console.log('newList: ',newList)
    console.log('list: ',list)
    let tree = makeTree(list)
    return tree;
}

export const addIntoTree =  (data:any,id:string|number) => {
    let list = fromTree(data);
    let newList:any = [];
    list.map((l:any)=>{
        let n = {...l};
        if(n._id == id){
            let newItem = {
            title:'New Folder',
            slug:`new-folder-${generateRandom()}`,
            _id:generateRandom(),
            parent:n.slug||null,
            idx:0,
            new:true
            }
            newList.unshift(newItem)
        }
        newList.push(n)
    })
    let tree = makeTree(newList)
    return tree;
}

export const generateRandom = () => {
    return randomBinary(1,9999) + randomBinary(1,9999);
}

export const randomBinary = (min:number, max:number) => {
    return Math.floor(min + Math.random() * (max + 1 - min)).toString(2);
}
   
const uptodateTree = ({id,selected,folders,values}:any) =>{}

// tree order & index
export const reorderList = (data:any) => {}

// find parent of item
export const fromTreeFindParent = (data:any,name:string='') => {
    let list = [];
    let parent = {};

    data.map((item:any,i:number)=>{
            let itm = {...item}
        if(item.children?.length>0){
            let child = fromTree(itm?.children)
            //let child = fromTreeFindParent(itm?.children)

            if(name){
            let found = child.find(c=>c.slug==name)
            if(found){
                parent=item
            }
            }

            //list = [...list, ...child];
        }
        itm.idx=i;
        delete itm.children
        list.push(itm)
    })

    return parent;

}

// get item from tree
export const getNestedChildren = (arr:any, parent:any) => {
    var out = []
    for(var i in arr) {
        if(arr[i].parent == parent) {
            var children = getNestedChildren(arr, arr[i]._id)

            if(children.length) {
                arr[i].children = children
            }
            out.push(arr[i])
        }
    }
    return out
} 

export const traversal = ({group, c, folderCount, total}:any) =>{
    let count=c; 

    let len = '';
    Array.from(Array(count)).forEach(()=>len+='--')

        folderCount+=1;

    if(group){
        let childCount = group.children?.length;
        //files
        total+=1+parseInt(childCount||0);
        if(group.type=='folder') {console.log(len,count,group.title, 'children:',childCount )}
        group?.children?.forEach((data:any)=>{
        traversal({data, count, folderCount, total})
        })
    }
}
   
export const generateTraverse = ({parent, group, c=1, folderCount, total}:any) =>{
    let index = 0;
    // TODO:// Define an id and send a parent. 
    let count=c; 
    let len = '';
    Array.from(Array(count)).forEach(()=>len+='--')
        folderCount+=1;

    if(group){
        let childCount = group.children?.length;
        //files
        total+=1+parseInt(childCount||0);
        if(group.type=='folder') {
        // console.log(len,count,group.title, 'children:',childCount )
        ++index
        let newObj = {id:group.title, type:group.type, level:count, childCount}
        console.log('index:',index,newObj)
        }

        group?.children?.forEach((data:any,key:number)=>{
            generateTraverse({index, data, count, folderCount, total})
        })
    }
}

export const retroversal = ({group, c, folderCount, total}:any) =>{
    let count=c; 

    let len = '';
    Array.from(Array(count)).forEach(()=>len+='--')

    folderCount+=1;
    group.id = group.title
    delete group.title

    if(group){
        let childCount = group.children?.length;
        //files
        total+=1+parseInt(childCount||0);
        if(group.type=='folder') {console.log(len,count,group.title, 'children:',childCount )}
        group?.children?.forEach((data:any)=>{
        data.id = data.title
        delete data.title
        
        traversal({data, count, folderCount, total})
        })
    }
}

// generate

// regenerate