
const transactionTitle = document.getElementById("transactionTitle");
const transactionAmount = document.getElementById("transactionAmount");
const transactionType = document.getElementById("transactionType");
const transactionCategory = document.getElementById("transactionCategory");
const transactionDate = document.getElementById("transactionDate");
const addTransactionBtn = document.getElementById("addTransactionBtn");
const transactionList = document.getElementById("transactionList");


const transactions = [];

addTransactionBtn.addEventListener("click", function () {
    if (
        transactionTitle.value.trim() === "" ||
        transactionAmount.value === "" ||
        transactionType.value === "" ||
        transactionCategory.value.trim() === "" ||
        transactionDate.value === ""
    ) {
        alert("Please fill in all fields before adding a transaction.");
    } else if (parseFloat(transactionAmount.value) <= 0) {
        alert("Please enter a valid amount greater than 0.");
    } else {
        
        const transaction = {
            title: transactionTitle.value.trim(),
            amount: parseFloat(transactionAmount.value),
            type: transactionType.value,
            category: transactionCategory.value.trim(),
            date: transactionDate.value
        };

        
        transactions.push(transaction);
        renderTransactions();
       
        transactionTitle.value = "";
        transactionAmount.value = "";
        transactionCategory.value = "";
        transactionDate.value = "";
        transactionType.selectedIndex = 0;

        
        console.log(transactions);
    }
});

function renderTransactions() {
    
    transactionList.innerHTML = "";

    
    transactions.forEach(function (transaction) {

       
        const transactionItem = document.createElement("div");
        transactionItem.className = "transaction-item";

        
        const transactionInfo = document.createElement("div");
        transactionInfo.className = "transaction-info";

        
        const transactionAmountDisplay = document.createElement("div");
        transactionAmountDisplay.className = "transaction-amount";

        
        const transactionTitle = document.createElement("h3");
        transactionTitle.textContent = transaction.title;

        
        const transactionCategory = document.createElement("p");
        transactionCategory.textContent =
            `${transaction.category} - ${transaction.date}`;

       
        transactionInfo.appendChild(transactionTitle);
        transactionInfo.appendChild(transactionCategory);

        
        const sign = transaction.type === "income" ? "+" : "−";

        
        transactionAmountDisplay.textContent =
            `${sign}₹${transaction.amount.toLocaleString("en-IN")}`;

       
        transactionAmountDisplay.classList.add(transaction.type);

        
        transactionItem.appendChild(transactionInfo);
        transactionItem.appendChild(transactionAmountDisplay);

        
        transactionList.appendChild(transactionItem);
    });
}
