import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Define the callback to handle the metrics
const handleVitals = (metric: any) => {
  console.log(metric); // or send it to an analytics endpoint
};

// Register each web vital metric
onCLS(handleVitals);
onFID(handleVitals);
onLCP(handleVitals);
onTTFB(handleVitals);
