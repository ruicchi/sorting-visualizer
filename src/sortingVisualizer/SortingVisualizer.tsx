import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";
// import bubbleSort from './BubbleSortLogic';
import handleBubbleSortClick from "./BubbleSortHandler";
// import mergeSort from './MergeSortLogic';

const SortingVisualizerLogic = () => {
  //notes: this is my programming diary | all functions are arrow functions, 'cause i think it's more intuitive to use than normal ones. 
 
  //# Visualizer Logic is here 

  //* initializing empty array for random array generator
  const [array, setArray] = useState([]);

  //* State for progress speed and animation speed, using percentage for easier understanding
  const [progressSpeed, setProgressSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(15);

  //* Animation states
  const [steps, setSteps] = useState([]); //^ where all sorting steps are
  const [currentStepIndex, setCurrentStepIndex] = useState(0); //^ which step we're on
  const [isPlaying, setIsPlaying] = useState(false); //^ is the animation playing?
  const [comparingIndices, setComparingIndices] = useState([]); //^ which bars to highlight?
  const [sortedIndices, setSortedIndices] = useState([]); //^ which bars are in final position

  //* State to track which algorithm is selected
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  //* handler for play
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  //* handler for pause
  const handlePauseClick = () => {
    setIsPlaying(false);
  };

  //* handler for reset
  const handleResetClick = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setComparingIndices([]);
    setSortedIndices([]);
  };

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

  //* Random array creator | numbers from 15 to 414
  const generateNewArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      const randomValue = Math.floor(Math.random() * 100) + 15;
      newArray.push(randomValue);
    }
    setArray(newArray);
  };

  //* listener for arraysizes
  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  //* Play button handler
  const handlePlay = () => {
    let sortedArray;

    switch(selectedAlgorithm) {
      case 'bubble':
        sortedArray = handleBubbleSortClick(array); //to be changed to a new handler
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

      {/* //* calls the arrayBars function and gives classname*/}
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