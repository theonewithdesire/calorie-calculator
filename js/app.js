// Global state
let currentGoal = '';

// Language handling
let currentLanguage = 'en'; // Default language

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

// Function to apply language settings
function setLanguage(lang) {
    currentLanguage = lang;
    const html = document.documentElement;
    html.lang = currentLanguage;
    html.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';

    // Hide all potentially language-specific elements first
    document.querySelectorAll('.en, .fa').forEach(el => {
        el.style.display = 'none';
    });

    // Show elements for the current language
    document.querySelectorAll('.' + currentLanguage).forEach(el => {
        // Use appropriate display based on original style or tag type if needed
        // For simplicity, using 'inline-block' for spans and buttons, 'block' for others might be better
        // Or revert to original display style if stored previously.
        // Using inline-block for now as it covers spans used widely.
        el.style.display = 'inline-block'; 
    });

    // Handle select options visibility and selection
    document.querySelectorAll('select').forEach(select => {
        let placeholderOption = null;

        select.querySelectorAll('option').forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            option.selected = false; // Deselect all options first
            
            if (optionLang === currentLanguage) {
                option.style.display = ''; // Show option
                // Check if this is the placeholder for the current language
                if (option.value === "") {
                    placeholderOption = option; // Store the placeholder option element
                }
            } else {
                option.style.display = 'none'; // Hide option
            }
        });

        // Always reset the select value by selecting the placeholder option for the current language
        if (placeholderOption !== null) {
            placeholderOption.selected = true;
            select.value = placeholderOption.value; // Should be ""
        } else {
            // Fallback if placeholder is missing (shouldn't happen with current HTML)
            // Select the first *actual* option if available
            const firstActualOption = select.querySelector(`option[data-lang="${currentLanguage}"][value!=""]`);
            if(firstActualOption) {
                firstActualOption.selected = true;
                select.value = firstActualOption.value;
            } else {
                 select.value = ''; // Really no options
            }
        }
    });

    // Update input placeholders
    if (currentLanguage === 'fa') {
        document.getElementById('age').placeholder = 'سن خود را وارد کنید (۱۰-۱۰۰)';
        document.getElementById('weight').placeholder = 'وزن خود را وارد کنید (۱۰-۳۰۰ کیلوگرم)';
        document.getElementById('height').placeholder = 'قد خود را وارد کنید (۱۰۰-۳۰۰ سانتی‌متر)';
    } else {
        document.getElementById('age').placeholder = 'Enter your age (10-100)';
        document.getElementById('weight').placeholder = 'Enter your weight (10-300 kg)';
        document.getElementById('height').placeholder = 'Enter your height (100-300 cm)';
    }
}

// Function to toggle language
function toggleLanguage() {
    const html = document.documentElement;
    currentLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    html.lang = currentLanguage;
    html.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
    
    // Hide all language elements
    document.querySelectorAll('.en, .fa').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show current language elements
    document.querySelectorAll('.' + currentLanguage).forEach(el => {
        el.style.display = 'inline-block';
    });

    // Reset and update select elements
    document.querySelectorAll('select').forEach(select => {
        // Reset to empty value
        select.value = '';
        
        // Hide all options of other language
        select.querySelectorAll('option').forEach(option => {
            if (option.classList.contains(currentLanguage)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    });

    // Update input placeholders
    if (currentLanguage === 'fa') {
        document.getElementById('age').placeholder = 'سن خود را وارد کنید (۱۰-۱۰۰)';
        document.getElementById('weight').placeholder = 'وزن خود را وارد کنید (۱۰-۳۰۰ کیلوگرم)';
        document.getElementById('height').placeholder = 'قد خود را وارد کنید (۱۰۰-۳۰۰ سانتی‌متر)';
    } else {
        document.getElementById('age').placeholder = 'Enter your age (10-100)';
        document.getElementById('weight').placeholder = 'Enter your weight (10-300 kg)';
        document.getElementById('height').placeholder = 'Enter your height (100-300 cm)';
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    showPage('welcomePage');
    // Set the initial language based on the default 'currentLanguage' value
    setLanguage(currentLanguage);
}); 