import React from 'react';

const SkeletonLine = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
        <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
        <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
      </div>
      <div className="mb-4">
        <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
      </div>
    </div>
  );
};

export default SkeletonLine;
