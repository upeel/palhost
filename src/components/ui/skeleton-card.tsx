import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const SkeletonCard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8">
      <div className="lg:col-span-1 order-last lg:order-first">
        <div style={{height: "200px", maxWidth: "80%", border: "1px solid #656871", borderRadius: "8px", overflow: "hidden"}}>
          <div style={{height: "50px", backgroundColor: "#656871"}}></div>
          <div style={{height: "150px", backgroundColor: "transparent", border: "1px solid #656871", padding: "16px 0"}}>
            <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
            
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
              <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto", marginTop: "16px"}}></div>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
              <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto", marginTop: "16px"}}></div>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkeletonCard;
