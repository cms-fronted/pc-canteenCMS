export function flatten(arr) {
  let result = [];
    for (let i = 0;i<arr.length; i++){
      if(Array.isArray(arr[i].items)){
        result = result.concat(flatten(arr[i].items))
      }else {
        result.push(arr[i])
      }
    }
    return result
}