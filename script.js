/* Sri Lankan Financial Calculator - Enhanced JavaScript with Supermarket Discounts Integration */

// Global variables
let expenses = [];
let housingLoanData = {};
let personalLoanData = {};
let expenseChart = null; // Chart.js instance
let supermarketOffers = [];
let selectedOffers = [];
let potentialSavings = 0;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadFromURL();
    generateSupermarketOffers();
    
    // Set up real-time offer updates
    setInterval(() => {
        generateSupermarketOffers();
        updateSupermarketOffersDisplay();
    }, 30000); // Update every 30 seconds
    
    // SEO: Track page views (replace with your analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Sri Lankan Financial Calculator',
            page_location: window.location.href
        });
    }
});

// Generate realistic supermarket offers based on research
function generateSupermarketOffers() {
    const offers = [
        {
            id: 1,
            supermarket: 'Keells Super',
            title: '25% OFF Fresh Vegetables & Fruits',
            description: 'With People\'s Bank Credit Cards - Island Wide',
            discount: 25,
            category: 'Fresh Produce',
            validUntil: '2025-09-30',
            estimatedSavings: 1250,
            location: 'All 135 Outlets',
            cardType: 'People\'s Bank Credit Card',
            minPurchase: 0,
            isActive: true,
            color: 'blue'
        },
        {
            id: 2,
            supermarket: 'Cargills Food City',
            title: '20% OFF Vegetables, Fruits & Seafood',
            description: 'NDB Credit Cards - Fresh Categories',
            discount: 20,
            category: 'Fresh Produce & Seafood',
            validUntil: '2025-09-15',
            estimatedSavings: 950,
            location: 'Island Wide - 200+ Outlets',
            cardType: 'NDB Credit Card',
            minPurchase: 0,
            isActive: true,
            color: 'green'
        },
        {
            id: 3,
            supermarket: 'Glomark',
            title: '30% OFF Monday Fresh Deals',
            description: 'Sampath Bank Cards - Vegetables, Fruits, Meat & Fish',
            discount: 30,
            category: 'Fresh Categories',
            validUntil: '2025-08-25',
            estimatedSavings: 1800,
            location: 'All Glomark Outlets & glomark.lk',
            cardType: 'Sampath Bank Credit/Debit',
            minPurchase: 0,
            isActive: true,
            color: 'purple'
        },
        {
            id: 4,
            supermarket: 'SPAR',
            title: 'Rs. 500 OFF on Food Delivery',
            description: 'Uber Eats/PickMe - Min purchase Rs. 1,500',
            discount: 500,
            category: 'Food Delivery',
            validUntil: '2025-07-31',
            estimatedSavings: 500,
            location: 'Delivery Service',
            cardType: 'Any Card',
            minPurchase: 1500,
            isActive: true,
            color: 'orange'
        },
        {
            id: 5,
            supermarket: 'Laugfs Super',
            title: '10% OFF Total Bill',
            description: 'DFCC Credit Cards - Bills over LKR 5,000',
            discount: 10,
            category: 'Total Bill',
            validUntil: '2025-09-30',
            estimatedSavings: 750,
            location: 'All Laugfs Super',
            cardType: 'DFCC Credit Card',
            minPurchase: 5000,
            isActive: true,
            color: 'red'
        },
        {
            id: 6,
            supermarket: 'Arpico Super',
            title: '40% OFF Chocolate Treats',
            description: 'Special discount on Arpico chocolates',
            discount: 40,
            category: 'Confectionery',
            validUntil: '2025-09-20',
            estimatedSavings: 400,
            location: 'Arpico Outlets',
            cardType: 'Any Card',
            minPurchase: 0,
            isActive: true,
            color: 'pink'
        },
        {
            id: 7,
            supermarket: 'Lanka Sathosa',
            title: '15% OFF Essential Items',
            description: 'Government subsidized essential items',
            discount: 15,
            category: 'Essentials',
            validUntil: '2025-12-31',
            estimatedSavings: 600,
            location: 'All Lanka Sathosa Outlets',
            cardType: 'Any Card',
            minPurchase: 0,
            isActive: true,
            color: 'teal'
        }
    ];
    
    // Add random time-based variations to make it feel more live
    const now = new Date();
    const hour = now.getHours();
    
    // Add special time-based offers
    if (hour >= 6 && hour <= 10) {
        offers.push({
            id: 8,
            supermarket: 'Morning Fresh Markets',
            title: 'Early Bird 20% OFF',
            description: 'Fresh produce - Available until 10 AM',
            discount: 20,
            category: 'Morning Special',
            validUntil: '2025-09-03',
            estimatedSavings: 800,
            location: 'Selected Outlets',
            cardType: 'Any Card',
            minPurchase: 0,
            isActive: true,
            color: 'yellow'
        });
    }
    
    if (hour >= 18 && hour <= 21) {
        offers.push({
            id: 9,
            supermarket: 'Evening Deals',
            title: 'Happy Hour 25% OFF',
            description: 'Ready-to-eat meals and beverages',
            discount: 25,
            category: 'Evening Special',
            validUntil: '2025-09-03',
            estimatedSavings: 600,
            location: 'Major Supermarkets',
            cardType: 'Any Card',
            minPurchase: 0,
            isActive: true,
            color: 'indigo'
        });
    }
    
    supermarketOffers = offers;
}

// Update supermarket offers display
function updateSupermarketOffersDisplay() {
    const offersContainer = document.getElementById('supermarket-offers');
    if (!offersContainer) return;
    
    const activeOffers = supermarketOffers.filter(offer => offer.isActive);
    const totalSavings = selectedOffers.reduce((sum, offer) => sum + offer.estimatedSavings, 0);
    
    let offersHTML = `
        <div class="offers-header">
            <h3>🛒 Live Supermarket Offers</h3>
            <div class="offers-status">
                <span class="offers-count">${activeOffers.length} active offers</span>
                <span class="live-indicator">🔴 LIVE</span>
            </div>
        </div>
        <div class="offers-grid">
    `;
    
    activeOffers.forEach(offer => {
        const isSelected = selectedOffers.find(selected => selected.id === offer.id);
        const cardClass = getOfferCardClass(offer.color);
        
        offersHTML += `
            <div class="offer-card ${cardClass} ${isSelected ? 'selected' : ''}" 
                 onclick="toggleSupermarketOffer(${offer.id})">
                <div class="offer-header">
                    <h4>${offer.supermarket}</h4>
                    <div class="discount-badge">
                        ${typeof offer.discount === 'number' && offer.discount < 100 
                          ? `${offer.discount}% OFF` 
                          : `Rs. ${offer.discount} OFF`}
                    </div>
                </div>
                <h5 class="offer-title">${offer.title}</h5>
                <p class="offer-description">${offer.description}</p>
                <div class="offer-details">
                    <div class="offer-detail">
                        <span class="detail-icon">📍</span>
                        <span class="detail-text">${offer.location}</span>
                    </div>
                    <div class="offer-detail">
                        <span class="detail-icon">💳</span>
                        <span class="detail-text">${offer.cardType}</span>
                    </div>
                    <div class="offer-detail">
                        <span class="detail-icon">⏰</span>
                        <span class="detail-text">Valid until: ${offer.validUntil}</span>
                    </div>
                    ${offer.minPurchase > 0 ? `
                        <div class="offer-detail">
                            <span class="detail-icon">💰</span>
                            <span class="detail-text">Min: ${formatCurrency(offer.minPurchase)}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="offer-savings">
                    <span class="savings-label">Est. Monthly Savings:</span>
                    <span class="savings-amount">${formatCurrency(offer.estimatedSavings)}</span>
                </div>
                ${isSelected ? `
                    <div class="offer-selected">
                        ✅ Added to your savings plan
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    offersHTML += '</div>';
    
    // Add savings summary if offers are selected
    if (selectedOffers.length > 0) {
        offersHTML += `
            <div class="savings-summary">
                <h4>💰 Your Savings Plan</h4>
                <div class="savings-breakdown">
                    <div class="selected-offers">
                        <h5>Selected Offers (${selectedOffers.length})</h5>
                        <div class="offers-list">
                            ${selectedOffers.map(offer => `
                                <div class="selected-offer-item">
                                    <span class="offer-name">${offer.supermarket} - ${offer.title}</span>
                                    <span class="offer-value">${formatCurrency(offer.estimatedSavings)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="savings-totals">
                        <div class="total-monthly">
                            <span class="total-label">Total Monthly Savings:</span>
                            <span class="total-amount">${formatCurrency(totalSavings)}</span>
                        </div>
                        <div class="total-annual">
                            <span class="total-label">Annual Savings:</span>
                            <span class="total-amount">${formatCurrency(totalSavings * 12)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    offersContainer.innerHTML = offersHTML;
}

// Toggle supermarket offer selection
function toggleSupermarketOffer(offerId) {
    const offer = supermarketOffers.find(o => o.id === offerId);
    const existingIndex = selectedOffers.findIndex(o => o.id === offerId);
    
    if (existingIndex !== -1) {
        selectedOffers.splice(existingIndex, 1);
        potentialSavings -= offer.estimatedSavings;
    } else {
        selectedOffers.push(offer);
        potentialSavings += offer.estimatedSavings;
    }
    
    updateSupermarketOffersDisplay();
    updateExpenseResultsWithSavings();
    
    // Track offer selection
    if (typeof gtag !== 'undefined') {
        gtag('event', 'offer_selected', {
            supermarket: offer.supermarket,
            discount: offer.discount,
            estimated_savings: offer.estimatedSavings
        });
    }
}

// Get offer card CSS class based on color
function getOfferCardClass(color) {
    const classes = {
        'blue': 'offer-blue',
        'green': 'offer-green',
        'purple': 'offer-purple',
        'orange': 'offer-orange',
        'red': 'offer-red',
        'pink': 'offer-pink',
        'teal': 'offer-teal',
        'yellow': 'offer-yellow',
        'indigo': 'offer-indigo'
    };
    return classes[color] || 'offer-default';
}

// Initialize event listeners
function initializeEventListeners() {
    // Expense form event listeners
    const expenseCategory = document.getElementById('expense-category');
    const expenseAmount = document.getElementById('expense-amount');
    
    if (expenseCategory) {
        expenseCategory.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                expenseAmount.focus();
            }
        });
    }
    
    if (expenseAmount) {
        expenseAmount.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addExpense();
            }
        });
    }
    
    // Form validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', validateNumberInput);
    });
}

// Load data from URL parameters (for SEO and sharing)
function loadFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('demo') === 'true') {
        loadDemoData();
    }
    
    // Load specific calculator based on URL hash
    const hash = window.location.hash.substring(1);
    if (['salary', 'housing-loan', 'personal-loan', 'expenses'].includes(hash)) {
        showCalculator(hash);
    }
}

// Validate number inputs
function validateNumberInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    
    if (input.hasAttribute('min')) {
        const min = parseFloat(input.getAttribute('min'));
        if (value < min) {
            input.setCustomValidity(`Minimum value is ${min}`);
        } else {
            input.setCustomValidity('');
        }
    }
    
    if (input.hasAttribute('max')) {
        const max = parseFloat(input.getAttribute('max'));
        if (value > max) {
            input.setCustomValidity(`Maximum value is ${max}`);
        } else {
            input.setCustomValidity('');
        }
    }
}

// Tab switching with URL update for SEO
function showCalculator(calculatorName) {
    // Update URL for SEO
    history.pushState(null, null, `#${calculatorName}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.calculator-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(calculatorName);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active to clicked tab
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Find and activate the corresponding tab
        tabs.forEach(tab => {
            if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(calculatorName)) {
                tab.classList.add('active');
            }
        });
    }
    
    // Track section views for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'section_view', {
            section_name: calculatorName
        });
    }
    
    // Scroll to top of content
    document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
}

// Enhanced Sri Lankan Salary Calculator with 2025 Tax Rules
function calculateSalary() {
    try {
        const basicSalary = validateInput(document.getElementById('basic-salary').value, 'basic salary');
        const allowances = parseFloat(document.getElementById('allowances').value) || 0;
        
        const grossSalary = basicSalary + allowances;
        
        // EPF calculations (based on basic salary only)
        const epfEmployee = basicSalary * 0.08; // 8% employee contribution
        const epfEmployer = basicSalary * 0.12; // 12% employer contribution
        const etfEmployer = basicSalary * 0.03; // 3% employer contribution (ETF)
        
        // APIT (Advance Personal Income Tax) calculation - 2025 rates
        const apitTax = calculateAPIT(grossSalary);
        
        const netSalary = grossSalary - epfEmployee - apitTax;
        const annualNet = netSalary * 12;
        
        // Display results with formatting
        displaySalaryResults({
            grossSalary,
            epfEmployee,
            epfEmployer,
            etfEmployer,
            apitTax,
            netSalary,
            annualNet
        });
        
        // Track calculation for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'salary_calculated', {
                gross_salary: grossSalary,
                net_salary: netSalary
            });
        }
        
    } catch (error) {
        showError('Salary calculation error: ' + error.message);
    }
}

// APIT Tax calculation function (2025 rates)
function calculateAPIT(grossSalary) {
    const monthlyThreshold = 150000; // LKR 150,000 tax-free threshold from April 2025
    
    if (grossSalary <= monthlyThreshold) {
        return 0;
    }
    
    const taxableAmount = grossSalary - monthlyThreshold;
    let apitTax = 0;
    
    // Progressive tax brackets (2025 estimated rates)
    if (taxableAmount <= 50000) {
        apitTax = taxableAmount * 0.06; // 6% for first LKR 50,000
    } else if (taxableAmount <= 100000) {
        apitTax = 50000 * 0.06 + (taxableAmount - 50000) * 0.12; // 12% for next LKR 50,000
    } else if (taxableAmount <= 150000) {
        apitTax = 50000 * 0.06 + 50000 * 0.12 + (taxableAmount - 100000) * 0.18; // 18% for next LKR 50,000
    } else {
        apitTax = 50000 * 0.06 + 50000 * 0.12 + 50000 * 0.18 + (taxableAmount - 150000) * 0.24; // 24% for amounts above
    }
    
    return Math.round(apitTax * 100) / 100; // Round to 2 decimal places
}

// Display salary results
function displaySalaryResults(data) {
    document.getElementById('gross-salary').textContent = formatCurrency(data.grossSalary);
    document.getElementById('epf-employee').textContent = formatCurrency(data.epfEmployee);
    document.getElementById('epf-employer').textContent = formatCurrency(data.epfEmployer);
    document.getElementById('etf-employer').textContent = formatCurrency(data.etfEmployer);
    document.getElementById('apit-tax').textContent = formatCurrency(data.apitTax);
    document.getElementById('net-salary').textContent = formatCurrency(data.netSalary);
    document.getElementById('annual-net').textContent = formatCurrency(data.annualNet);
    
    document.getElementById('salary-results').style.display = 'block';
    
    // Smooth scroll to results
    document.getElementById('salary-results').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Enhanced Housing Loan Calculator
function calculateHousingLoan() {
    try {
        const loanAmount = validateInput(document.getElementById('house-loan-amount').value, 'loan amount');
        const annualRate = validateInput(document.getElementById('house-interest-rate').value, 'interest rate');
        const loanTermYears = validateInput(document.getElementById('house-loan-term').value, 'loan term');
        const downPayment = parseFloat(document.getElementById('house-down-payment').value) || 0;
        
        if (downPayment >= loanAmount) {
            throw new Error('Down payment cannot be greater than or equal to loan amount');
        }
        
        const actualLoanAmount = loanAmount - downPayment;
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = loanTermYears * 12;
        
        // Calculate monthly payment using EMI formula
        const monthlyPayment = calculateEMI(actualLoanAmount, monthlyRate, numberOfPayments);
        
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - actualLoanAmount;
        const totalCost = totalPayment + downPayment;
        
        // Store data for amortization schedule
        housingLoanData = {
            loanAmount: actualLoanAmount,
            monthlyPayment: monthlyPayment,
            monthlyRate: monthlyRate,
            numberOfPayments: numberOfPayments,
            downPayment: downPayment,
            originalLoanAmount: loanAmount
        };
        
        displayHousingLoanResults({
            loanAmount,
            downPayment,
            actualLoanAmount,
            monthlyPayment,
            totalInterest,
            totalCost,
            annualRate
        });
        
        // Track calculation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'housing_loan_calculated', {
                loan_amount: actualLoanAmount,
                monthly_payment: monthlyPayment
            });
        }
        
    } catch (error) {
        showError('Housing loan calculation error: ' + error.message);
    }
}

// Display housing loan results
function displayHousingLoanResults(data) {
    const resultsHTML = `
        <h3>Housing Loan Summary</h3>
        <div class="result-item">
            <span class="result-label">Property Value:</span>
            <span class="result-value">${formatCurrency(data.loanAmount)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Down Payment:</span>
            <span class="result-value">${formatCurrency(data.downPayment)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Loan Amount:</span>
            <span class="result-value">${formatCurrency(data.actualLoanAmount)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Monthly EMI:</span>
            <span class="result-value highlight">${formatCurrency(data.monthlyPayment)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Interest:</span>
            <span class="result-value">${formatCurrency(data.totalInterest)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Amount Payable:</span>
            <span class="result-value">${formatCurrency(data.totalCost)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Interest Rate:</span>
            <span class="result-value">${data.annualRate}% per annum</span>
        </div>
        <div class="result-item">
            <span class="result-label">Interest vs Principal Ratio:</span>
            <span class="result-value">${((data.totalInterest / data.actualLoanAmount) * 100).toFixed(1)}%</span>
        </div>
    `;
    
    document.getElementById('housing-results').innerHTML = resultsHTML;
    document.getElementById('housing-results').style.display = 'block';
    
    document.getElementById('housing-results').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Enhanced Personal Loan Calculator
function calculatePersonalLoan() {
    try {
        const loanAmount = validateInput(document.getElementById('personal-loan-amount').value, 'loan amount');
        const annualRate = validateInput(document.getElementById('personal-interest-rate').value, 'interest rate');
        const loanTermYears = validateInput(document.getElementById('personal-loan-term').value, 'loan term');
        const processingFee = parseFloat(document.getElementById('processing-fee').value) || 0;
        
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = loanTermYears * 12;
        
        const monthlyPayment = calculateEMI(loanAmount, monthlyRate, numberOfPayments);
        
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;
        const totalCost = totalPayment + processingFee;
        
        // Store data for amortization schedule
        personalLoanData = {
            loanAmount: loanAmount,
            monthlyPayment: monthlyPayment,
            monthlyRate: monthlyRate,
            numberOfPayments: numberOfPayments,
            processingFee: processingFee
        };
        
        displayPersonalLoanResults({
            loanAmount,
            processingFee,
            monthlyPayment,
            totalInterest,
            totalCost,
            annualRate,
            monthlyRate
        });
        
        // Track calculation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'personal_loan_calculated', {
                loan_amount: loanAmount,
                monthly_payment: monthlyPayment
            });
        }
        
    } catch (error) {
        showError('Personal loan calculation error: ' + error.message);
    }
}

// Display personal loan results
function displayPersonalLoanResults(data) {
    const resultsHTML = `
        <h3>Personal Loan Summary</h3>
        <div class="result-item">
            <span class="result-label">Loan Amount:</span>
            <span class="result-value">${formatCurrency(data.loanAmount)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Processing Fee:</span>
            <span class="result-value">${formatCurrency(data.processingFee)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Monthly EMI:</span>
            <span class="result-value highlight">${formatCurrency(data.monthlyPayment)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Interest:</span>
            <span class="result-value">${formatCurrency(data.totalInterest)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Cost (including fees):</span>
            <span class="result-value">${formatCurrency(data.totalCost)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Effective Monthly Rate:</span>
            <span class="result-value">${(data.monthlyRate * 100).toFixed(3)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">Annual Percentage Rate (APR):</span>
            <span class="result-value">${data.annualRate}%</span>
        </div>
    `;
    
    document.getElementById('personal-results').innerHTML = resultsHTML;
    document.getElementById('personal-results').style.display = 'block';
    
    document.getElementById('personal-results').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// EMI calculation using the standard formula
function calculateEMI(principal, monthlyRate, numberOfPayments) {
    if (monthlyRate === 0) {
        return principal / numberOfPayments;
    }
    
    const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(emi * 100) / 100;
}

// Enhanced Amortization Schedule Generator
function showAmortization(loanType) {
    try {
        let loanData;
        let containerId;
        
        if (loanType === 'housing') {
            loanData = housingLoanData;
            containerId = 'housing-amortization';
        } else {
            loanData = personalLoanData;
            containerId = 'personal-amortization';
        }
        
        if (!loanData.loanAmount) {
            showError('Please calculate the loan first');
            return;
        }
        
        generateAmortizationTable(loanData, containerId);
        
        // Track amortization view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'amortization_viewed', {
                loan_type: loanType
            });
        }
        
    } catch (error) {
        showError('Amortization calculation error: ' + error.message);
    }
}

// Generate detailed amortization table
function generateAmortizationTable(loanData, containerId) {
    let balance = loanData.loanAmount;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;
    
    const paymentsToShow = Math.min(loanData.numberOfPayments, 60);
    
    let scheduleHTML = `
        <h3>Loan Payment Schedule</h3>
        <div class="info">
            <strong>Payment Summary:</strong> Showing first ${paymentsToShow} payments out of ${loanData.numberOfPayments} total payments.
            Each payment of ${formatCurrency(loanData.monthlyPayment)} includes both principal and interest components.
        </div>
        <div style="overflow-x: auto;">
        <table class="amortization-table">
            <thead>
                <tr>
                    <th>Payment #</th>
                    <th>Payment Amount</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining Balance</th>
                    <th>Total Interest Paid</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 1; i <= paymentsToShow; i++) {
        const interestPayment = balance * loanData.monthlyRate;
        const principalPayment = loanData.monthlyPayment - interestPayment;
        balance = Math.max(0, balance - principalPayment);
        totalInterestPaid += interestPayment;
        totalPrincipalPaid += principalPayment;
        
        scheduleHTML += `
            <tr>
                <td>${i}</td>
                <td>${formatCurrency(loanData.monthlyPayment)}</td>
                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(balance)}</td>
                <td>${formatCurrency(totalInterestPaid)}</td>
            </tr>
        `;
    }
    
    if (loanData.numberOfPayments > 60) {
        scheduleHTML += `
            <tr style="background: #e9ecef; font-style: italic;">
                <td colspan="6" style="text-align: center; padding: 15px;">
                    ... showing first ${paymentsToShow} payments of ${loanData.numberOfPayments} total payments<br>
                    <small>Total interest over full term: ${formatCurrency(loanData.monthlyPayment * loanData.numberOfPayments - loanData.loanAmount)}</small>
                </td>
            </tr>
        `;
    }
    
    scheduleHTML += `
            </tbody>
        </table>
        </div>
        <div class="info" style="margin-top: 20px;">
            <strong>Key Insights:</strong>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Early payments have higher interest components</li>
                <li>Principal payments increase over time</li>
                <li>Total interest decreases with higher down payments</li>
                <li>Shorter loan terms result in higher EMI but lower total interest</li>
            </ul>
        </div>
    `;
    
    document.getElementById(containerId).innerHTML = scheduleHTML;
    document.getElementById(containerId).style.display = 'block';
    
    document.getElementById(containerId).scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Enhanced Expense Management with Pie Chart
function addExpense() {
    try {
        const category = document.getElementById('expense-category').value.trim();
        const amount = validateInput(document.getElementById('expense-amount').value, 'expense amount');
        
        if (!category) {
            throw new Error('Please enter a valid category name');
        }
        
        // Check for duplicate categories
        const existingExpense = expenses.find(exp => 
            exp.category.toLowerCase() === category.toLowerCase()
        );
        
        if (existingExpense) {
            if (confirm(`Category "${category}" already exists. Do you want to update the amount?`)) {
                existingExpense.amount = amount;
            } else {
                return;
            }
        } else {
            expenses.push({ category, amount });
        }
        
        updateExpenseList();
        
        // Clear inputs
        document.getElementById('expense-category').value = '';
        document.getElementById('expense-amount').value = '';
        
        // Focus back to category input for quick entry
        document.getElementById('expense-category').focus();
        
        // Track expense addition
        if (typeof gtag !== 'undefined') {
            gtag('event', 'expense_added', {
                category: category,
                amount: amount
            });
        }
        
    } catch (error) {
        showError('Add expense error: ' + error.message);
    }
}

function updateExpenseList() {
    const listContainer = document.getElementById('expense-list');
    
    if (expenses.length === 0) {
        listContainer.innerHTML = '';
        return;
    }
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    let listHTML = `
        <h3>Current Expenses (Total: ${formatCurrency(totalExpenses)})</h3>
        <div style="margin-bottom: 20px;">
    `;
    
    expenses.forEach((expense, index) => {
        const percentage = totalExpenses > 0 ? ((expense.amount / totalExpenses) * 100).toFixed(1) : 0;
        listHTML += `
            <div class="expense-item">
                <input type="text" value="${expense.category}" readonly title="Category: ${expense.category}">
                <input type="number" value="${expense.amount}" readonly title="Amount: ${formatCurrency(expense.amount)} (${percentage}%)">
                <button onclick="editExpense(${index})" title="Edit this expense" style="background: #28a745; margin-right: 5px;">Edit</button>
                <button onclick="removeExpense(${index})" title="Remove this expense">Remove</button>
            </div>
        `;
    });
    
    listHTML += '</div>';
    listContainer.innerHTML = listHTML;
}

function editExpense(index) {
    const expense = expenses[index];
    const newCategory = prompt('Enter new category name:', expense.category);
    const newAmount = prompt('Enter new amount:', expense.amount);
    
    if (newCategory && newAmount && !isNaN(parseFloat(newAmount))) {
        expenses[index] = {
            category: newCategory.trim(),
            amount: parseFloat(newAmount)
        };
        updateExpenseList();
        
        // Recalculate if results are showing
        if (document.getElementById('expense-results').style.display === 'block') {
            calculateExpenses();
        }
    }
}

function removeExpense(index) {
    if (confirm('Are you sure you want to remove this expense?')) {
        expenses.splice(index, 1);
        updateExpenseList();
        
        // Recalculate if results are showing
        if (document.getElementById('expense-results').style.display === 'block') {
            calculateExpenses();
        }
        
        // Hide chart if no expenses
        if (expenses.length === 0) {
            hideExpenseChart();
        }
    }
}

function clearExpenses() {
    if (expenses.length === 0) {
        showError('No expenses to clear');
        return;
    }
    
    if (confirm('Are you sure you want to clear all expenses?')) {
        expenses = [];
        updateExpenseList();
        document.getElementById('expense-results').style.display = 'none';
        hideExpenseChart();
    }
}

// Enhanced Budget Calculator with Pie Chart and Supermarket Integration
function calculateExpenses() {
    try {
        const monthlyIncome = validateInput(document.getElementById('monthly-income').value, 'monthly income');
        
        if (expenses.length === 0) {
            throw new Error('Please add some expenses first');
        }
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingAmount = monthlyIncome - totalExpenses;
        const savingsRate = (remainingAmount / monthlyIncome) * 100;
        const expenseRatio = (totalExpenses / monthlyIncome) * 100;
        
        displayBudgetResults({
            monthlyIncome,
            totalExpenses,
            remainingAmount,
            savingsRate,
            expenseRatio
        });
        
        // Create/Update pie chart
        createExpensePieChart();
        
        // Update supermarket offers display if not already shown
        if (!document.getElementById('supermarket-offers')) {
            addSupermarketOffersToExpenseSection();
        }
        updateSupermarketOffersDisplay();
        
        // Track budget calculation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'budget_calculated', {
                monthly_income: monthlyIncome,
                total_expenses: totalExpenses,
                savings_rate: savingsRate
            });
        }
        
    } catch (error) {
        showError('Budget calculation error: ' + error.message);
    }
}

// Add supermarket offers section to expense planner
function addSupermarketOffersToExpenseSection() {
    const expenseResults = document.getElementById('expense-results');
    if (expenseResults) {
        const offersHTML = '<div id="supermarket-offers" class="supermarket-offers"></div>';
        expenseResults.insertAdjacentHTML('afterend', offersHTML);
    }
}

// Update expense results with supermarket savings
function updateExpenseResultsWithSavings() {
    if (document.getElementById('expense-results').style.display === 'block') {
        calculateExpenses();
    }
}

function displayBudgetResults(data) {
    let resultsHTML = `
        <h3>Budget Analysis Summary</h3>
        <div class="result-item">
            <span class="result-label">Monthly Income:</span>
            <span class="result-value">${formatCurrency(data.monthlyIncome)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Expenses:</span>
            <span class="result-value">${formatCurrency(data.totalExpenses)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Expense Ratio:</span>
            <span class="result-value">${data.expenseRatio.toFixed(1)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">Remaining Amount:</span>
            <span class="result-value ${data.remainingAmount >= 0 ? 'highlight' : ''}" 
                  style="${data.remainingAmount < 0 ? 'color: #dc3545; font-weight: bold;' : ''}">
                ${formatCurrency(data.remainingAmount)}
            </span>
        </div>
    `;
    
    // Add potential savings from supermarket offers
    if (potentialSavings > 0) {
        const adjustedRemaining = data.remainingAmount + potentialSavings;
        const adjustedSavingsRate = (adjustedRemaining / data.monthlyIncome) * 100;
        
        resultsHTML += `
            <div class="result-item" style="border-top: 2px solid #28a745; padding-top: 15px; margin-top: 15px;">
                <span class="result-label">💰 Supermarket Savings:</span>
                <span class="result-value" style="color: #28a745; font-weight: bold;">
                    +${formatCurrency(potentialSavings)}
                </span>
            </div>
            <div class="result-item">
                <span class="result-label">📈 Improved Remaining Amount:</span>
                <span class="result-value highlight">
                    ${formatCurrency(adjustedRemaining)}
                </span>
            </div>
            <div class="result-item">
                <span class="result-label">📊 Improved Savings Rate:</span>
                <span class="result-value highlight">
                    ${adjustedSavingsRate.toFixed(1)}%
                </span>
            </div>
        `;
    }
    
    resultsHTML += `
        <div class="result-item">
            <span class="result-label">Savings Rate:</span>
            <span class="result-value ${data.savingsRate >= 20 ? 'highlight' : ''}" 
                  style="${data.savingsRate < 0 ? 'color: #dc3545; font-weight: bold;' : ''}">
                ${data.savingsRate.toFixed(1)}%
            </span>
        </div>
    `;
    
    // Detailed expense breakdown
    resultsHTML += '<h4>Detailed Expense Breakdown</h4>';
    const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    
    sortedExpenses.forEach(expense => {
        const expensePercentage = (expense.amount / data.totalExpenses) * 100;
        const incomePercentage = (expense.amount / data.monthlyIncome) * 100;
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">${expense.category}:</span>
                <span class="result-value">
                    ${formatCurrency(expense.amount)} 
                    <small>(${expensePercentage.toFixed(1)}% of expenses, ${incomePercentage.toFixed(1)}% of income)</small>
                </span>
            </div>
        `;
    });
    
    // Financial health analysis with supermarket savings consideration
    resultsHTML += '<h4>Financial Health Analysis</h4>';
    
    const effectiveSavingsRate = potentialSavings > 0 ? 
        ((data.remainingAmount + potentialSavings) / data.monthlyIncome) * 100 : 
        data.savingsRate;
    
    if (data.savingsRate < 0) {
        resultsHTML += `<div class="warning">
            <strong>⚠️ Budget Deficit Alert:</strong> Your expenses exceed your income by ${formatCurrency(Math.abs(data.remainingAmount))}. 
            ${potentialSavings > 0 ? `However, with supermarket savings of ${formatCurrency(potentialSavings)}, you could reduce this deficit to ${formatCurrency(Math.abs(data.remainingAmount - potentialSavings))}.` : 'This is unsustainable and requires immediate attention. Consider reducing discretionary expenses or finding additional income sources.'}
        </div>`;
    } else if (effectiveSavingsRate < 10) {
        resultsHTML += `<div class="warning">
            <strong>💡 Low Savings Rate:</strong> Your ${potentialSavings > 0 ? 'improved' : ''} savings rate of ${effectiveSavingsRate.toFixed(1)}% is ${effectiveSavingsRate < 10 ? 'still below' : 'approaching'} the recommended minimum of 10%. 
            ${potentialSavings > 0 ? 'Great job selecting supermarket offers! ' : ''}Try to reduce expenses or increase income to build financial security.
        </div>`;
    } else if (effectiveSavingsRate >= 20) {
        resultsHTML += `<div class="info">
            <strong>✅ Excellent Financial Health:</strong> Your ${potentialSavings > 0 ? 'improved' : ''} savings rate of ${effectiveSavingsRate.toFixed(1)}% is outstanding! 
            ${potentialSavings > 0 ? `Your smart use of supermarket discounts is saving you ${formatCurrency(potentialSavings)} monthly. ` : ''}You're building a strong financial foundation for the future.
        </div>`;
    } else {
        resultsHTML += `<div class="info">
            <strong>👍 Good Financial Health:</strong> Your ${potentialSavings > 0 ? 'improved' : ''} savings rate of ${effectiveSavingsRate.toFixed(1)}% is healthy. 
            ${potentialSavings > 0 ? `Your supermarket savings of ${formatCurrency(potentialSavings)} are helping boost your financial health. ` : ''}Consider aiming for 20% or higher for even better financial security.
        </div>`;
    }
    
    // Advanced financial insights
    resultsHTML += '<h4>Financial Planning Insights</h4>';
    const effectiveRemaining = data.remainingAmount + potentialSavings;
    resultsHTML += `
        <div class="result-item">
            <span class="result-label">Annual Savings Potential:</span>
            <span class="result-value">${formatCurrency(effectiveRemaining * 12)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Emergency Fund Target (6 months):</span>
            <span class="result-value">${formatCurrency(data.totalExpenses * 6)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Retirement Fund Target (25x annual expenses):</span>
            <span class="result-value">${formatCurrency(data.totalExpenses * 12 * 25)}</span>
        </div>
    `;
    
    // Expense optimization suggestions
    if (effectiveSavingsRate < 15) {
        resultsHTML += `<div class="info">
            <strong>💡 Optimization Suggestions:</strong>
            <ul style="margin: 10px 0 0 20px;">
                <li>Review your highest expense categories for potential reductions</li>
                <li>Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                <li>Look for subscription services you can cancel</li>
                <li>Negotiate bills (internet, phone, insurance)</li>
                <li>Use supermarket discount offers to reduce grocery costs</li>
                <li>Consider additional income sources</li>
            </ul>
        </div>`;
    }
    
    document.getElementById('expense-results').innerHTML = resultsHTML;
    document.getElementById('expense-results').style.display = 'block';
    
    document.getElementById('expense-results').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Create interactive pie chart using Chart.js with enhanced features
function createExpensePieChart() {
    const chartContainer = document.getElementById('expense-chart-container');
    const canvas = document.getElementById('expenseChart');
    
    if (!canvas || expenses.length === 0) {
        hideExpenseChart();
        return;
    }
    
    // Destroy existing chart if it exists
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    // Prepare data for the chart
    const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    const labels = sortedExpenses.map(expense => expense.category);
    const data = sortedExpenses.map(expense => expense.amount);
    const totalExpenses = data.reduce((sum, amount) => sum + amount, 0);
    
    // Generate colors for each slice
    const colors = generateChartColors(data.length);
    
    const ctx = canvas.getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverBorderColor: '#fff',
                hoverBackgroundColor: colors.map(color => color + 'DD') // Add transparency on hover
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'Segoe UI, Arial, sans-serif'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const percentage = ((value / totalExpenses) * 100).toFixed(1);
                                return {
                                    text: `${label} (${percentage}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].borderColor,
                                    lineWidth: data.datasets[0].borderWidth,
                                    pointStyle: 'circle',
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: {
                        size: 14,
                        family: 'Segoe UI, Arial, sans-serif'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Segoe UI, Arial, sans-serif'
                    },
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = ((value / totalExpenses) * 100).toFixed(1);
                            return [
                                `${label}: ${formatCurrency(value)}`,
                                `${percentage}% of total expenses`
                            ];
                        },
                        afterLabel: function(context) {
                            const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
                            if (monthlyIncome > 0) {
                                const incomePercentage = ((context.raw / monthlyIncome) * 100).toFixed(1);
                                return `${incomePercentage}% of income`;
                            }
                            return '';
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1200,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'point'
            },
            onHover: (event, activeElements) => {
                event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        }
    });
    
    chartContainer.style.display = 'block';
    
    // Smooth scroll to chart
    setTimeout(() => {
        chartContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 100);
}

// Generate attractive colors for pie chart
function generateChartColors(count) {
    const baseColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
        if (i < baseColors.length) {
            colors.push(baseColors[i]);
        } else {
            // Generate additional colors if needed
            const hue = (i * 137.5) % 360; // Golden angle approximation
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
    }
    
    return colors;
}

function hideExpenseChart() {
    const chartContainer = document.getElementById('expense-chart-container');
    if (chartContainer) {
        chartContainer.style.display = 'none';
    }
    
    if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
    }
}

// Utility Functions
function validateInput(value, fieldName, min = 0) {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < min) {
        throw new Error(`Please enter a valid ${fieldName} (minimum: ${min})`);
    }
    return numValue;
}

function formatCurrency(amount) {
    return `LKR ${Math.round(amount).toLocaleString('en-US')}`;
}

function showError(message) {
    alert('Error: ' + message);
    console.error('Calculator Error:', message);
}

function showSuccess(message) {
    // You can implement a custom success notification here
    console.log('Success:', message);
}

// Demo data loader for testing
function loadDemoData() {
    // Sample salary data
    document.getElementById('basic-salary').value = '120000';
    document.getElementById('allowances').value = '30000';
    
    // Sample housing loan data
    document.getElementById('house-loan-amount').value = '8000000';
    document.getElementById('house-interest-rate').value = '12.5';
    document.getElementById('house-loan-term').value = '25';
    document.getElementById('house-down-payment').value = '1600000';
    
    // Sample personal loan data
    document.getElementById('personal-loan-amount').value = '500000';
    document.getElementById('personal-interest-rate').value = '18.5';
    document.getElementById('personal-loan-term').value = '5';
    document.getElementById('processing-fee').value = '15000';
    
    // Sample expense data
    document.getElementById('monthly-income').value = '110000';
    expenses = [
        { category: 'Housing (Rent/Mortgage)', amount: 35000 },
        { category: 'Food & Groceries', amount: 20000 },
        { category: 'Transportation', amount: 15000 },
        { category: 'Utilities (Electric/Water/Internet)', amount: 8000 },
        { category: 'Healthcare & Insurance', amount: 5000 },
        { category: 'Entertainment & Dining', amount: 8000 },
        { category: 'Savings & Investments', amount: 15000 },
        { category: 'Clothing & Personal Care', amount: 4000 }
    ];
    updateExpenseList();
    
    showSuccess('Demo data loaded successfully!');
}

// Export/Import functionality (future enhancement)
function exportBudget() {
    const budgetData = {
        expenses: expenses,
        monthlyIncome: document.getElementById('monthly-income').value,
        selectedOffers: selectedOffers,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(budgetData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sri-lanka-budget-export.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Keyboard shortcuts (future enhancement)
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to calculate in active form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeSection = document.querySelector('.calculator-section.active');
        if (activeSection) {
            const calculateButton = activeSection.querySelector('.btn[onclick*="calculate"]');
            if (calculateButton) {
                calculateButton.click();
                e.preventDefault();
            }
        }
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}