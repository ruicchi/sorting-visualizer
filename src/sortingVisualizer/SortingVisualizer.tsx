import React, { useState } from "react"; //todo add useEffect later
import "./SortingVisualizer.css";
import bubbleSort from './BubbleSortLogic';
import mergeSort from './MergeSortLogic';

const SortingVisualizerLogic = () => {
  //notes: this is my programming diary | all functions are arrow functions, 'cause i think it's more intuitive to use than normal ones. 
 
  //# Visualizer Logic is here 
  
  //* initializing empty array for random array generator
  const [array, setArray] = useState([]);

  //* State for progress speed and animation speed, using percentage for easier understanding
  const [progressSpeed, setProgressSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(20);

  //* State to track which algorithm is selected
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  //* Algorithm selector handler
    const handleAlgorithmSelect = (algorithm) => {
      setSelectedAlgorithm(algorithm);
    };

  //* Handlers for sliders
  const handleSpeedChange = (event) => {
    setProgressSpeed(event.target.value);
  };
  const handleArraySize = (event) => {
    setArraySize(event.target.value);
  };

  //* Array mapper to have bars on numbers with index
  const arrayBars = array.map((value, index) => (
      <div
        key={index}
        className='arrayBar'
        style={{ height: `${value * 3}px` }} 
      >
        <span>{value}</span> 
        <span className="indexLabel">{index}</span> 
      </div>
    ));

  //! There has to be logic that generates an array if size is changed, this is useEffect

  //* Random array creator | numbers from 15 to 414
  const generateNewArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      const randomValue = Math.floor(Math.random() * 100) + 15;
      newArray.push(randomValue);
    }
    setArray(newArray);
  };

  //* Play button handler
  const handlePlay = () => {
    let sortedArray;

    switch(selectedAlgorithm) {
      case 'bubble':
        sortedArray = bubbleSort(array);
        break;
      case 'merge':
        sortedArray = mergeSort(array);
        break;
      default:
        sortedArray = bubbleSort(array);
    }
    
    setArray(sortedArray);
  };

  return (
    <div className="SortingVisualizer">
      {/* //# Visual UI is here*/}

      {/* //* calls the arrayBars function and gives classname | planning to move this to the bottom of buttons*/}
      <div className = 'arrayContainer'>
        {arrayBars}
      </div>

      <h1>Sorting Visualizer</h1>
      <p>Algorithm: {selectedAlgorithm}</p>

        {/* //* buttons */}
        <button className='btn random' onClick={generateNewArray}>randomize</button>
        <button className='btn play' onClick={handlePlay}>play</button>
        <button className='btn pause'>pause</button>
        <button className='btn stop'>stop</button>
        <button className='btn seekLeft'>seek left</button>
        <button className='btn seekRight'>seek right</button>

        {/* //debug: Show array as text */}
        <p>Array: {JSON.stringify(array)}</p>

        {/* //* algorithm selector | planning to add more*/}
        <button 
          className={`btn bubble ${selectedAlgorithm == 'bubble' ? 'active' : ''}`}
          onClick={() => handleAlgorithmSelect('bubble')}
        >
          bubble sort
        </button>
        <button 
          className={`btn merge ${selectedAlgorithm == 'merge' ? 'active' : ''}`}
          onClick={() => handleAlgorithmSelect('merge')}
        >
          merge sort
        </button>
        
        {/* //* slider for progress speed, planning to have thresholds or marks*/}
        <div className='slider progressSpeed'>
          <label>Progress Speed: {progressSpeed}%</label>
          <input
            type = 'range' 
            min = '1'
            max = '100'
            value = {progressSpeed} 
            onChange={handleSpeedChange}
          />
        </div>

        {/* //* slider for array size*/}
        <div className='slider arraySize'>
          <label>Array size: {arraySize}</label>
          <input 
            type = 'range'
            min = '4'
            max = '30'
            value = {arraySize} 
            onChange={handleArraySize}
          />
        </div>
    </div>
  );
};

export default SortingVisualizerLogic;