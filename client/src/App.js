// client/src/App.js - Updated API handling
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SentimentForm from './components/SentimentForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

// Define the API URL based on environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState({ status: 'checking', message: 'Checking API connection...' });

  // Check API connection on mount
  useEffect(() => {
    checkApiConnection();
    fetchHistory();
  }, []);

  // Check if API is reachable
  const checkApiConnection = async () => {
    try {
      await axios.get(`${API_URL.replace('/api', '')}/`);
      setApiStatus({ status: 'connected', message: 'Connected to API server' });
    } catch (err) {
      console.error('API connection error:', err);
      setApiStatus({ 
        status: 'error', 
        message: `Cannot connect to API server. Please make sure the server is running at ${API_URL}`
      });
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = async (text) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/analyze`, { text });
      setResult(response.data);
      
      // Update history after successful analysis
      fetchHistory();
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Failed to analyze text. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`${API_URL}/history/${id}`);
      // Update history after deletion
      fetchHistory();
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Failed to delete record');
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Prediction App</h1>
      
      {apiStatus.status === 'error' && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>API Connection Error</Alert.Heading>
          <p>{apiStatus.message}</p>
          <hr />
          <p className="mb-0">
            Please make sure the Node.js server is running on port 5000.
            <button 
              className="btn btn-sm btn-outline-danger ms-2" 
              onClick={checkApiConnection}
            >
              Retry Connection
            </button>
          </p>
        </Alert>
      )}
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Prediction Text</Card.Title>
              <SentimentForm onSubmit={analyzeSentiment} loading={loading} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Result</Card.Title>
              <ResultDisplay result={result} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>
                Analysis History
                <button 
                  className="btn btn-sm btn-outline-primary float-end" 
                  onClick={fetchHistory}
                  disabled={loading}
                >
                  Refresh
                </button>
              </Card.Title>
              {loading && !result ? (
                <p className="text-center my-4">Loading history...</p>
              ) : (
                <HistoryList history={history} onDelete={deleteRecord} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;