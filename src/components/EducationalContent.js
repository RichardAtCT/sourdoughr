import React, { useState } from 'react';
import './EducationalContent.css';

function EducationalContent() {
  const [activeTab, setActiveTab] = useState('basics');
  
  return (
    <div className="educational-content">
      <h2>Understanding Sourdough Fermentation</h2>
      
      <div className="content-tabs">
        <button 
          className={activeTab === 'basics' ? 'active' : ''}
          onClick={() => setActiveTab('basics')}
          aria-pressed={activeTab === 'basics'}
        >
          Fermentation Basics
        </button>
        <button 
          className={activeTab === 'temperature' ? 'active' : ''}
          onClick={() => setActiveTab('temperature')}
          aria-pressed={activeTab === 'temperature'}
        >
          Temperature Effects
        </button>
        <button 
          className={activeTab === 'starter' ? 'active' : ''}
          onClick={() => setActiveTab('starter')}
          aria-pressed={activeTab === 'starter'}
        >
          Starter Percentage
        </button>
        <button 
          className={activeTab === 'signs' ? 'active' : ''}
          onClick={() => setActiveTab('signs')}
          aria-pressed={activeTab === 'signs'}
        >
          Signs of Fermentation
        </button>
      </div>
      
      <div className="content-panel">
        {activeTab === 'basics' && (
          <div className="tab-content">
            <h3>What is Bulk Fermentation?</h3>
            <p>
              Bulk fermentation is the period after mixing your dough and before dividing and shaping. During this phase, the wild yeasts and bacteria in your sourdough starter begin to ferment the dough, producing carbon dioxide (which creates rise), alcohol, and acids (which develop flavor).
            </p>
            <p>
              This stage is crucial for developing both the flavor and structure of your bread. Proper bulk fermentation should result in a dough that has:
            </p>
            <ul>
              <li>Increased in volume (typically by 50-100%)</li>
              <li>Developed a more cohesive, elastic texture</li>
              <li>Formed bubbles throughout the dough</li>
              <li>Taken on a slightly domed surface</li>
            </ul>
            <p>
              Under-fermentation can result in dense bread with underdeveloped flavor, while over-fermentation can lead to overly acidic bread with a compromised structure.
            </p>
          </div>
        )}
        
        {activeTab === 'temperature' && (
          <div className="tab-content">
            <h3>How Temperature Affects Fermentation</h3>
            <p>
              Temperature is perhaps the most significant factor affecting fermentation rate. The wild yeasts and bacteria in sourdough are most active between 75°F and 82°F (24°C to 28°C).
            </p>
            <p>
              Temperature effects follow a non-linear pattern:
            </p>
            <ul>
              <li><strong>Below 65°F (18°C):</strong> Fermentation slows dramatically, with lactobacilli activity decreasing more than yeast activity, resulting in milder flavored bread</li>
              <li><strong>65°F to 75°F (18°C to 24°C):</strong> Moderate fermentation rate with balanced bacterial and yeast activity</li>
              <li><strong>75°F to 82°F (24°C to 28°C):</strong> Optimal temperature range for fermentation speed</li>
              <li><strong>Above 82°F (28°C):</strong> Bacterial activity increases relative to yeast, potentially producing more sour flavors, but may risk over-fermentation</li>
            </ul>
            <p>
              Our calculator uses empirical data to provide accurate estimates based on actual measured fermentation rates across different temperatures.
            </p>
          </div>
        )}
        
        {activeTab === 'starter' && (
          <div className="tab-content">
            <h3>Understanding Starter Percentage</h3>
            <p>
              Starter percentage refers to the amount of sourdough starter relative to the total flour weight in your recipe. For example, if your recipe uses 1000g of flour and 200g of starter, your starter percentage is 20%.
            </p>
            <p>
              Higher starter percentages generally lead to faster fermentation because you're introducing more active wild yeasts and bacteria into your dough. However, the relationship is not strictly linear:
            </p>
            <ul>
              <li><strong>5% starter:</strong> Very slow fermentation, good for long cold ferments</li>
              <li><strong>10% starter:</strong> Moderate fermentation rate, often used for overnight room temperature fermentation</li>
              <li><strong>15-20% starter:</strong> Standard range for most recipes, providing balanced fermentation within a reasonable timeframe</li>
              <li><strong>25-30%+ starter:</strong> Rapid fermentation, useful when time is limited</li>
            </ul>
            <p>
              The calculator takes into account the significant impact starter percentage has on fermentation times, based on controlled testing data.
            </p>
          </div>
        )}
        
        {activeTab === 'signs' && (
          <div className="tab-content">
            <h3>Signs of Proper Fermentation</h3>
            <p>
              While time estimates are helpful, it's important to also observe your dough for physical signs of proper fermentation:
            </p>
            <h4>Visual Indicators</h4>
            <ul>
              <li><strong>Volume increase:</strong> Dough should increase 50-100% in size</li>
              <li><strong>Bubbles:</strong> Surface should show small to medium bubbles</li>
              <li><strong>Dome shape:</strong> Surface should become slightly domed</li>
              <li><strong>Edge pull:</strong> Dough may start to pull away from container edges slightly</li>
            </ul>
            <h4>Tactile Indicators</h4>
            <ul>
              <li><strong>Texture change:</strong> Dough becomes more elastic and cohesive</li>
              <li><strong>Lightness:</strong> Dough feels lighter and airier</li>
              <li><strong>Jiggle test:</strong> When container is gently shaken, dough should jiggle like jello</li>
            </ul>
            <p>
              When your dough exhibits these signs and has fermented for approximately the calculated time, it's likely ready for dividing and shaping.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EducationalContent;