import React, { useEffect, useState } from "react";
import "./index.css";

function MergeSort() {
  const [array, setArray] = useState([]);
  const [len, setLength] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [animationTimeouts, setAnimationTimeouts] = useState([]);

  function initialiseArray() {
    const newArray = Array.from({ length: len }, () =>
      Math.floor(Math.random() * 300 + 10)
    );
    setArray(newArray);
    setIsSorting(false); // Reset sorting status when resetting array
  }

  useEffect(() => {
    initialiseArray();
  }, [len]);

  function util() {
    if (isSorting) return; // Prevent starting sorting if already in progress
    setIsSorting(true); // Set sorting state to true when sorting starts

    const animations = [];
    const copyArray = [...array];

    // Helper function for merge sort
    const mergeSortHelper = (array, start, end) => {
      if (start >= end) return;
      const mid = Math.floor((start + end) / 2);
      mergeSortHelper(array, start, mid);
      mergeSortHelper(array, mid + 1, end);
      merge(array, start, mid, end);
    };

    // Merge function to combine two halves
    const merge = (array, start, mid, end) => {
      const temp = [];
      let i = start,
        j = mid + 1;

      while (i <= mid && j <= end) {
        if (array[i] <= array[j]) {
          temp.push(array[i++]);
        } else {
          temp.push(array[j++]);
        }
      }

      while (i <= mid) temp.push(array[i++]);
      while (j <= end) temp.push(array[j++]);

      for (let k = start; k <= end; k++) {
        animations.push([k, temp[k - start]]);
        array[k] = temp[k - start];
      }
    };

    mergeSortHelper(copyArray, 0, copyArray.length - 1);

    // Start animation after merge sort completes
    animateSorting(animations);
  }

  // Animation function for visualizing the sorting process
  const animateSorting = (animations) => {
    const timeouts = [];
    for (let i = 0; i < animations.length; i++) {
      const timeout = setTimeout(() => {
        const [barIdx, newHeight] = animations[i];
        const arrayBars = document.getElementsByClassName("array-bar");

        arrayBars[barIdx].style.backgroundColor = "red";
        setTimeout(() => {
          arrayBars[barIdx].style.height = `${newHeight}px`;
          arrayBars[barIdx].style.backgroundColor = "blue";
        }, 100);
      }, i * 200); // Delay each animation step by 200ms
      timeouts.push(timeout);
    }

    // Reset state after all animations are done
    setTimeout(() => {
      setIsSorting(false);
      setAnimationTimeouts([]);
    }, animations.length * 200);

    setAnimationTimeouts(timeouts);
  };

  // Handle reset action
  const handleReset = () => {
    animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    setAnimationTimeouts([]); // Clear previous animations
    initialiseArray(); // Reset the array and sorting state
  };

  return (
    <div>
      <h1>Merge Sort</h1>
      <h4>Time Complexity = O(nlog(n))</h4>
      <div className="array-container">
        <div className="controls-container">
          <select
            name="dropdown"
            id="dropdown"
            onChange={(event) => setLength(parseInt(event.target.value))}
            value={len}
          >
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="60">60</option>
          </select>
          <button onClick={util} disabled={isSorting}>
            Start
          </button>
          <button onClick={handleReset}>Reset Array</button>
        </div>
        <div className="array-bars">
          {array.map((val, idx) => (
            <div
              key={idx}
              className="array-bar"
              style={{ height: `${val}px` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MergeSort;
