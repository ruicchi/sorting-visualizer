//# merge sort algorithm
//! to be finalized, merge sort should store unchosen elements of array | update visualizer also
//study

function generateMergeSortSteps(inputArray: number[]): Step[] {
  const steps: Step[] = [];
  const array = [...inputArray];
  
  //* Store initial state
  steps.push({
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeIndices: []
  });

  mergeSort(array, 0, array.length - 1, steps);
  
  //* Final state - everything sorted
  steps.push({
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    activeIndices: []
  });
  
  return steps;
}

function mergeSort(array: number[], left: number, right: number, steps: Step[]): void {
  if (left >= right) {
    return;
  }

  const middle = Math.floor((left + right) / 2);
  
  //* Recursively sort left and right halves
  mergeSort(array, left, middle, steps);
  mergeSort(array, middle + 1, right, steps);
  
  //* Conquer: Merge the sorted halves
  merge(array, left, middle, right, steps);
}

function merge(array: number[], left: number, middle: number, right: number, steps: Step[]): void {
  //* Show the active subarray being merged
  const activeIndices = [];
  for (let idx = left; idx <= right; idx++) {
    activeIndices.push(idx);
  }
  steps.push({
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    activeIndices: activeIndices
  });

  //* Create copies of the subarrays
  const leftArray = [];
  const rightArray = [];
  
  for (let i = left; i <= middle; i++) {
    leftArray.push(array[i]);
  }
  for (let i = middle + 1; i <= right; i++) {
    rightArray.push(array[i]);
  }
  
  let i = 0;
  let j = 0;
  let k = left;

  //* Merge the two sorted subarrays
  while (i < leftArray.length && j < rightArray.length) {
    //* Show comparison between elements from left and right subarrays
    steps.push({
      array: [...array],
      comparingIndices: [left + i, middle + 1 + j],
      swappingIndices: [],
      sortedIndices: [],
      activeIndices: activeIndices
    });

    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      
      //* Show the element being placed in merged position
      steps.push({
        array: [...array],
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [],
        activeIndices: activeIndices
      });
      
      i++;
    } else {
      array[k] = rightArray[j];
      
      //* Show the element being placed in merged position
      steps.push({
        array: [...array],
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [],
        activeIndices: activeIndices
      });
      
      j++;
    }
    
    k++;
  }

  //* Copy remaining elements from left subarray
  while (i < leftArray.length) {
    array[k] = leftArray[i];
    steps.push({
      array: [...array],
      comparingIndices: [],
      swappingIndices: [k],
      sortedIndices: [],
      activeIndices: activeIndices
    });
    i++;
    k++;
  }

  //* Copy remaining elements from right subarray
  while (j < rightArray.length) {
    array[k] = rightArray[j];
    steps.push({
      array: [...array],
      comparingIndices: [],
      swappingIndices: [k],
      sortedIndices: [],
      activeIndices: activeIndices
    });
    j++;
    k++;
  }
}

export default generateMergeSortSteps;