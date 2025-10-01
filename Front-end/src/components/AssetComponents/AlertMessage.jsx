
import { Button } from "react-bootstrap";
import { useEffect } from "react";

export default function AlertMessage({ message, AccoutState }) {

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3">
      <div className="bg-white rounded-4 shadow-lg p-4 text-center position-relative" style={{ maxWidth: "500px", width: "90%" }}>
        
        {/* Green circle with tick */}
        <div className="d-flex justify-content-center mb-3">
          {message.state?<div 
            className="bg-success rounded-circle d-flex align-items-center justify-content-center shadow" 
            style={{ width: "60px", height: "60px" }}
          >
            <span className="text-white fs-3 fw-bold">✓</span>
          </div>:<div 
            className="bg-danger rounded-circle d-flex align-items-center justify-content-center shadow" 
            style={{ width: "60px", height: "60px" }}
          >
            <span className="text-white fs-3 fw-bold">✕</span>
          </div>}
        </div>

        {/* Message */}
        <h4 className="text-dark mb-3">{message.message}</h4>

        {/* Buttons */}
        {/* <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" onClick={() => AccoutState("")}>OK</Button>
          <Button variant="secondary" onClick={() => AccoutState("")}>Cancel</Button>
        </div> */}
      </div>
    </div>
  );
}
