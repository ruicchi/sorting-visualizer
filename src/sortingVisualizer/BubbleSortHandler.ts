const handleBubbleSortClick = () => {
    //* Generate all steps
    const sortingSteps = generateBubbleSortSteps(array);
    
    //* Store steps in state
    setSteps(sortingSteps);
    
    //* Reset to beginning
    setCurrentStepIndex(0);
    setIsPlaying(false);
    
    console.log("Generated steps:", sortingSteps.length);
  };

export default handleBubbleSortClick;