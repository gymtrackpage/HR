document.getElementById('addWorkout').addEventListener('click', addWorkoutInput);

function addWorkoutInput() {
  const workoutInputsDiv = document.getElementById('workoutInputs');
  const newWorkoutDiv = document.createElement('div');
  newWorkoutDiv.classList.add("workout-input");
  newWorkoutDiv.innerHTML = `
    <select class="distance">
      <option value="5000">5K</option>
      <option value="10000">10K</option>
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
  const mhr = gender === 'female' ? (206 - (0.88 * age)) : (220 - age);
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

  // Analyze workouts to adjust zones (if needed) - Implement this logic later

  // Calculate and display heart rate zones
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results
  for (let i = 1; i <= 5; i++) {
    const zonePercentage = i * 10 + 50;
    const zoneLow = Math.round(hrr * zonePercentage / 100 + rhr);
    const zoneHigh = Math.round(hrr * (zonePercentage + 10) / 100 + rhr);
    resultsDiv.innerHTML += `<p>Zone ${i}: ${zoneLow}-${zoneHigh} bpm</p>`;
  }
}

// Initial workout input on page load
addWorkoutInput();
