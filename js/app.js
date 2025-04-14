// Global state
let currentGoal = '';

// Utility functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function setGoal(goal) {
    currentGoal = goal;
    showPage('formPage');
}

// Form validation
function validateInput(input, min, max) {
    const value = parseFloat(input.value);
    const errorElement = document.getElementById(`${input.id}Error`);
    
    if (value < min || value > max) {
        errorElement.textContent = `Value must be between ${min} and ${max}.`;
        return false;
    }
    
    errorElement.textContent = '';
    return true;
}

// Event listeners for form validation
document.getElementById('age').addEventListener('input', function() {
    validateInput(this, 10, 100);
});

document.getElementById('weight').addEventListener('input', function() {
    validateInput(this, 10, 300);
});

document.getElementById('height').addEventListener('input', function() {
    validateInput(this, 100, 300);
});

// Calculate calories locally
function calculateCalories(data) {
    const { gender, age, weight, height, activity, goal } = data;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
        sedentary: 1.2,    // Little/no exercise
        light: 1.375,      // Light exercise 1-3 days/week
        moderate: 1.55,    // Moderate exercise 3-5 days/week
        active: 1.725      // Hard exercise 6-7 days/week
    };

    // Calculate maintenance calories
    const maintenanceCalories = bmr * activityMultipliers[activity];

    // Calculate target calories based on goal
    let resultCalories = maintenanceCalories;
    if (goal === 'lose') {
        resultCalories -= 500; // Create a 500 calorie deficit
    } else if (goal === 'gain') {
        resultCalories += 500; // Create a 500 calorie surplus
    }

    return {
        maintenanceCalories,
        resultCalories
    };
}

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    const age = document.getElementById('age');
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');
    
    const isAgeValid = validateInput(age, 10, 100);
    const isWeightValid = validateInput(weight, 10, 300);
    const isHeightValid = validateInput(height, 100, 300);

    if (!isAgeValid || !isWeightValid || !isHeightValid) {
        alert('Please correct the errors before submitting.');
        return;
    }

    // Get form data
    const formData = {
        gender: document.getElementById('gender').value,
        age: parseFloat(age.value),
        weight: parseFloat(weight.value),
        height: parseFloat(height.value),
        activity: document.getElementById('activity').value,
        goal: currentGoal
    };

    // Validate all fields are filled
    if (Object.values(formData).some(value => !value)) {
        alert('All fields are required.');
        return;
    }

    try {
        // Calculate calories locally
        const { maintenanceCalories, resultCalories } = calculateCalories(formData);
        
        // Update results page
        document.getElementById('maintenanceCalories').textContent = Math.round(maintenanceCalories);
        document.getElementById('targetCalories').textContent = Math.round(resultCalories);
        
        // Show results page
        showPage('resultsPage');
    } catch (error) {
        console.error('Error:', error);
        alert('Error calculating calories. Please try again.');
    }
}

// Initialize the app by showing the welcome page
document.addEventListener('DOMContentLoaded', () => {
    showPage('welcomePage');
}); 