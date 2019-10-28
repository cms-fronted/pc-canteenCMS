export function flatten(arr) {
  const result = [];
  tree2arr(arr);
  function tree2arr(arr) {
    arr.forEach(el => {
      while (el.items) {
        result.push({
          id: el.id,
          name: el.name
        })
        tree2arr(el.items);
        return
      }
      result.push({
        id: el.id,
        name: el.name
      })
    });
  }
  return result

}
export function getAllOptions(target) {
  let allId = target.map(el => el.id).join(",");
  target.unshift({
    id: allId,
    name: "全部"
  })
  return target;
}
