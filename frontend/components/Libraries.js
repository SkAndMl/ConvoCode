import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './Libraries.css';

import matplotlib from "../icons/matplotlib.png";
import numpy from "../icons/numpy.png";
import scikitlearn from "../icons/scikitlearn.png";
import tensorflow from "../icons/tensorflow.png";
import pytorch from "../icons/pytorch.png";

function Func() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLibrary, setSelectedLibrary] = useState(null); 

  const handleLibraryClick = (libraryName) => {
    setSelectedLibrary(libraryName); 
    navigate('/chatbot', {
      state: {
        libName: libraryName,
        uid: location.state.uid,
      },
    });
  };

  
  useEffect(() => {
    if (selectedLibrary) { 
      navigate('/chatbot', {
        state: {
          libName: selectedLibrary,
          uid: location.state.uid,
        },
      });
    }
  }, [selectedLibrary]); 

  return (
    <div className="App">
      <div className='library-text'>Choose a library</div>
      <div className="library-container">
        <button onClick={() => handleLibraryClick("matplotlib")}>
          <img src={matplotlib} className="avatar" alt="Avatar1" />
          Matplotlib
        </button>
        <button onClick={() => handleLibraryClick("numpy")}>
          <img src={numpy} className="avatar" alt="Avatar2" />
          Numpy
        </button>
        <button onClick={() => handleLibraryClick("tensorflow")}>
          <img src={tensorflow} className="avatar" alt="Avatar3" />
          Tensorflow
        </button>
        <button onClick={() => handleLibraryClick("pytorch")}>
          <img src={pytorch} className="avatar" alt="Avatar4" />
          Pytorch
        </button>
        <button onClick={() => handleLibraryClick("scikitlearn")}>
          <img src={scikitlearn} className="avatar" alt="Avatar5" />
          Scikitlearn
        </button>
      </div>
    </div>
  );
}

export default Func;
