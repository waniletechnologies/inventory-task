 // Function to convert all values to strings
 export const convertValuesToString = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
      if (obj[key] !== null && obj[key] !== undefined) {
        acc[key] = obj[key].toString();
      }
      return acc;
    }, {});
  };