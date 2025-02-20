import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

// Define a function to handle the performance data
const handleVitals = (metric: any) => {
  console.log(metric);
};

// Register the handlers
onCLS(handleVitals);
onFID(handleVitals);
onLCP(handleVitals);
onTTFB(handleVitals);
