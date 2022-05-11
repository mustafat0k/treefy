// from https://github.com/sentialx/node-bookmarks-parser/blob/master/src/parsers/netscape.ts
// import fs from 'fs'
// import path from 'path'
import { load } from 'cheerio';
import Immer from 'immer'

export const canParse = (html:any) => {
  for (let i = 0; i < html.length; i++) {
    if (/\s/.test(html[i])) {
      continue;
    }
    if (html[i] === '<') {
      break;
    } else {
      return false;
    }
  }

  return (
    /<dl/i.test(html) &&
    /<\/dl/i.test(html) &&
    /<dt/i.test(html) &&
    /<a[^<>]href\s*=\s*/i.test(html)
  );
};

const getNodeData = ($:any, node:any) => {
  const data:any = {};

  for (let i = 0; i < node.childNodes.length; i++) {
    const child:any = $(node.childNodes[i]);


    if (node.childNodes[i].tagName === 'a') {
      data.type = 'bookmark';
      data.url = child.attr('href');

      data.title = child.text();

      const addDate = child.attr('add_date');
      if (addDate) {
        data.addDate = addDate;
      }

      const icon = child.attr('icon');
      if (icon) {
        data.icon = icon;
      }
    } else if (node.childNodes[i].tagName === 'h3') {
      data.type = 'folder';
      data.title = child.text();

      const addDate = child.attr('add_date');
      const lastModified = child.attr('last_modified');

      if (addDate) {
        data.addDate = addDate;
      }

      if (lastModified) {
        data.lastModified = lastModified;
      }
      data.nsRoot = null;
      if (child.attr('personal_toolbar_folder')) {
        data.nsRoot = 'toolbar';
      }
      if (child.attr('unfiled_bookmarks_folder')) {
        data.nsRoot = 'unsorted';
      }
    } else if (node.childNodes[i].tagName === 'dl') {
      data.__dir_dl = node.childNodes[i];
    }
  }

  if (data.type === 'folder' && !data.__dir_dl) {
    if (node.nextSibling && node.nextSibling.tagName === 'DD') {
      const dls = $(node.nextSibling).find('DL');
      if (dls.length) {
        data.__dir_dl = dls[0];
      }
    }
  }

  return data;
};

const processDir = ($:any, dir:any, level:any) => {
  const children = dir.childNodes;
  let menuRoot = null;

  const items = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!child.tagName) {
      continue;
    }
    if (child.tagName !== 'dt') {
      continue;
    }
    const itemData:any = getNodeData($, child);
    if (itemData.type) {
      if (level === 0 && !itemData.nsRoot) {
        if (!menuRoot) {
          menuRoot = {
            type: "folder",
            title: 'Menu',
            children: [],
            nsRoot: 'menu',
          };
        }
        if (itemData.type === 'folder' && itemData.__dir_dl) {
          itemData.children = processDir(
            $,
            itemData.__dir_dl,
            level + 1,
          );
          delete itemData.__dir_dl;
        }
        //@ts-ignore
        menuRoot.children.push(itemData);
      } else {
        if (itemData.type === 'folder' && itemData.__dir_dl) {
          itemData.children = processDir(
            $,
            itemData.__dir_dl,
            level + 1,
          );
          delete itemData.__dir_dl;
        }
        items.push(itemData);
      }
    }
  }
  if (menuRoot) {
    items.push(menuRoot);
  }
  return items;
};

export const parse = (html:any) => {
  const $ = load(html);
  const dls = $('dl');

  if (dls.length > 0) {
    return processDir($, dls[0], 0);
  }

  throw new Error(
    'Netscape parser: Bookmarks file malformed: no DL nodes were found',
  );
};