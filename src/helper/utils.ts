
export const objectType = (obj:object) => {
    return Object.prototype.toString.call(obj).slice(8, -1);
  };
  export const isDefined = (param:any) => {
    return typeof param != "undefined";
  };
  export const isUndefined = (param:undefined) => {
    return typeof param == "undefined";
  };
  export const isFunction = (param:Function) => {
    return typeof param == "function";
  };
  export const isNumber = (param:any) => {
    return typeof param == "number" && !isNaN(param);
  };
  export const isString = (str:any) => {
    return objectType(str) === "String";
  };
  export const isArray = (arr:any) => {
    return objectType(arr) === "Array";
  };
  
  export const closest = (target:any, selector:any) => {
    // closest(e.target, '.field')
    while (target) {
      if (target.matches && target.matches(selector)) return target;
      target = target.parentNode;
    }
    return null;
  };