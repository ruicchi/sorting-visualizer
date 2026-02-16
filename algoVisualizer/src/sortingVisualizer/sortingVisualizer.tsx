import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";

const SortingVisualizerLogic = () => {
  // Visualizer Logic is here 
  
  // ... TO STUDY initializing empty array for random array generator
  const [array, setArray] = useState([]);

  // State for progress speed and animation speed, using percentage for easier understanding
  const [progressSpeed, setProgressSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(20);

  // Handlers for sliders
  const handleSpeedChange = (event) => {
    setProgressSpeed(event.target.value);
  };
  const handleArraySize = (event) => {
    setArraySize(event.target.value);
  };
  
  // There has to be mapper for array bar

  // There has to be logic that generates an array if size is changed, this is useEffect

  // Random array creator
  const generateNewArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      const randomValue = Math.floor(Math.random() * 400) + 10;
      newArray.push(randomValue);
    }
    setArray(newArray);
  };

  return (
    <div className="SortingVisualizer">
      {/* Visual UI is here*/}

      {/* ... TO STUDY array container*/}
      <div className = 'arrayContainer'>
        {arrayBars}
      </div>

      {/* buttons */}
      <h1>Sorting Visualizer</h1>
        <button className='btn random' onClick={generateNewArray}>randomize</button>
        <button className='btn play'>play</button>
        <button className='btn pause'>pause</button>
        <button className='btn stop'>stop</button>
        <button className='btn seekLeft'>seek left</button>
        <button className='btn seekRight'>seek right</button>

        {/* algorithm selector planning to add more*/}
        <button className='btn bubble'>bubble sort</button>
        <button className='btn merge'>merge sort</button>
        
        {/* slider for progress speed, planning to have thresholds or marks*/}
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

        {/* slider for array size*/}
        <div className='slider arraySize'>
          <label>Array size: {arraySize}</label>
          <input 
            type = 'range'
            min = '4'
            max = '100'
            value = {arraySize} 
            onChange={handleArraySize}
          />
        </div>
    </div>
  );
};

export default SortingVisualizerLogic;