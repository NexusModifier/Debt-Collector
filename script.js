function showModal() {
    // Display the modal
    document.getElementById('debt-modal').style.display = 'flex';
}

function closeModal() {
    // Close the modal
    document.getElementById('debt-modal').style.display = 'none';
}

function addDebt() {
    // Get the values entered by the user
    const debtType = document.getElementById('debt-type').value;
    const debtor = document.getElementById('debtor').value;
    const totalDebt = parseFloat(document.getElementById('total-debt').value); // Ensure it's a number
    const paymentAmount = parseFloat(document.getElementById('payment-amount').value); // Ensure it's a number
    const paymentFrequency = document.getElementById('payment-frequency').value;
    const paymentDate = document.getElementById('payment-date').value; // Get the manually entered day

    // Validate that all fields are filled
    if (!debtType || !debtor || !totalDebt || !paymentAmount || !paymentFrequency || !paymentDate) {
        alert('Please fill in all fields.');
        return;
    }

    // Calculate how long it will take to pay off the debt
    const payOffTime = calculatePayOffTime(totalDebt, paymentAmount, paymentFrequency);

    // Create a new debt card element
    const debtCard = document.createElement('div');
    debtCard.classList.add('debt-card');
    
    debtCard.innerHTML = `
        <button class="remove-btn" onclick="removeDebt(this)">X</button>
        <h3>Debt to: ${debtor}</h3>
        <p>Debt Type: ${debtType}</p>
        <p>Total Debt: $${totalDebt.toFixed(2)}</p>
        <p>Payment Amount: $${paymentAmount}</p>
        <p>Payment Frequency: ${paymentFrequency}</p>
        <p>Time Left to Pay: ${payOffTime}</p>
        <p>Payment Due Date: ${paymentDate}</p> <!-- Display the manually entered payment date -->
    `;

    // Add the debt card to the container
    document.getElementById('debt-cards-container').appendChild(debtCard);

    // Update the total debt displayed in the total-debt-container
    updateTotalDebt(totalDebt);

    // Close the modal and clear the form fields
    closeModal();
    clearModalFields();
}

function calculatePayOffTime(totalDebt, paymentAmount, paymentFrequency) {
    let totalWeeks = 0;
    let years, months, weeks, days;

    // Calculate total weeks depending on the frequency of payment
    switch(paymentFrequency) {
        case 'Weekly':
            totalWeeks = totalDebt / paymentAmount;
            break;
        case 'Bi-Weekly':
            totalWeeks = totalDebt / paymentAmount / 2;
            break;
        case 'Monthly':
            totalWeeks = (totalDebt / paymentAmount) * 4;
            break;
        case 'Quarterly':
            totalWeeks = (totalDebt / paymentAmount) * 12;
            break;
        case 'Semi-Annually':
            totalWeeks = (totalDebt / paymentAmount) * 26;
            break;
        case 'Annually':
            totalWeeks = (totalDebt / paymentAmount) * 52;
            break;
    }

    // Convert weeks to years, months, weeks, and days
    years = Math.floor(totalWeeks / 52);
    totalWeeks %= 52;
    months = Math.floor(totalWeeks / 4);
    totalWeeks %= 4;
    weeks = Math.floor(totalWeeks);
    days = Math.floor((totalWeeks - weeks) * 7); // Convert remaining weeks to days

    return `${years} years, ${months} months, ${weeks} weeks, ${days} days`;
}


function updateTotalDebt(newDebt) {
    // Get the current total debt value from the container
    let currentTotalDebt = parseFloat(document.querySelector('.total-debt-container h3').textContent.replace('$', ''));

    // Add the new debt to the current total debt
    currentTotalDebt += newDebt;

    // Update the displayed total debt in the container
    document.querySelector('.total-debt-container h3').textContent = `$${currentTotalDebt.toFixed(2)}`;
}

function removeDebt(button) {
    const card = button.closest('.debt-card'); // Find the card that contains the button
    const debtAmount = parseFloat(card.querySelector('p').textContent.replace('Total Debt: $', ''));

    // Remove the debt card from the DOM
    card.remove();

    // Update the total debt after removing the debt card
    updateTotalDebt(-debtAmount); // Pass a negative value to subtract from total
}

function clearModalFields() {
    // Clear the input fields in the modal after the debt card is added
    document.getElementById('debt-type').value = 'Business'; // Default reset
    document.getElementById('debtor').value = '';
    document.getElementById('total-debt').value = '';
    document.getElementById('payment-amount').value = '';
    document.getElementById('payment-frequency').value = 'Weekly';  // Default reset
}

// Function to remove a debt card when the "X" button is clicked
function removeDebt(button) {
    const card = button.closest('.debt-card'); // Find the card that contains the button
    card.remove(); // Remove the card from the DOM
}

// Close the modal if the user clicks outside of the modal content
window.onclick = function(event) {
    const modal = document.getElementById('debt-modal');
    if (event.target === modal) {
        closeModal();
    }
}
