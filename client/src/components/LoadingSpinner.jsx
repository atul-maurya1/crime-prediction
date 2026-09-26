import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex justify-center items-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
