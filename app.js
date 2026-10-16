
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

// Generate a unique ID for each transaction
function generateTransactionId() {
    return Date.now() + Math.random();
}

// Load saved transactions from LocalStorage
function loadTransactions() {
    try {
        const saved = localStorage.getItem("spendytransactions");
        const parsed = saved ? JSON.parse(saved) : [];

        transactions = Array.isArray(parsed) ? parsed : [];

        // Give IDs to older transactions that don't have one
        let updatedIds = false;

        transactions = transactions.map(function (transaction) {
            if (transaction.id === undefined || transaction.id === null) {
                updatedIds = true;

                return {
                    ...transaction,
                    id: generateTransactionId()
                };
            }

            return transaction;
        });

        if (updatedIds) {
            saveTransactions();
        }
    } catch (error) {
        console.error("Error loading transactions:", error);
        transactions = [];
    }

    renderTransactions();
    updateSummary();
}

// Save transactions to LocalStorage
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

// Add a new transaction
addTransactionBtn.addEventListener("click", function () {
    const title = transactionTitle.value.trim();
    const amountText = transactionAmount.value.trim();
    const amount = Number(amountText);
    const type = transactionType.value;
    const category = transactionCategory.value.trim();
    const date = transactionDate.value;

    // Validate required fields
    if (!title || !amountText || !type || !category || !date) {
        alert("Please fill in all fields before adding a transaction.");
        return;
    }

    // Validate amount
    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }

    // Create transaction object
    const transaction = {
        id: generateTransactionId(),
        title: title,
        amount: amount,
        type: type,
        category: category,
        date: date
    };

    // Update application data
    transactions.push(transaction);

    // Save updated data
    saveTransactions();

    // Refresh the interface
    renderTransactions();
    updateSummary();

    // Clear the form
    transactionTitle.value = "";
    transactionAmount.value = "";
    transactionCategory.value = "";
    transactionDate.value = "";
    transactionType.selectedIndex = 0;

    console.log("Transaction added:", transaction);
});

// Display all transactions
function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
        // Create transaction row
        const item = document.createElement("div");
        item.className = "transaction-item";

        // Create transaction information
        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("h3");
        title.textContent = transaction.title;

        const details = document.createElement("p");
        details.textContent =
            `${transaction.category} - ${transaction.date}`;

        info.appendChild(title);
        info.appendChild(details);

        // Create amount display
        const amount = document.createElement("div");
        amount.className = "transaction-amount";

        const sign = transaction.type === "income" ? "+" : "−";

        amount.textContent =
            `${sign}₹${Number(transaction.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;

        amount.classList.add(transaction.type);

        // Create a separate Delete button for this transaction
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = String(transaction.id);

        // Delete the selected transaction
        deleteBtn.addEventListener("click", function () {
            const id = Number(deleteBtn.dataset.id);

            transactions = transactions.filter(function (t) {
                return t.id !== id;
            });

            saveTransactions();
            renderTransactions();
            updateSummary();
        });

        // Assemble the complete transaction row
        item.appendChild(info);
        item.appendChild(amount);
        item.appendChild(deleteBtn);

        transactionList.appendChild(item);
    });
}

// Calculate income, expenses, and balance
function updateSummary() {
    const income = transactions
        .filter(function (t) {
            return t.type === "income";
        })
        .reduce(function (sum, t) {
            return sum + Number(t.amount);
        }, 0);

    const expense = transactions
        .filter(function (t) {
            return t.type === "expense";
        })
        .reduce(function (sum, t) {
            return sum + Number(t.amount);
        }, 0);

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

// Initialize the dashboard
loadTransactions();
