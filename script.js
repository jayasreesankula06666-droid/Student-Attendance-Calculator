const form = document.getElementById('attendance-form');
const nameInput = document.getElementById('student-name');
const totalInput = document.getElementById('total-classes');
const attendedInput = document.getElementById('attended-classes');
const requiredInput = document.getElementById('required-percent');
const errorMessage = document.getElementById('error-message');
const result = document.getElementById('result');
const resultName = document.getElementById('result-name');
const percentage = document.getElementById('percentage');
const progressTrack = document.getElementById('progress-track');
const progressFill = document.getElementById('progress-fill');
const statusMessage = document.getElementById('status-message');
const attendanceTip = document.getElementById('attendance-tip');
const resetButton = document.getElementById('reset-button');

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  result.hidden = true;
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.hidden = true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError();

  const total = Number(totalInput.value);
  const attended = Number(attendedInput.value);
  const required = Number(requiredInput.value);

  if (!Number.isInteger(total) || total < 1) {
    showError('Please enter a total number of classes greater than zero.');
    totalInput.focus();
    return;
  }
  if (!Number.isInteger(attended) || attended < 0) {
    showError('Classes attended must be zero or a positive whole number.');
    attendedInput.focus();
    return;
  }
  if (attended > total) {
    showError('Classes attended cannot be greater than total classes held.');
    attendedInput.focus();
    return;
  }
  if (!Number.isFinite(required) || required < 1 || required > 100) {
    showError('Required attendance must be between 1% and 100%.');
    requiredInput.focus();
    return;
  }

  const percent = (attended / total) * 100;
  const roundedPercent = percent.toFixed(2);
  const name = nameInput.value.trim();

  resultName.textContent = name ? `${name}'s attendance` : 'Your attendance';
  percentage.textContent = `${roundedPercent}%`;
  progressFill.style.width = `${Math.min(percent, 100)}%`;
  progressTrack.setAttribute('aria-valuenow', String(Math.round(percent)));
  progressTrack.setAttribute('aria-valuetext', `${roundedPercent}% attendance`);

  if (percent >= required) {
    statusMessage.textContent = `✅ Eligible: You meet the required ${required}% attendance.`;
    statusMessage.className = 'status good';
    attendanceTip.textContent = 'Great work! Keep attending classes to maintain your attendance.';
  } else {
    const classesNeeded = Math.ceil((required * total - 100 * attended) / (100 - required));
    statusMessage.textContent = `⚠️ Below requirement: ${required}% attendance is needed.`;
    statusMessage.className = 'status low';
    attendanceTip.textContent = `If you attend every upcoming class, you need approximately ${Math.max(0, classesNeeded)} consecutive class${classesNeeded === 1 ? '' : 'es'} to reach ${required}%.`;
  }

  result.hidden = false;
});

resetButton.addEventListener('click', () => {
  form.reset();
  clearError();
  result.hidden = true;
  progressFill.style.width = '0%';
  progressTrack.setAttribute('aria-valuenow', '0');
  progressTrack.setAttribute('aria-valuetext', '0% attendance');
  nameInput.focus();
});
