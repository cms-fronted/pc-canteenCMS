export function flatten(arr) {
  const result = [];
  tree2arr(arr);
  function tree2arr(arr) {
    arr = Array.isArray(arr) ? arr : [arr];
    arr.forEach(el => {
      while (el.items) {
        result.push({
          id: el.id,
          name: el.name,
          default: el.default,
          p_id: el.parent_id
        });
        tree2arr(el.items);
        return;
      }
      result.push({
        id: el.id,
        name: el.name,
        default: el.default,
        p_id: el.parent_id
      });
    });
  }
  return result;
}
export function getAllOptions(target) {
  let allId = target.map(el => el.id).join(",");
  target.unshift({
    id: allId,
    name: "全部"
  });
  return target;
}
export function unshiftAllOptions(arr) {
  arr.unshift({
    id: 0,
    name: "全部"
  });
  return arr;
}
export function treeToArr(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].items)) {
      result = result.concat(treeToArr(arr[i].items));
      result.push(arr[i]);
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
