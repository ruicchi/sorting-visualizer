//# merge sort algorithm
//study

function mergeSort(inputArray: number[]): number[] {
  //* Base case: array with 1 or 0 elements is already sorted
  if (inputArray.length <= 1) {
    return inputArray;
  }

  //* split array in half
  const middle = Math.floor(inputArray.length / 2);
  const left = inputArray.slice(0, middle);
  const right = inputArray.slice(middle);

  //* Recursively sort and merge
  return merge(mergeSort(left), mergeSort(right));
}

//* Merge two sorted arrays
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  //* Compare and add smaller element
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  //* adds the remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}

export default mergeSort;