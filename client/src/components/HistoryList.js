// client/src/components/HistoryList.js
import React from 'react';
import { ListGroup, Badge, Button } from 'react-bootstrap';

const HistoryList = ({ history, onDelete }) => {
  if (!history || history.length === 0) {
    return <p className="text-center text-muted">No previous analyses found</p>;
  }

  // Format the timestamp
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get badge variant based on sentiment
  const getBadgeVariant = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <ListGroup variant="flush">
      {history.map((item) => (
        <ListGroup.Item 
          key={item._id} 
          className="d-flex justify-content-between align-items-start history-item"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              {item.text.length > 50 ? `${item.text.substring(0, 50)}...` : item.text}
            </div>
            <small className="text-muted">{formatDate(item.createdAt)}</small>
          </div>
          <div className="d-flex align-items-center">
            <Badge
              pill
              bg={getBadgeVariant(item.sentiment)}
              className="me-2"
            >
              {item.sentiment}
            </Badge>
            {/* <span className="me-3">Score: {(item.score * 10).toFixed(2)}</span> */}
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDelete(item._id)}
            >
              &times;
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default HistoryList;