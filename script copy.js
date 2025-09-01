// Global Variables
let expenses = [];
let personalLoanSchedule = [];
let housingLoanSchedule = [];

// Mobile detection
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
};

// Tab Navigation Function with mobile optimization
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Mobile: scroll tab into view
    if (isMobile()) {
        event.target.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center',
            block: 'nearest'
        });
    }
}

// Currency Formatting Function
function formatCurrency(amount) {
    return new Intl.NumberFormat('si-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatCurrencyDecimal(amount) {
    return new Intl.NumberFormat('si-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Salary Calculator Functions with mobile optimization
function calculateSalary() {
    const gross = parseFloat(document.getElementById('grossSalary').value) || 0;
    const epfRate = parseFloat(document.getElementById('epfRate').value) || 8;
    const etfRate = parseFloat(document.getElementById('etfRate').value) || 3;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 6;

    // Input validation
    if (gross <= 0) {
        showAlert('Please enter a valid gross salary amount');
        document.getElementById('grossSalary').focus();
        return;
    }

    // Show loading state on mobile
    const button = event?.target;
    if (button && isMobile()) {
        button.textContent = 'Calculating...';
        button.disabled = true;
    }

    setTimeout(() => {
        // Calculate deductions
        const epfDeduction = gross * (epfRate / 100);
        const etfDeduction = gross * (etfRate / 100);
        const taxDeduction = gross * (taxRate / 100);
        const takeHome = gross - epfDeduction - etfDeduction - taxDeduction;

        // Display results
        document.getElementById('grossAmount').textContent = formatCurrency(gross);
        document.getElementById('epfAmount').textContent = formatCurrency(epfDeduction);
        document.getElementById('etfAmount').textContent = formatCurrency(etfDeduction);
        document.getElementById('taxAmount').textContent = formatCurrency(taxDeduction);
        document.getElementById('takeHomeSalary').textContent = formatCurrency(takeHome);
        
        // Show result section with animation
        const resultDiv = document.getElementById('salaryResult');
        resultDiv.style.display = 'block';
        
        // Mobile optimization: scroll and haptic feedback
        if (isMobile()) {
            setTimeout(() => {
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Haptic feedback if available
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            }, 100);
        }
        
        // Reset button state
        if (button) {
            button.textContent = 'Calculate Take Home Salary';
            button.disabled = false;
        }
        
        showToast('Salary calculated successfully!');
    }, 300);
}

// Personal Loan Calculator Functions
function calculatePersonalLoan() {
    const principal = parseFloat(document.getElementById('personalLoanAmount').value) || 0;
    const annualRate = parseFloat(document.getElementById('personalInterestRate').value) || 0;
    const years = parseFloat(document.getElementById('personalLoanTerm').value) || 0;
    const months = parseFloat(document.getElementById('personalLoanTermMonths').value) || 0;

    // Input validation
    if (principal <= 0) {
        showAlert('Please enter a valid loan amount');
        document.getElementById('personalLoanAmount').focus();
        return;
    }
    if (annualRate < 0) {
        showAlert('Please enter a valid interest rate');
        return;
    }
    if (years <= 0) {
        showAlert('Please enter a valid loan term');
        return;
    }

    // Calculate loan details using EMI method (equated balance)
    const totalMonths = (years * 12) + months;
    const monthlyRate = annualRate / 100 / 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
        monthlyPayment = principal / totalMonths;
    }

    const totalAmount = monthlyPayment * totalMonths;
    const totalInterest = totalAmount - principal;

    // Generate payment schedule
    personalLoanSchedule = generateEMISchedule(principal, annualRate, totalMonths);

    // Display results
    document.getElementById('personalPrincipalAmount').textContent = formatCurrency(principal);
    document.getElementById('personalTotalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('personalTotalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('personalMonthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('personalDisplayRate').textContent = annualRate + '%';
    document.getElementById('personalDisplayTerm').textContent = years + (months > 0 ? ` years ${months} months` : ' years');
    
    // Show result section with animation
    const resultDiv = document.getElementById('personalLoanResult');
    const breakdownDiv = document.getElementById('personalLoanBreakdown');
    resultDiv.style.display = 'block';
    breakdownDiv.style.display = 'block';
    
    if (isMobile()) {
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    showToast('Personal loan calculated successfully!');
}

// Housing Loan Calculator Functions
function calculateHousingLoan() {
    const principal = parseFloat(document.getElementById('housingLoanAmount').value) || 0;
    const annualRate = parseFloat(document.getElementById('housingInterestRate').value) || 0;
    const years = parseFloat(document.getElementById('housingLoanTerm').value) || 0;
    const months = parseFloat(document.getElementById('housingLoanTermMonths').value) || 0;
    const repaymentType = document.getElementById('repaymentType').value;

    // Input validation
    if (principal <= 0) {
        showAlert('Please enter a valid loan amount');
        document.getElementById('housingLoanAmount').focus();
        return;
    }
    if (annualRate < 0) {
        showAlert('Please enter a valid interest rate');
        return;
    }
    if (years <= 0) {
        showAlert('Please enter a valid loan term');
        return;
    }

    const totalMonths = (years * 12) + months;
    let schedule, firstMonthPayment, firstMonthPrincipal, firstMonthInterest, totalInterest;

    if (repaymentType === 'equated') {
        // EMI Calculation
        const monthlyRate = annualRate / 100 / 12;
        let monthlyPayment = 0;
        
        if (monthlyRate > 0) {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                            (Math.pow(1 + monthlyRate, totalMonths) - 1);
        } else {
            monthlyPayment = principal / totalMonths;
        }

        schedule = generateEMISchedule(principal, annualRate, totalMonths);
        firstMonthPayment = monthlyPayment;
        firstMonthPrincipal = schedule[0].principal;
        firstMonthInterest = schedule[0].interest;
        totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0);
        
        document.getElementById('housingPaymentLabel').textContent = 'Monthly Payment (EMI)';
        
    } else {
        // Reducing Balance Calculation
        schedule = generateReducingBalanceSchedule(principal, annualRate, totalMonths);
        firstMonthPayment = schedule[0].monthlyPayment;
        firstMonthPrincipal = schedule[0].principal;
        firstMonthInterest = schedule[0].interest;
        totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0);
        
        document.getElementById('housingPaymentLabel').textContent = 'Monthly Payment (1st Month)';
    }

    housingLoanSchedule = schedule;
    const totalAmount = principal + totalInterest;

    // Display results
    document.getElementById('housingPrincipalAmount').textContent = formatCurrency(principal);
    document.getElementById('housingTotalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('housingTotalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('housingMonthlyPayment').textContent = formatCurrency(firstMonthPayment);
    document.getElementById('housingDisplayRate').textContent = annualRate + '%';
    document.getElementById('housingDisplayTerm').textContent = years + (months > 0 ? ` years ${months} months` : ' years');
    document.getElementById('housingFirstMonthPrincipal').textContent = formatCurrencyDecimal(firstMonthPrincipal);
    document.getElementById('housingFirstMonthInterest').textContent = formatCurrencyDecimal(firstMonthInterest);
    
    // Show result section with animation
    const resultDiv = document.getElementById('housingLoanResult');
    const breakdownDiv = document.getElementById('housingLoanBreakdown');
    resultDiv.style.display = 'block';
    breakdownDiv.style.display = 'block';
    
    if (isMobile()) {
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    showToast('Housing loan calculated successfully!');
}

// Generate EMI Schedule (Equated Balance)
function generateEMISchedule(principal, annualRate, totalMonths) {
    const monthlyRate = annualRate / 100 / 12;
    let monthlyPayment = 0;
    
    if (monthlyRate > 0) {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
        monthlyPayment = principal / totalMonths;
    }

    const schedule = [];
    let remainingBalance = principal;

    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        // Ensure remaining balance doesn't go negative due to floating point errors
        if (remainingBalance < 0.01) remainingBalance = 0;

        schedule.push({
            month: month,
            monthlyPayment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            remainingBalance: remainingBalance
        });
    }

    return schedule;
}

// Generate Reducing Balance Schedule
function generateReducingBalanceSchedule(principal, annualRate, totalMonths) {
    const monthlyRate = annualRate / 100 / 12;
    const principalPayment = principal / totalMonths;
    const schedule = [];
    let remainingBalance = principal;

    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const monthlyPayment = principalPayment + interestPayment;
        remainingBalance -= principalPayment;

        // Ensure remaining balance doesn't go negative
        if (remainingBalance < 0.01) remainingBalance = 0;

        schedule.push({
            month: month,
            monthlyPayment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            remainingBalance: remainingBalance
        });
    }

    return schedule;
}

// Show repayment type description
function showRepaymentDescription() {
    const repaymentType = document.getElementById('repaymentType').value;
    const descriptionDiv = document.getElementById('repaymentDescription');
    const contentDiv = descriptionDiv.querySelector('.description-content');
    
    if (repaymentType === 'equated') {
        contentDiv.innerHTML = `
            <h4>📊 Equated Balance (EMI)</h4>
            <p>Equal Monthly Installments - You pay the <strong>same amount</strong> every month. Initially, more goes toward interest, then gradually more toward principal.</p>
            <ul>
                <li>✅ Predictable monthly payments</li>
                <li>✅ Easier budgeting</li>
                <li>⚠️ Higher total interest over loan term</li>
            </ul>
        `;
    } else {
        contentDiv.innerHTML = `
            <h4>📉 Reducing Balance</h4>
            <p>Decreasing Monthly Installments - You pay <strong>more initially, then less</strong> over time. Fixed principal + decreasing interest each month.</p>
            <ul>
                <li>✅ Lower total interest over loan term</li>
                <li>✅ Faster principal reduction</li>
                <li>⚠️ Higher initial monthly payments</li>
            </ul>
        `;
    }
}

// Toggle payment schedule display
function togglePersonalBreakdown() {
    const scheduleDiv = document.getElementById('personalPaymentSchedule');
    const toggleBtn = document.getElementById('personalBreakdownToggle');
    
    if (scheduleDiv.style.display === 'none' || !scheduleDiv.style.display) {
        scheduleDiv.style.display = 'block';
        toggleBtn.textContent = '📊 Hide Payment Schedule';
        populatePersonalSchedule();
    } else {
        scheduleDiv.style.display = 'none';
        toggleBtn.textContent = '📊 Show Payment Schedule';
    }
}

function toggleHousingBreakdown() {
    const scheduleDiv = document.getElementById('housingPaymentSchedule');
    const toggleBtn = document.getElementById('housingBreakdownToggle');
    
    if (scheduleDiv.style.display === 'none' || !scheduleDiv.style.display) {
        scheduleDiv.style.display = 'block';
        toggleBtn.textContent = '📊 Hide Payment Schedule';
        populateHousingSchedule();
    } else {
        scheduleDiv.style.display = 'none';
        toggleBtn.textContent = '📊 Show Payment Schedule';
    }
}

// Populate schedule tables
function populatePersonalSchedule() {
    const tbody = document.getElementById('personalScheduleBody');
    tbody.innerHTML = '';
    
    personalLoanSchedule.forEach(payment => {
        const row = document.createElement('div');
        row.className = 'schedule-row';
        row.innerHTML = `
            <span>${payment.month}</span>
            <span>${formatCurrencyDecimal(payment.principal)}</span>
            <span>${formatCurrencyDecimal(payment.interest)}</span>
            <span>${formatCurrencyDecimal(payment.monthlyPayment)}</span>
            <span>${formatCurrencyDecimal(payment.remainingBalance)}</span>
        `;
        tbody.appendChild(row);
    });
}

function populateHousingSchedule() {
    const tbody = document.getElementById('housingScheduleBody');
    tbody.innerHTML = '';
    
    housingLoanSchedule.forEach(payment => {
        const row = document.createElement('div');
        row.className = 'schedule-row';
        row.innerHTML = `
            <span>${payment.month}</span>
            <span>${formatCurrencyDecimal(payment.principal)}</span>
            <span>${formatCurrencyDecimal(payment.interest)}</span>
            <span>${formatCurrencyDecimal(payment.monthlyPayment)}</span>
            <span>${formatCurrencyDecimal(payment.remainingBalance)}</span>
        `;
        tbody.appendChild(row);
    });
}

// Export loan schedules
function exportPersonalLoanSchedule() {
    exportScheduleToCSV(personalLoanSchedule, 'personal_loan_schedule.csv', 'Personal Loan Payment Schedule');
}

function exportHousingLoanSchedule() {
    exportScheduleToCSV(housingLoanSchedule, 'housing_loan_schedule.csv', 'Housing Loan Payment Schedule');
}

function exportScheduleToCSV(schedule, filename, title) {
    if (schedule.length === 0) {
        showAlert('No payment schedule to export');
        return;
    }
    
    let csvContent = `${title}\n`;
    csvContent += "Month,Monthly Installment Principal,Monthly Interest,Monthly Installment,Principal Amount\n";
    
    schedule.forEach(payment => {
        csvContent += `${payment.month},${payment.principal.toFixed(2)},${payment.interest.toFixed(2)},${payment.monthlyPayment.toFixed(2)},${payment.remainingBalance.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Schedule exported successfully!');
}

// Expense Tracker Functions
function addExpense() {
    const category = document.getElementById('expenseCategory').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value) || 0;
    
    // Input validation
    if (amount <= 0) {
        showAlert('Please enter a valid expense amount');
        return;
    }
    
    // Add expense to array
    expenses.push({ category, amount });
    
    // Update display and clear input
    updateExpenseDisplay();
    document.getElementById('expenseAmount').value = '';
    
    // Focus back to amount input for easy entry
    document.getElementById('expenseAmount').focus();
}

function deleteExpense(index) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        updateExpenseDisplay();
    }
}

function updateExpenseDisplay() {
    const expenseListDiv = document.getElementById('expenseList');
    const expensesDiv = document.getElementById('expenses');
    const expenseResultDiv = document.getElementById('expenseResult');
    const expenseBreakdownDiv = document.getElementById('expenseBreakdown');
    const expenseActionsDiv = document.getElementById('expenseActions');

    // Hide sections if no expenses
    if (expenses.length === 0) {
        expenseListDiv.style.display = 'none';
        expenseResultDiv.style.display = 'none';
        expenseActionsDiv.style.display = 'none';
        return;
    }

    // Show sections
    expenseListDiv.style.display = 'block';
    expenseResultDiv.style.display = 'block';
    expenseActionsDiv.style.display = 'block';

    // Display expense list
    expensesDiv.innerHTML = '';
    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <span><strong>${expense.category}:</strong> ${formatCurrency(expense.amount)}</span>
            <button class="delete-btn" onclick="deleteExpense(${index})" title="Delete this expense">
                🗑️ Delete
            </button>
        `;
        expensesDiv.appendChild(expenseItem);
    });

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);

    // Create category breakdown
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Display breakdown
    expenseBreakdownDiv.innerHTML = '';
    Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a) // Sort by amount descending
        .forEach(([category, amount]) => {
            const percentage = ((amount / totalExpenses) * 100).toFixed(1);
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <strong>${category}</strong>
                <span>${formatCurrency(amount)} (${percentage}%)</span>
            `;
            expenseBreakdownDiv.appendChild(breakdownItem);
        });

    // Mobile: scroll to results
    if (isMobile()) {
        setTimeout(() => {
            expenseResultDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }
}

// Enhanced reset functionality
function resetCalculator(type) {
    const confirmReset = confirm(`Are you sure you want to clear all ${type === 'expense' ? 'expenses' : 'data'} and start fresh?`);
    
    if (!confirmReset) return;
    
    switch(type) {
        case 'salary':
            document.getElementById('grossSalary').value = '';
            document.getElementById('epfRate').value = '8';
            document.getElementById('etfRate').value = '3';
            document.getElementById('taxRate').value = '6';
            document.getElementById('salaryResult').style.display = 'none';
            document.getElementById('grossSalary').focus();
            break;
            
        case 'personal-loan':
            document.getElementById('personalLoanAmount').value = '';
            document.getElementById('personalInterestRate').value = '15';
            document.getElementById('personalLoanTerm').value = '3';
            document.getElementById('personalLoanTermMonths').value = '0';
            document.getElementById('personalLoanResult').style.display = 'none';
            document.getElementById('personalLoanBreakdown').style.display = 'none';
            document.getElementById('personalPaymentSchedule').style.display = 'none';
            personalLoanSchedule = [];
            document.getElementById('personalLoanAmount').focus();
            break;
            
        case 'housing-loan':
            document.getElementById('housingLoanAmount').value = '';
            document.getElementById('housingInterestRate').value = '9';
            document.getElementById('housingLoanTerm').value = '20';
            document.getElementById('housingLoanTermMonths').value = '0';
            document.getElementById('repaymentType').selectedIndex = 0;
            showRepaymentDescription();
            document.getElementById('housingLoanResult').style.display = 'none';
            document.getElementById('housingLoanBreakdown').style.display = 'none';
            document.getElementById('housingPaymentSchedule').style.display = 'none';
            housingLoanSchedule = [];
            document.getElementById('housingLoanAmount').focus();
            break;
            
        case 'expense':
            expenses = [];
            document.getElementById('expenseAmount').value = '';
            document.getElementById('expenseCategory').selectedIndex = 0;
            updateExpenseDisplay();
            document.getElementById('expenseAmount').focus();
            break;
    }
    
    // Show success message
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} calculator cleared successfully!`);
}

// Export expenses function
function exportExpenses() {
    if (expenses.length === 0) {
        showAlert('No expenses to export');
        return;
    }
    
    // Create CSV content
    let csvContent = "Category,Amount\n";
    expenses.forEach(expense => {
        csvContent += `"${expense.category}",${expense.amount}\n`;
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'monthly_expenses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Expenses exported successfully!');
}

// Print functionality
function printResults(type) {
    const printWindow = window.open('', '_blank');
    let content = '';
    
    switch(type) {
        case 'salary':
            const takeHome = document.getElementById('takeHomeSalary').textContent;
            content = `
                <h2>Salary Calculation Results</h2>
                <p><strong>Take Home Salary:</strong> ${takeHome}</p>
                <div>${document.querySelector('#salaryResult .breakdown').innerHTML}</div>
            `;
            break;
        case 'expense':
            const totalExpenses = document.getElementById('totalExpenses').textContent;
            content = `
                <h2>Expense Summary</h2>
                <p><strong>Total Monthly Expenses:</strong> ${totalExpenses}</p>
                <div>${document.querySelector('#expenseBreakdown').innerHTML}</div>
            `;
            break;
    }
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Financial Calculator Results</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .breakdown-item { border: 1px solid #ccc; padding: 10px; }
                </style>
            </head>
            <body>
                ${content}
                <p><small>Generated by Sri Lanka Financial Calculator</small></p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Event Listeners and Initialization with mobile optimization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize repayment description
    showRepaymentDescription();
    
    // Mobile-specific initialization
    if (isMobile()) {
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (this.getAttribute('type') === 'number') {
                    this.setAttribute('inputmode', 'decimal');
                }
            });
        });
        
        // Add touch feedback
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            button.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }
    
    // Add keyboard shortcuts (desktop only)
    if (!isMobile()) {
        document.addEventListener('keydown', function(e) {
            // Alt + 1, 2, 3, 4 for tab switching
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        document.querySelector('[onclick="showTab(\'salary\')"]').click();
                        break;
                    case '2':
                        document.querySelector('[onclick="showTab(\'personal-loan\')"]').click();
                        break;
                    case '3':
                        document.querySelector('[onclick="showTab(\'housing-loan\')"]').click();
                        break;
                    case '4':
                        document.querySelector('[onclick="showTab(\'expense\')"]').click();
                        break;
                }
            }
        });
    }
    
    // Add Enter key support for calculations
    document.getElementById('grossSalary').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateSalary();
    });
    
    document.getElementById('personalLoanAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePersonalLoan();
    });
    
    document.getElementById('housingLoanAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateHousingLoan();
    });
    
    document.getElementById('expenseAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addExpense();
    });
    
    // Add input validation for numbers with mobile optimization
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
        
        // Mobile: better number input handling
        if (isMobile()) {
            input.addEventListener('blur', function() {
                // Format number display on mobile
                if (this.value && (this.id.includes('Salary') || this.id.includes('Amount'))) {
                    const value = parseFloat(this.value);
                    if (value > 0) {
                        this.value = value.toLocaleString('en-LK');
                    }
                }
            });
            
            input.addEventListener('focus', function() {
                // Remove formatting for editing
                this.value = this.value.replace(/,/g, '');
            });
        }
    });
    
    // Orientation change handling for mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
    
    console.log('Sri Lanka Financial Calculator loaded successfully!');
    console.log('Mobile device detected:', isMobile());
});

// Utility Functions for Mobile Experience
function showAlert(message) {
    if (isMobile()) {
        // Custom mobile-friendly alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'mobile-alert';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    } else {
        alert(message);
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add styles for mobile alerts and toasts
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    .mobile-alert {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .alert-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        max-width: 300px;
        margin: 20px;
    }
    
    .alert-content p {
        margin-bottom: 20px;
        font-size: 1.1em;
        color: #333;
    }
    
    .alert-content button {
        background: #2a5298;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-size: 1em;
        cursor: pointer;
    }
    
    .toast-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #2a5298;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 0.95em;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
        text-align: center;
    }
    
    .toast-notification.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    
    @media (max-width: 480px) {
        .toast-notification {
            bottom: 10px;
            left: 10px;
            right: 10px;
            transform: translateY(100px);
            max-width: none;
        }
        
        .toast-notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(mobileStyles);