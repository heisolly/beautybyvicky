import React, { Suspense } from 'react';
import Loading from '../components/Loading';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({ 
  children, 
  fallback = <Loading text="Loading page..." /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoad;
