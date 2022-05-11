import { parse } from './netscape';
import * as tree from './tree'

export const Treefy = () => {
    function init(data:any){
        const bookmarks = parse(data);
        bookmarks.map(item=>tree.traversal(item))
        console.log(bookmarks)
    }
	
}

