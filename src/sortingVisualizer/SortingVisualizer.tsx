import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";
import generateBubbleSortSteps from "./BubbleSortLogic";
import generateMergeSortSteps from "./MergeSortLogic";

const SortingVisualizerLogic = () => {
  //notes: all functions are arrow functions, 'cause i think it's more intuitive to use than normal ones. 
 
  //# Visualizer Logic is here 

  //* initializing empty array for random array generator
  const [array, setArray] = useState([]);

  //* State for progress speed and array sizes, using percentage for easier understanding
  const [progressSpeed, setProgressSpeed] = useState<number[]>(50);
  const [arraySize, setArraySize] = useState<number[]>(15);

  //* Animation states
  const [steps, setSteps] = useState<Step[]>([]); //^ where all sorting steps are
  const [currentStepIndex, setCurrentStepIndex] = useState(0); //^ which step we're on
  const [isPlaying, setIsPlaying] = useState(false); //^ is the animation playing?
  const [comparingIndices, setComparingIndices] = useState<number[]>([]); //^ which bars to highlight?
  const [sortedIndices, setSortedIndices] = useState<number[]>([]); //^ which bars are in final position
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]); //^ which bars are swapping?
  const [activeIndices, setActiveIndices] = useState<number[]>([]); //^ which bars are active?

  //* State to track which algorithm is selected
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Pick an algorithm!');

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

  //study handler for seek left (go to previous step)
  const handleSeekLeft = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsPlaying(false); //* Pause when seeking
    }
  };

  //study handler for seek right (go to next step)
  const handleSeekRight = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsPlaying(false); //* Pause when seeking
    }
  };
  
  //* Helper function to create random array
  const createRandomArray = (arraySize) => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      const randomValue = Math.floor(Math.random() * 100) + 15;
      newArray.push(randomValue);
    }
    return newArray;
  };

  //* handler for randomize
  const handleRandomizeClick = () => {
    const newArray = createRandomArray(arraySize);
    setArray(newArray);
    setIsPlaying(false);
    setComparingIndices([]);
    setSortedIndices([]);
    
    //* Regenerate steps if an algorithm was selected
    if (selectedAlgorithm === 'bubble' || selectedAlgorithm === 'merge') {
      regenerateSteps(newArray);
    }
  };

  //* function to generate steps based on selected algorithm
  const regenerateSteps = (currentArray: number[]) => {
    if (selectedAlgorithm == 'bubble') {
      const sortingSteps = generateBubbleSortSteps(currentArray);
      setSteps(sortingSteps);
      setCurrentStepIndex(0);
      console.log("Regenerated bubble sort steps:", sortingSteps.length);
    } else if (selectedAlgorithm == 'merge') {
      const sortingSteps = generateMergeSortSteps(currentArray);
      setSteps(sortingSteps);
      setCurrentStepIndex(0);
      console.log("Regenerated merge sort steps:", sortingSteps.length);
    }
  };

  //* handler for bubble sort
  const handleBubbleSort= () => {
    const sortingSteps = generateBubbleSortSteps(array); //^ Generate all steps
    setSelectedAlgorithm('bubble') //^ sets selected algorithm
  
    setSteps(sortingSteps); //^ Store steps in state
    
    //* resets to beginning
    setCurrentStepIndex(0);
    setIsPlaying(false);

    console.log("Generated steps:", sortingSteps.length);
  };

  //* handler for merge sort
  const handleMergeSort= () => {
    const sortingSteps = generateMergeSortSteps(array); //^ Generate all steps
    setSelectedAlgorithm('merge') //^ sets selected algorithm
  
    setSteps(sortingSteps); //^ Store steps in state
    
    //* resets to beginning
    setCurrentStepIndex(0);
    setIsPlaying(false);

    console.log("Generated steps:", sortingSteps.length);
  };

  useEffect(() => {
    //* only runs if playing and not at end
    if (isPlaying && currentStepIndex < steps.length - 1) {
      
      //* Calculate delay based on speed slider
      //* progressSpeed is 1-100, convert to milliseconds
      const delay = 1000 - (progressSpeed * 9); //* Fast = low delay | can be set to another value
      
      //* Set timer to advance to next step
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
      
      //* Cleanup: cancel timer if something changes
      return () => clearTimeout(timer);
      
    } else if (currentStepIndex >= steps.length - 1) {
      //* Reached the end, stop playing
      setIsPlaying(false);
    }
  }, [isPlaying, currentStepIndex, steps.length, progressSpeed]);

  //* gets the current step data
  const currentStep = steps[currentStepIndex] || {
    array: array,
    comparingIndices: undefined,
    swappingIndices: undefined,
    sortedIndices: []
  };

  //* Update display states when the step changes
  useEffect(() => {
    if (currentStep) {
      setArray(currentStep.array);
      setComparingIndices(currentStep.comparingIndices || []);
      setSwappingIndices(currentStep.swappingIndices || []);
      setSortedIndices(currentStep.sortedIndices || []);
      setActiveIndices(currentStep.activeIndices || []);
    }
  }, [currentStepIndex, steps]);

  //* Handlers for sliders
  const handleSpeedChange = (event) => {
    setProgressSpeed(event.target.value);
  };

  const handleArraySize = (event) => {
    setArraySize(event.target.value);
  };

  //study progress slider for steps
  const handleProgressChange = (event) => {
    const newStepIndex = parseInt(event.target.value);
    setCurrentStepIndex(newStepIndex);
    setIsPlaying(false); //* Pause when manually scrubbing
  };

  //* listener for arraysizes
  useEffect(() => {
    handleRandomizeClick();
  }, [arraySize]);

  //* when you click a sorting button
  const handleSortTypeClick = (selectedAlgorithm) => {
    switch(selectedAlgorithm) {
      case 'bubble':
        handleBubbleSort(array);
        break;
      case 'merge':
        handleMergeSort(array);
        break;
    }
  };

  //study Array mapper to have bars on numbers with index
  const arrayBars = array.map((value, index) => {
      let barColor = '#00a4db';  //* Default blue
  
      if (sortedIndices.includes(index)) {
        barColor = '#10b981';  //* Green for sorted
      } else if (comparingIndices.includes(index)) {
        barColor = '#f59e0b';  //* Orang for comparing
      } else if (swappingIndices && swappingIndices.includes(index)) {
        barColor = '#ef4444';  //* Red for swapping
      } else if (activeIndices && activeIndices.includes(index)) {
        barColor = '#8b5cf6';  //* Purple for active subarray
      }

      return (
        <div
          key={index}
          className='arrayBar'
          style={{ 
            height: `${value * 3}px`,
            backgroundColor: barColor,
            transition: 'all 0.3s ease'
          }} 
        >
          <span className='barValue'>{value}</span> 
          <span className="indexLabel">{index}</span> 
        </div>
      );
  });

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
        <button className='btn random' onClick={handleRandomizeClick}>randomize</button>
        <button className='btn play' onClick={handlePlayClick}>play</button>
        <button className='btn pause' onClick={handlePauseClick}>pause</button>
        <button className='btn stop' onClick={handleResetClick}>reset</button>
        <button 
          className='btn seekLeft' 
          onClick={handleSeekLeft}
          disabled={currentStepIndex === 0 || steps.length === 0}
        >seek left</button>
        <button 
          className='btn seekRight'
          onClick={handleSeekRight}
          disabled={currentStepIndex >= steps.length - 1 || steps.length === 0}
        >seek right</button>

        {/* //debug: Show array as text */}
        <p>Array: {JSON.stringify(array)}</p>

        {/* //* algorithm selector | planning to add more*/}
        <button 
          className={`btn bubble ${selectedAlgorithm == 'bubble' ? 'active' : ''}`}
          onClick={() => handleSortTypeClick('bubble')}
        >
          bubble sort
        </button>
        <button 
          className={`btn merge ${selectedAlgorithm == 'merge' ? 'active' : ''}`}
          onClick={() => handleSortTypeClick('merge')}
        >
          merge sort
        </button>
        
        {/* //study slider for progress through steps */}
      <div className='slider progress'>
        <label>Progress: Step {currentStepIndex + 1} of {steps.length}</label>
        <input
          type='range'
          min='0'
          max={Math.max(0, steps.length - 1)}
          value={currentStepIndex}
          onChange={handleProgressChange}
          disabled={steps.length === 0}
        />
      </div>

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