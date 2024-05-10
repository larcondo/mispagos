const deepEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const k of keys1) {
    const val1 = obj1[k];
    const val2 = obj2[k];
    const areObjects = isObject(val1) && isObject(val2);
    if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
      return false
    }
  }

  return true;
};

const isObject = (obj) => obj != null && typeof obj === 'object';

module.exports = {
  deepEqual,
  isObject,
}