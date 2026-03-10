import React, { useState } from 'react';
import SortingVisualizerLogic from './sortingVisualizer/SortingVisualizer';
import CNNVisualizer from './cnnVisualizer/CNNVisualizer';
import './App.css';

type ActiveTab = 'sorting' | 'cnn';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sorting');

  return (
    <div className="App">
      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'sorting' ? 'nav-tab--active' : ''}`}
          onClick={() => setActiveTab('sorting')}
        >
          Sorting Visualizer
        </button>
        <button
          className={`nav-tab ${activeTab === 'cnn' ? 'nav-tab--active' : ''}`}
          onClick={() => setActiveTab('cnn')}
        >
          🌾 CNN Disease Classifier
        </button>
      </nav>

      {activeTab === 'sorting' ? <SortingVisualizerLogic /> : <CNNVisualizer />}
    </div>
  );
}

export default App;
