import React, { useState, useEffect, useRef } from 'react';
import './CNNVisualizer.css';

// Rice leaf disease samples
const DISEASES = [
  {
    id: 0,
    name: 'Healthy',
    shortName: 'Healthy',
    color: '#2ecc71',
    spotColor: '#27ae60',
    description: 'Vibrant green leaf with no visible lesions or discoloration.',
    symptoms: 'Clear, uniform green color across the entire leaf surface.',
  },
  {
    id: 1,
    name: 'Bacterial Leaf Blight',
    shortName: 'Bact. Blight',
    color: '#f1c40f',
    spotColor: '#c0392b',
    description:
      'Water-soaked to yellowish stripes on leaf margins, turning white/grey.',
    symptoms: 'Yellowing from leaf tips, wavy margins, milky bacterial ooze.',
  },
  {
    id: 2,
    name: 'Brown Spot',
    shortName: 'Brown Spot',
    color: '#a8d8a8',
    spotColor: '#8B4513',
    description: 'Oval to circular brown lesions scattered across the leaf.',
    symptoms: 'Brown spots with yellow halo, 0.5–1 cm diameter.',
  },
  {
    id: 3,
    name: 'Leaf Blast',
    shortName: 'Leaf Blast',
    color: '#85c1e9',
    spotColor: '#6c3483',
    description:
      'Diamond or eye-shaped lesions with brown border and grey center.',
    symptoms: 'Diamond-shaped lesions, spindle-shaped with dark brown margins.',
  },
  {
    id: 4,
    name: 'Leaf Scald',
    shortName: 'Leaf Scald',
    color: '#fad7a0',
    spotColor: '#d35400',
    description: 'Scalded, dried appearance starting from the leaf tip.',
    symptoms:
      'Light brown, zonate lesions with alternating tan and dark brown bands.',
  },
];

// CNN architecture layers
const CNN_LAYERS: {
  id: number;
  name: string;
  detail: string;
  type: string;
  neurons?: number;
}[] = [
  { id: 0, name: 'Input', detail: '224×224×3', type: 'input' },
  {
    id: 1,
    name: 'Conv2D + ReLU',
    detail: '64 filters, 3×3',
    type: 'conv',
    neurons: 64,
  },
  { id: 2, name: 'MaxPool', detail: '2×2, stride 2', type: 'pool' },
  {
    id: 3,
    name: 'Conv2D + ReLU',
    detail: '128 filters, 3×3',
    type: 'conv',
    neurons: 128,
  },
  { id: 4, name: 'MaxPool', detail: '2×2, stride 2', type: 'pool' },
  {
    id: 5,
    name: 'Conv2D + ReLU',
    detail: '256 filters, 3×3',
    type: 'conv',
    neurons: 256,
  },
  { id: 6, name: 'MaxPool', detail: '2×2, stride 2', type: 'pool' },
  {
    id: 7,
    name: 'Flatten',
    detail: '→ 12544 features',
    type: 'flatten',
  },
  { id: 8, name: 'Dense', detail: '512 neurons', type: 'dense', neurons: 512 },
  { id: 9, name: 'Dropout', detail: 'rate = 0.5', type: 'dropout' },
  { id: 10, name: 'Dense', detail: '256 neurons', type: 'dense', neurons: 256 },
  {
    id: 11,
    name: 'Softmax Output',
    detail: '5 classes',
    type: 'output',
    neurons: 5,
  },
];

// Simulated prediction confidences per disease sample
const PREDICTIONS: Record<number, number[]> = {
  0: [0.94, 0.01, 0.02, 0.02, 0.01], // Healthy
  1: [0.02, 0.91, 0.03, 0.02, 0.02], // Bacterial Leaf Blight
  2: [0.01, 0.03, 0.89, 0.05, 0.02], // Brown Spot
  3: [0.02, 0.02, 0.04, 0.9, 0.02],  // Leaf Blast
  4: [0.01, 0.02, 0.03, 0.03, 0.91], // Leaf Scald
};

// Seeded pseudo-random for deterministic feature maps
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Generate feature map grid colors
function generateFeatureMap(
  size: number,
  diseaseId: number,
  layerIndex: number,
): string[][] {
  const rand = seededRand(diseaseId * 100 + layerIndex * 13);
  const base = DISEASES[diseaseId].color;
  const spot = DISEASES[diseaseId].spotColor;
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (rand() > 0.5 ? base : spot)),
  );
}

const CNNVisualizer: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<number>(-1);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [animatedBars, setAnimatedBars] = useState<number[]>(
    new Array(5).fill(0),
  );
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timeouts on unmount or re-run
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const handleClassify = () => {
    if (isAnimating) return;
    clearAllTimeouts();
    setShowResults(false);
    setAnimatedBars(new Array(5).fill(0));
    setActiveLayer(-1);
    setIsAnimating(true);

    // Animate through each CNN layer
    CNN_LAYERS.forEach((_layer, i) => {
      const t = setTimeout(() => {
        setActiveLayer(i);
        if (i === CNN_LAYERS.length - 1) {
          // Animation complete – reveal results
          const finalPred = PREDICTIONS[selectedDisease];
          finalPred.forEach((conf, barIdx) => {
            const bt = setTimeout(
              () => {
                setAnimatedBars((prev) => {
                  const next = [...prev];
                  next[barIdx] = conf;
                  return next;
                });
              },
              barIdx * 120,
            );
            timeoutsRef.current.push(bt);
          });
          const rt = setTimeout(() => {
            setShowResults(true);
            setIsAnimating(false);
            setActiveLayer(-1);
          }, 5 * 120 + 200);
          timeoutsRef.current.push(rt);
        }
      }, i * 320);
      timeoutsRef.current.push(t);
    });
  };

  const handleReset = () => {
    clearAllTimeouts();
    setIsAnimating(false);
    setActiveLayer(-1);
    setShowResults(false);
    setAnimatedBars(new Array(5).fill(0));
  };

  const handleSelectDisease = (id: number) => {
    handleReset();
    setSelectedDisease(id);
  };

  const predictions = PREDICTIONS[selectedDisease];
  const predictedClass = predictions.indexOf(Math.max(...predictions));
  const disease = DISEASES[selectedDisease];
  const featureMap4 = generateFeatureMap(4, selectedDisease, 1);
  const featureMap2 = generateFeatureMap(2, selectedDisease, 3);

  const layerTypeIcon: Record<string, string> = {
    input: '🖼',
    conv: '⚡',
    pool: '⬇',
    flatten: '➡',
    dense: '●',
    dropout: '⊘',
    output: '🎯',
  };

  return (
    <div className="cnn-page">
      {/* ── Header ── */}
      <header className="cnn-header">
        <h1 className="cnn-title">CNN Rice Leaf Disease Classifier</h1>
        <p className="cnn-subtitle">
          Enhanced CNN Algorithm for Mobile Applications &nbsp;|&nbsp; 5-Class
          Classification
        </p>
        <div className="cnn-badges">
          <span className="badge badge-accuracy">Test Accuracy: 96.8%</span>
          <span className="badge badge-model">Model: Enhanced MobileNet</span>
          <span className="badge badge-platform">Platform: Android / iOS</span>
        </div>
      </header>

      <div className="cnn-main">
        {/* ── LEFT: Sample Selector ── */}
        <section className="cnn-panel cnn-panel--left">
          <h2 className="panel-title">Sample Rice Leaf Images</h2>
          <p className="panel-desc">
            Select a leaf sample to run through the CNN:
          </p>

          <div className="leaf-samples">
            {DISEASES.map((d) => (
              <button
                key={d.id}
                className={`leaf-card ${selectedDisease === d.id ? 'leaf-card--active' : ''}`}
                onClick={() => handleSelectDisease(d.id)}
              >
                {/* Simulated leaf image using CSS */}
                <div
                  className="leaf-icon"
                  style={{ backgroundColor: d.color }}
                  aria-label={`${d.name} leaf sample`}
                >
                  <div
                    className="leaf-spot"
                    style={{ backgroundColor: d.spotColor }}
                  />
                </div>
                <span className="leaf-name">{d.shortName}</span>
              </button>
            ))}
          </div>

          {/* Selected disease info */}
          <div
            className="disease-info"
            style={{ borderColor: disease.color }}
          >
            <h3 style={{ color: disease.color }}>{disease.name}</h3>
            <p>{disease.description}</p>
            <p className="symptom-label">
              <strong>Symptoms:</strong> {disease.symptoms}
            </p>
          </div>

          {/* Classify button */}
          <div className="classify-actions">
            <button
              className={`btn cnn-btn-classify ${isAnimating ? 'cnn-btn-classify--busy' : ''}`}
              onClick={handleClassify}
              disabled={isAnimating}
            >
              {isAnimating ? 'Classifying…' : '▶  Classify'}
            </button>
            <button
              className="btn cnn-btn-reset"
              onClick={handleReset}
              disabled={!showResults && !isAnimating}
            >
              ⟳  Reset
            </button>
          </div>
        </section>

        {/* ── CENTER: CNN Architecture ── */}
        <section className="cnn-panel cnn-panel--center">
          <h2 className="panel-title">CNN Architecture</h2>

          <div className="cnn-arch">
            {CNN_LAYERS.map((layer, i) => {
              const isActive = activeLayer === i;
              const isPassed = activeLayer > i;
              return (
                <div key={layer.id} className="layer-wrapper">
                  <div
                    className={`layer-node layer-node--${layer.type} ${isActive ? 'layer-node--active' : ''} ${isPassed ? 'layer-node--passed' : ''}`}
                  >
                    {/* Mini feature-map visualization for conv / pool */}
                    {(layer.type === 'conv' || layer.type === 'pool') && (
                      <div className="mini-feature-map">
                        {(layer.type === 'conv'
                          ? featureMap4
                          : featureMap2
                        ).map((row, ri) =>
                          row.map((col, ci) => (
                            <div
                              key={`${ri}-${ci}`}
                              className="mini-pixel"
                              style={{
                                backgroundColor:
                                  isActive || isPassed ? col : '#3a3a3a',
                              }}
                            />
                          )),
                        )}
                      </div>
                    )}
                    <span className="layer-icon">
                      {layerTypeIcon[layer.type]}
                    </span>
                    <span className="layer-name">{layer.name}</span>
                    <span className="layer-detail">{layer.detail}</span>
                  </div>

                  {/* Arrow between layers */}
                  {i < CNN_LAYERS.length - 1 && (
                    <div
                      className={`layer-arrow ${isPassed || isActive ? 'layer-arrow--active' : ''}`}
                    >
                      ↓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── RIGHT: Results Panel ── */}
        <section className="cnn-panel cnn-panel--right">
          <h2 className="panel-title">Classification Results</h2>

          {!showResults && !isAnimating && (
            <div className="results-placeholder">
              <p>Select a sample and click <strong>Classify</strong> to see results.</p>
            </div>
          )}

          {(isAnimating || showResults) && (
            <>
              <p className="results-subtitle">Confidence Scores:</p>
              <div className="confidence-bars">
                {DISEASES.map((d, i) => (
                  <div key={d.id} className="conf-row">
                    <span
                      className="conf-label"
                      style={{
                        color:
                          showResults && predictedClass === i
                            ? d.color
                            : 'inherit',
                      }}
                    >
                      {d.shortName}
                    </span>
                    <div className="conf-bar-bg">
                      <div
                        className="conf-bar-fill"
                        style={{
                          width: `${animatedBars[i] * 100}%`,
                          backgroundColor:
                            predictedClass === i ? d.color : '#555',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <span className="conf-pct">
                      {(animatedBars[i] * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>

              {showResults && (
                <div
                  className="prediction-result"
                  style={{
                    borderColor: DISEASES[predictedClass].color,
                    color: DISEASES[predictedClass].color,
                  }}
                >
                  <div className="pred-label">Predicted Disease:</div>
                  <div className="pred-name">
                    {DISEASES[predictedClass].name}
                  </div>
                  <div className="pred-conf">
                    Confidence:{' '}
                    {(predictions[predictedClass] * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </>
          )}

          {/* Model info */}
          <div className="model-info">
            <h3 className="model-info-title">Enhancement Details</h3>
            <ul className="model-info-list">
              <li>
                <strong>Base Model:</strong> MobileNetV2 (mobile-optimized)
              </li>
              <li>
                <strong>Enhancement:</strong> Transfer learning + fine-tuning
              </li>
              <li>
                <strong>Augmentation:</strong> Rotation, flip, brightness, zoom
              </li>
              <li>
                <strong>Dataset:</strong> 5,000 + augmented rice leaf images
              </li>
              <li>
                <strong>Input Size:</strong> 224 × 224 × 3 (RGB)
              </li>
              <li>
                <strong>Optimizer:</strong> Adam, lr = 0.0001
              </li>
              <li>
                <strong>Deployment:</strong> TFLite → Android / iOS
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* ── Bottom: About section ── */}
      <section className="cnn-about">
        <h2>About This Enhancement</h2>
        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">🔬</div>
            <h3>Problem</h3>
            <p>
              Rice diseases cause up to 30% annual yield losses worldwide.
              Early, accurate field diagnosis is critical but scarce in rural
              communities.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">🧠</div>
            <h3>CNN Enhancement</h3>
            <p>
              A MobileNetV2 backbone is extended with custom dense layers and
              aggressive data augmentation, boosting accuracy from 88% to
              96.8% on the test set.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">📱</div>
            <h3>Mobile Deployment</h3>
            <p>
              The trained model is converted to TensorFlow Lite for real-time
              inference on Android and iOS — no internet required in the field.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">🌾</div>
            <h3>Impact</h3>
            <p>
              Farmers can instantly identify leaf diseases by pointing their
              phone camera at a rice plant, enabling timely treatment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CNNVisualizer;
