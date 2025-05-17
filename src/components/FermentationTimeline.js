import React, { useEffect, useRef } from 'react';
import { formatTime } from '../utils/timeUtils';
import './FermentationTimeline.css';

function FermentationTimeline({ estimatedTime, minTime, maxTime, startTime }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Timeline configuration
    const timelineY = canvas.height / 2;
    const timelineStartX = 50;
    const timelineEndX = canvas.width - 50;
    const timelineLength = timelineEndX - timelineStartX;
    
    // Draw the base timeline
    ctx.beginPath();
    ctx.moveTo(timelineStartX, timelineY);
    ctx.lineTo(timelineEndX, timelineY);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Calculate positions
    const maxTimelineHours = Math.ceil(maxTime * 1.2); // Allow some extra space
    const pixelsPerHour = timelineLength / maxTimelineHours;
    
    // Draw time markers
    for (let i = 0; i <= maxTimelineHours; i += 2) {
      const x = timelineStartX + i * pixelsPerHour;
      
      ctx.beginPath();
      ctx.moveTo(x, timelineY - 5);
      ctx.lineTo(x, timelineY + 5);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.fillStyle = '#666';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i}h`, x, timelineY + 20);
    }
    
    // Draw the range (min to max time)
    const minX = timelineStartX + minTime * pixelsPerHour;
    const maxX = timelineStartX + maxTime * pixelsPerHour;
    
    ctx.beginPath();
    ctx.moveTo(minX, timelineY);
    ctx.lineTo(maxX, timelineY);
    ctx.strokeStyle = '#5b9bd5';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Draw the estimated time marker
    const estimatedX = timelineStartX + estimatedTime * pixelsPerHour;
    
    ctx.beginPath();
    ctx.arc(estimatedX, timelineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e3a8a';
    ctx.fill();
    
    // Draw current progress if fermentation has started
    const now = new Date();
    const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
    
    if (hoursElapsed > 0) {
      const progressX = Math.min(
        timelineStartX + hoursElapsed * pixelsPerHour,
        timelineEndX
      );
      
      // Draw progress line
      ctx.beginPath();
      ctx.moveTo(timelineStartX, timelineY);
      ctx.lineTo(progressX, timelineY);
      ctx.strokeStyle = '#38b2ac';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw current time marker
      ctx.beginPath();
      ctx.arc(progressX, timelineY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#38b2ac';
      ctx.fill();
      
      // Add "Now" label
      ctx.fillStyle = '#38b2ac';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Now', progressX, timelineY - 15);
      
      // Add progress percentage
      const progressPercent = Math.min(100, Math.round((hoursElapsed / estimatedTime) * 100));
      ctx.fillStyle = '#38b2ac';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Progress: ${progressPercent}%`, timelineStartX, timelineY - 30);
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Estimated: ${formatTime(estimatedTime)}`, estimatedX, timelineY - 25);
    
  }, [estimatedTime, minTime, maxTime, startTime]);
  
  return (
    <div className="fermentation-timeline">
      <h3>Fermentation Timeline</h3>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={150}
        className="timeline-canvas"
      />
      <div className="timeline-legend">
        <div className="legend-item">
          <span className="estimated-marker"></span>
          <span>Estimated completion time</span>
        </div>
        <div className="legend-item">
          <span className="range-marker"></span>
          <span>Expected time range</span>
        </div>
        <div className="legend-item">
          <span className="progress-marker"></span>
          <span>Current progress</span>
        </div>
      </div>
    </div>
  );
}

export default FermentationTimeline;