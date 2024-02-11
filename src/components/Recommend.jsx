import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FacilityType = {
  HOUSE: 'House',
  GYM: 'Gym',
  RESTAURANT: 'Restaurant',
  HOSPITAL: 'Hospital',
};

export default function Recommend() {
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const rows = parseInt(urlParams.get('rows'));
  const cols = parseInt(urlParams.get('cols'));
  const [grid, setGrid] = useState([]);
  const [houseCount, setHouseCount] = useState(1);
  const [recommendedHouse, setRecommendedHouse] = useState('none');

  const [selectedCell, setSelectedCell] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(FacilityType.HOUSE);

  const generateGrid = (rows, cols) => {
    if(!rows || !cols){
        backToHome();
    }
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ row: i, col: j, cellNumber: i * cols + j, facility: '' });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  const handleCellChange = (e) => {
    setSelectedCell(e.target.value);
  };

  const handleFacilityChange = (e) => {
    setSelectedFacility(e.target.value);
  };

  const handleAssignFacility = () => {
    const cell = parseInt(selectedCell);
    if(isNaN(cell) || cell>=rows*cols){
        toast.error('Please enter a valid cell number');
        return;
    }
    setRecommendedHouse('none');
    if (cell >= 0 && cell < rows * cols) {
      const row = Math.floor(cell / cols);
      const col = cell % cols;
      const newGrid = [...grid];
      newGrid[row][col].facility = selectedFacility === FacilityType.HOUSE ? `${selectedFacility} ${houseCount}` : selectedFacility;
      if(selectedFacility === FacilityType.HOUSE)
        setHouseCount(houseCount+1);
      setGrid(newGrid);
      setSelectedCell('');
    }
  };

  const findMinimumScore = (startRow, startCol, facilityType) => {
    const visited = new Set();
    const queue = [{ row: startRow, col: startCol, distance: 0 }];

    while (queue.length > 0) {
      const { row, col, distance } = queue.shift();

      if (visited.has(`${row},${col}`)) continue;
      visited.add(`${row},${col}`);

      const cell = grid[row][col];
      if (cell.facility === facilityType) {
        return distance;
      }

      const neighbors = getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const { row: nRow, col: nCol } = neighbor;
        if (!visited.has(`${nRow},${nCol}`)) {
          queue.push({ row: nRow, col: nCol, distance: distance + 1 });
        }
      }
    }

    return 0;
  };

  const getNeighbors = (row, col) => {
    const neighbors = [];
    if (row > 0) neighbors.push({ row: row - 1, col }); 
    if (row < rows - 1) neighbors.push({ row: row + 1, col });
    if (col > 0) neighbors.push({ row, col: col - 1 });
    if (col < cols - 1) neighbors.push({ row, col: col + 1 });
    return neighbors;
  };

  const recommendHouse = () => {
    let bestHouse = null;
    let minScore = Infinity;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].facility.includes(FacilityType.HOUSE)) {
          const score =
            findMinimumScore(i, j, FacilityType.RESTAURANT) + 
            findMinimumScore(i, j, FacilityType.GYM) +
            findMinimumScore(i, j, FacilityType.HOSPITAL)
          ;
          if (score < minScore) {
            minScore = score;
            bestHouse = grid[i][j];
          }
        }
      }
    }
    if(!bestHouse){
        toast.error('There are no houses present.');
        return;
    }
    toast.success(`Recommended House is ${bestHouse?.facility}`);
    setRecommendedHouse(bestHouse.facility);
  };

  const backToHome = () => {
    navigate('/');
  }

  useEffect(() => {
    generateGrid(rows, cols);
  }, [rows, cols]);

  return (
    <div className="recommend-container">
      <div className='flex gap-100'><h2><u>House Recommender</u></h2>
      </div>
      <div className='flex'><div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`grid-cell ${cell.facility === recommendedHouse ? 'recommended' : ''}`}
              >
                {cell.facility || cell.cellNumber}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="assign-facility">
        <div><input
          type="number"
          className="cell-input"
          placeholder="Cell Number"
          value={selectedCell}
          onChange={handleCellChange}
        />
        <select
          className="facility-select"
          value={selectedFacility}
          onChange={handleFacilityChange}
        >
          <option value={FacilityType.HOUSE}>House</option>
          <option value={FacilityType.GYM}>Gym</option>
          <option value={FacilityType.RESTAURANT}>Restaurant</option>
          <option value={FacilityType.HOSPITAL}>Hospital</option>
        </select>
        <button className="assign-btn" onClick={handleAssignFacility}>Assign Facility</button>
        
      </div>
        <div><button className="recommend-btn" onClick={recommendHouse}>Recommend House</button>
        <button className="new-layout-btn" onClick={backToHome}>New Layout</button>
        </div>
      </div>
      </div>
    </div>
  );
  
}
