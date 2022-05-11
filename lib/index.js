"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treefy = void 0;
const netscape_1 = require("./netscape");
const tree = require("./tree");
const Treefy = () => {
    function init(data) {
        const bookmarks = (0, netscape_1.parse)(data);
        bookmarks.map(item => tree.traversal(item));
        console.log(bookmarks);
    }
};
exports.Treefy = Treefy;
