import React from 'react';
import { Alert } from 'react-bootstrap';

const ResultDisplay = ({ result }) => {
  if (!result) {
    return (
      <div className="result-container text-center text-muted">
        <p>Enter text and click "Get Prediction" to see results</p>
      </div>
    );
  }

  const { sentiment, score, text, contextInfo } = result;

  // Helper function to format score for display
  const formatScore = (score) => {
    return (score * 10).toFixed(2);
  };

  const getSentimentEmoji = () => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  return (
    <div className="result-container">
      <div className={`sentiment-badge ${sentiment}`}>
        {sentiment.toUpperCase()} {getSentimentEmoji()}
      </div>
      
      <div className="result-score">
        {formatScore(score)}
      </div>
      
      <Alert variant="light" className="mt-3">
        <small className="text-muted">Analyzed text:</small>
        <p className="mb-0">"{text}"</p>
        
        {contextInfo && (
          <div className="mt-2">
            <small className="text-info">Analysis context: {contextInfo}</small>
          </div>
        )}
      </Alert>
    </div>
  );
};

export default ResultDisplay;

