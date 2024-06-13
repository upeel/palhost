import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";

const SkeletonElement = ({ rows = 3, columns = 3 }) => {
  // Function to generate skeleton rows
  const generateRows = () => {
    const skeletonRows = [];
    for (let i = 0; i < rows; i++) {
      skeletonRows.push(
        <TableRow key={i}>
          {Array.from({ length: columns }, (_, index) => (
            <TableCell key={index} className='td-loading'>
              <div className='skeleton-loading'></div>
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return skeletonRows;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8">
      <div className="lg:col-span-1 order-last lg:order-first">
        <div style={{height: "200px", maxWidth: "80%", border: "1px solid #656871", borderRadius: "8px", overflow: "hidden"}}>
          <div style={{height: "50px", backgroundColor: "#656871"}}></div>
          <div style={{height: "150px", backgroundColor: "transparent", border: "1px solid #656871", padding: "16px 0"}}>
            <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto"}}></div>
            <div className='skeleton-loading' style={{marginLeft: "auto", marginRight: "auto", marginTop: "16px"}}></div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }, (_, index) => (
                <TableHead key={index} className='td-loading'>
                  <div className='skeleton-loading'></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {generateRows()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SkeletonElement;
