# SourdoughR - Bulk Fermentation Calculator

A scientifically-backed web application for accurately calculating sourdough bulk fermentation times based on dough temperature and starter percentage.

**Live Demo**: [https://RichardAtCT.github.io/sourdoughr](https://RichardAtCT.github.io/sourdoughr)

![Sourdough Bulk Fermentation Calculator](https://i.imgur.com/example.jpg) <!-- Replace with actual screenshot when available -->

## 🥖 About

SourdoughR helps bakers achieve consistent results by providing accurate estimates of bulk fermentation times based on the key variables that affect fermentation rates. The calculator uses empirical data from extensive testing to provide reliable predictions across various baking conditions.

## ✨ Features

- **Temperature Input**: Enter dough temperature with F°/C° conversion
- **Starter Percentage Input**: Adjust starter percentage with presets (5%-30%)
- **Rise Target Options**: Choose between 75% or 100% (double) rise
- **Visual Timeline**: Interactive visualization of fermentation progress
- **Smart Predictions**: Uses bilinear interpolation for accurate estimates
- **Completion Time**: Calculate when your fermentation will finish
- **Advanced Options**: 
  - Adjust for flour composition (whole wheat, rye)
  - Factor in salt percentage
  - Account for flour protein content
- **Educational Content**: Learn about fermentation science and indicators
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Technology Stack

- **Frontend**: React, JavaScript (ES6+)
- **UI Design**: CSS3 with custom styling
- **Visualizations**: HTML5 Canvas
- **Deployment**: GitHub Pages
- **Package Management**: npm
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm (v6+ recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RichardAtCT/sourdoughr.git
   cd sourdoughr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Source & Methodology

All fermentation calculations are based on empirical data from [The Sourdough Journey](https://thesourdoughjourney.com), who conducted extensive testing with controlled variables:

- **Test Recipe**: 90% King Arthur Bread Flour, 10% King Arthur Whole Wheat Flour, 2% Salt
- **Starter Variables**: 5%, 10%, 15%, and 20% of total flour weight
- **Temperature Range**: Tested at 66°F, 68°F, 70°F, 72°F, and 74°F
- **Fermentation Markers**: Times recorded for both 75% and 100% rise

The calculator uses bilinear interpolation to provide accurate estimates for values between the tested data points, with appropriate confidence intervals.

## 🔄 Development Workflow

- **Making Changes**: Edit files in the `src` directory
- **Testing Locally**: Run `npm start` to preview changes
- **Building**: Run `npm run build` for production build
- **Deployment**: Run `npm run deploy` to update the GitHub Pages site

## 📱 Usage Examples

SourdoughR can help with various sourdough baking scenarios:

- **Standard Room Temperature**: Determine fermentation time at typical kitchen temperatures
- **Cold Fermentation**: Estimate longer fermentation times for refrigerated doughs
- **High Inoculation**: Calculate faster fermentation times when using higher starter percentages
- **Different Flour Types**: Adjust for whole grain flours that typically ferment faster

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Data provided by The Sourdough Journey
- Inspired by the sourdough baking community
- Built with the help of Claude AI

---

Made with ❤️ for sourdough bakers everywhere