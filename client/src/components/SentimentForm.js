import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

const SentimentForm = ({ onSubmit, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Enter text to analyze</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here (e.g., This product is amazing!)"
          required
        />
        <Form.Text className="text-muted">
          We'll analyze the prediction of your text as positive, negative, or neutral.
        </Form.Text>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        disabled={loading || !text.trim()}
        className="w-100"
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Analyzing...
          </>
        ) : (
          'Get Prediction'
        )}
      </Button>
    </Form>
  );
};

export default SentimentForm;