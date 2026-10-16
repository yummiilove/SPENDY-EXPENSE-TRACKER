
const transactionTitle = document.getElementById("transactionTitle");
const transactionAmount = document.getElementById("transactionAmount");
const transactionType = document.getElementById("transactionType");
const transactionCategory = document.getElementById("transactionCategory");
const transactionDate = document.getElementById("transactionDate");
const addTransactionBtn = document.getElementById("addTransactionBtn");
const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const totalBalance = document.getElementById("totalBalance");

let transactions = [];

// Load saved transactions
function loadTransactions() {
    try {
        const saved = localStorage.getItem("spendytransactions");
        const parsed = saved ? JSON.parse(saved) : [];

        transactions = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Error loading transactions:", error);
        transactions = [];
    }

    renderTransactions();
    updateSummary();
}

// Save transactions
function saveTransactions() {
    try {
        localStorage.setItem(
            "spendytransactions",
            JSON.stringify(transactions)
        );
    } catch (error) {
        console.error("Error saving transactions:", error);
        alert("Unable to save transactions in browser storage.");
    }
}

// Add a transaction
addTransactionBtn.addEventListener("click", function () {
    const title = transactionTitle.value.trim();
    const amountText = transactionAmount.value.trim();
    const amount = Number(amountText);
    const type = transactionType.value;
    const category = transactionCategory.value.trim();
    const date = transactionDate.value;

    if (!title || !amountText || !type || !category || !date) {
        alert("Please fill in all fields before adding a transaction.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }

    const transaction = {
        id: Date.now() + Math.random(),
        title: title,
        amount: amount,
        type: type,
        category: category,
        date: date
    };

    transactions.push(transaction);

    // Clear the form
    transactionTitle.value = "";
    transactionAmount.value = "";
    transactionCategory.value = "";
    transactionDate.value = "";
    transactionType.selectedIndex = 0;

    // Update the dashboard
    saveTransactions();
    renderTransactions();
    updateSummary();

    console.log("Transaction added:", transaction);
});

// Display transactions
function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
        const item = document.createElement("div");
        item.className = "transaction-item";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("h3");
        title.textContent = transaction.title;

        const details = document.createElement("p");
        details.textContent =
            `${transaction.category} - ${transaction.date}`;

        info.appendChild(title);
        info.appendChild(details);

        const amount = document.createElement("div");
        amount.className = "transaction-amount";

        const sign = transaction.type === "income" ? "+" : "−";

        amount.textContent =
            `${sign}₹${Number(transaction.amount).toLocaleString("en-IN")}`;

        amount.classList.add(transaction.type);

        item.appendChild(info);
        item.appendChild(amount);
        transactionList.appendChild(item);
    });
}

// Calculate summary
function updateSummary() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expense;

    totalIncome.textContent =
        `₹${income.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    totalExpense.textContent =
        `₹${expense.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    totalBalance.textContent =
        `${balance < 0 ? "−" : ""}₹${Math.abs(balance).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    totalBalance.style.color =
        balance < 0 ? "#CD5C5C" : "#a3ff6f";
}

// Initialize dashboard
loadTransactions();
