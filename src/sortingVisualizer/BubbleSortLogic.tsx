//# bubble sort algorithm

function bubbleSort(inputArray: number[]): number[] {
  //* Clones the input array to avoid mutating the original
  const bubbleArray = [...inputArray];

  //# Outer loop: controls the number of passes through the bubbleArray
  for (let i = 0; i < bubbleArray.length - 1; i++) {
    
    //# Inner loop: compares adjacent elements
    //* After each pass, the largest element "bubbles up" to the end, so we can reduce the inner loop range by i each time
    for (let j = 0; j < bubbleArray.length - i - 1; j++) {
      
      //* Compare adjacent elements
      if (bubbleArray[j] > bubbleArray[j + 1]) {
        //* Swap if they're in the wrong order
        const temp = bubbleArray[j];
        bubbleArray[j] = bubbleArray[j + 1];
        bubbleArray[j + 1] = temp;
      }
    }
  }

  return bubbleArray;
}

export default bubbleSort;