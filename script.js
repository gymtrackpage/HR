document.getElementById('addWorkout').addEventListener('click', addWorkoutInput);

function addWorkoutInput() {
  const workoutInputsDiv = document.getElementById('workoutInputs');
  const newWorkoutDiv = document.createElement('div');
  newWorkoutDiv.classList.add("workout-input");
  newWorkoutDiv.innerHTML = `
    <select class="distance">
      <option value="5000">5Km</option>
      <option value="10000">10Km</option>
      <option value="21097.5">Half Marathon</option>
      <option value="42195">Marathon</option>
    </select>
    <input type="text" class="time" placeholder="hh:mm:ss">
    <input type="number" class="avgHr" placeholder="Avg HR">
  `;
  workoutInputsDiv.appendChild(newWorkoutDiv);
}

function calculateHeartRateZones() {
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const rhr = parseInt(document.getElementById('rhr').value);

  // Calculate Maximum Heart Rate (MHR) 
  const mhr = gender === 'female' ? (206 - (0.88 * age)) : (220 - age); // Corrected formula
  const hrr = mhr - rhr;
  
  // Get workout data
  const workouts = [];
  const workoutInputs = document.querySelectorAll('.workout-input');
  for (let i = 0; i < workoutInputs.length; i++) {
    const distanceSelect = workoutInputs[i].querySelector('.distance');
    const timeInput = workoutInputs[i].querySelector('.time');
    const avgHrInput = workoutInputs[i].querySelector('.avgHr');
    
    const distance = parseFloat(distanceSelect.value);
    const timeParts = timeInput.value.split(':');
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    const avgHr = parseInt(avgHrInput.value);

    workouts.push({ distance, timeInSeconds, avgHr });
  }

  const expectedZonesByDistance = {
    '5000': { // 5K
      'Zone 4': 0.8,
      'Zone 5': 0.2
    },
    '10000': { // 10K
      'Zone 3': 0.1, 
      'Zone 4': 0.8,
      'Zone 5': 0.1 
    },
    '21097.5': { // Half Marathon
      'Zone 2': 0.1,
      'Zone 3': 0.8,
      'Zone 4': 0.1
    },
    '42195': { // Marathon
      'Zone 2': 0.85,
      'Zone 3': 0.15
    }
  };

  const zoneAdjustments = {
    'Zone 1': 0, 'Zone 2': 0, 'Zone 3': 0, 'Zone 4': 0, 'Zone 5': 0
  };

  // Analyze workouts and adjust zones
  workouts.forEach(workout => {
    const expectedDistribution = expectedZonesByDistance[workout.distance];
    for (const zone in expectedDistribution) {
      const expectedLowHr = Math.round(hrr * (parseInt(zone.slice(-1)) * 10 + 40) / 100 + rhr);
      const expectedHighHr = Math.round(hrr * (parseInt(zone.slice(-1)) * 10 + 50) / 100 + rhr);

      if (workout.avgHr >= expectedLowHr && workout.avgHr <= expectedHighHr) {
        const adjustment = workout.avgHr - ((expectedLowHr + expectedHighHr) / 2);
        zoneAdjustments[zone] += adjustment * expectedDistribution[zone]; // Weighted adjustment
      }
    }
  });

  // Average the adjustments if there are multiple workouts
  Object.keys(zoneAdjustments).forEach(zone => {
    zoneAdjustments[zone] /= workouts.length || 1; // Avoid division by zero
  });

  // Calculate and display adjusted heart rate zones
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; 
  for (let i = 1; i <= 5; i++) {
    const zone = `Zone ${i}`;
    const zonePercentage = i * 10 + 50;
    const zoneLow = Math.round(hrr * zonePercentage -10 / 100 + rhr + zoneAdjustments[zone]);
    const zoneHigh = Math.round(hrr * zonePercentage / 100 + rhr + zoneAdjustments[zone]);
    resultsDiv.innerHTML += `<p>${zone}: ${zoneLow}-${zoneHigh} bpm</p>`;
  }
}


// Initial workout input on page load
addWorkoutInput();
