import React from 'react';
import data from "./data.json";
import HistoricalDates from "./components";

function App() {
  return (
    <div className="App">
      <HistoricalDates data={data} />
    </div>
  );
}

export default App;
