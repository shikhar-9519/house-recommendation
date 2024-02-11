import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const [dimension, setDimensions] = useState({
        rows: 0,
        cols:0
    })
    const navigate = useNavigate();
    const moveToGrid = () => {
        const { rows, cols } = dimension;
        if (rows == 0 || cols == 0) {
            toast.error('Rows and columns must be greater than zero!');
            return;
        }
        navigate(`/recommend?rows=${rows}&cols=${cols}`);
    }
  return (
    <div className='container'><div className='entry-form'>
      Enter Dimensions of Layout
      <div className='home-btn'>Number of Rows:    <input type='number' className="cell-input" name='rows' onChange={(e)=>{
        setDimensions({...dimension, rows: e.target.value})
      }}/></div>
      <div className='home-btn'>Number of Columns: <input type='number' className="cell-input" name='cols' onChange={(e)=>{
        setDimensions({...dimension, cols: e.target.value})
      }}/></div>
      <button onClick={moveToGrid} className='new-layout-btn'>Proceed</button>
    </div>
    
    </div>
  )
}
