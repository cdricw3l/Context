import React from 'react';

type ErrorMessageProps = {
  error: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return error ? <p style={{ color: 'red' }}>{error}</p> : null;
};

export default ErrorMessage;
