export const getUnmatchedElements = (arr1, arr2) => {
  // create a new empty array to store the unmatched elements
  var unmatched = [];

  // iterate through each element in the first array
  for (var i = 0; i < arr1.length; i++) {
    // check if the element is not present in the second array
    if (arr2.indexOf(arr1[i]) === -1) {
      // if the element is not present, add it to the unmatched array
      unmatched.push(arr1[i]);
    }
  }

  // return the array of unmatched elements
  return unmatched;
};
