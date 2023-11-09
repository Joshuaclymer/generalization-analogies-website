import React, { useState } from 'react';

var categories = [
    'Difficulty',
    'Encoding',
    'Pretraining Similarity',
    'Skill', 
    'Context',  
    'Quality',  
    'Unwanted Personas',  
    'Spurious Cues',  
]
var colors = [
    '#267CB5',  
    '#CA4032',  
    '#1E894B',  
    '#936919',  
    '#7F4697',  
    '#C97226',  
    '#17816C',  
    '#647273',  
    '#A33090',  
    '#267CB5',  
    '#CA4032',  
]

var brighter_colors = [
    '#EAF4FF',  
    '#FFF2E2',  
    '#ECFFF4',  
    '#FFFBE9',  
    '#F9ECFF',  
    '#FFEFE0',  
    '#EBFFFB',  
    '#F6FEFF',  
    '#FFEAFC',  
    '#267CB5',  
    '#FFF2E2',  
]
const fontSize = 18
var colorMap = {}
for (var i = 0; i < categories.length; i++) {
   colorMap[categories[i]] = [colors[i], brighter_colors[i]]
}
const Word = ({text, samples, color, left}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  var random_sample = samples[Math.floor(Math.random() * samples.length)];
  var fontWeight = showTooltip ? "bold" : 500;
  const goodResponse = Object.keys(random_sample.responses).filter(r => random_sample.responses[r] == 1)[0];
  const worseResponse = Object.keys(random_sample.responses).filter(r => random_sample.responses[r] == 0)[0];
  return (
  <div style={{position: 'relative'}}>
    <span 
      style={{ color: color, fontSize: fontSize, fontWeight: fontWeight}}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {text}
    </span>
    {showTooltip && (
      <div style={{ position: 'absolute', right: left ? '0px': null, bottom: '100%', width: '40vw', backgroundColor: '#fff', border: '1px solid #ddd', padding: '10px', fontSize: '13px', lineHeight: '20px'}}>
        <span style={{fontWeight: "bold"}}>Prompt:</span> {<br />}
        {random_sample.prompt.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {<br />}
          </React.Fragment>
        ))}
        <span style={{fontWeight: "bold"}}>Good Response:</span> {<br />}
        {goodResponse.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {<br />}
          </React.Fragment>
        ))}{<br />}
        <span style={{fontWeight: "bold"}}>Worse Response:</span> {<br />}
        {worseResponse.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {<br />}
          </React.Fragment>
        ))}
      </div>
    )}
  </div>
  );
}

const WordPair = ({ item, colors, left}) => {
  return (
    <div style={{ backgroundColor: colors[1], padding: "10px", display: "flex", justifyContent: "center", borderRadius: 5, margin: '5px', maxWidth: '100%'}}>
      <Word text={item.distributions[0]} samples={item.source_samples} color={colors[0]} left={left}/>
      <span style={{ color: colors[0], fontSize: fontSize}}> → </span>
      <Word text={item.distributions[1]} samples={item.target_samples} color={colors[0]} left={left}/>
    </div>
  );
};

// const WordPair = ({ distribution, colors }) => (
//   <div style={{ backgroundColor: colors[1]}}>
//     <span style={{ color: colors[0]}}>
//       {distribution[0]}
//     </span>
//     <span style={{ color: colors[0]}}> → </span>
//     <span style={{ color: colors[0]}}>
//       {distribution[1]}
//     </span>
//   </div>
// );

const DataGrid = ({ data}) => {
  return (
    <div style={{display:"grid", gridTemplateColumns: "repeat(3, minmax(33%, 1fr))", gap: "5px", width:"100%"}}>
    {/* <div style={{display:"flex", flexDirection:"column", width:"100%"}}> */}
    {data.map((item, index) => {
      const colors = colorMap[item.category];
      const left = (index % 3 == 2);
      return (
        <WordPair key={index} item={item} colors={colors} left={left}/>
      );
    })}
    </div>
  );
};

const groupByCategory = (data) => {
  return data.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

export default DataGrid;

