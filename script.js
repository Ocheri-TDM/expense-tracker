const form = document.getElementById("expenseForm");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const totalAmount = document.getElementById("totalAmount");
const categorySummary = document.getElementById("categorySummary");
const expenseList = document.getElementById("expenseList");
const emptyMessage = document.getElementById("emptyMessage");

const STORAGE_KEY = "expenses";

let expenses = loadExpenses();

dateInput.valueAsDate = new Date();

render();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const expense = {
    id: Date.now(),
    category: categoryInput.value,
    amount: Number(amountInput.value),
    date: dateInput.value,
    description: descriptionInput.value.trim()
  };

  expenses.push(expense);
  saveExpenses();
  render();

  form.reset();
  dateInput.valueAsDate = new Date();
});

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData;
  } catch (error) {
    console.error("Ошибка чтения localStorage:", error);
    return [];
  }
}

function deleteExpense(id) {
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });

  saveExpenses();
  render();
}

function render() {
  renderTotal();
  renderCategorySummary();
  renderExpenseList();
}

function renderTotal() {
  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  totalAmount.textContent = total.toLocaleString("ru-RU") + " ₸";
}

function renderCategorySummary() {
  categorySummary.innerHTML = "";

  const categories = {};

  expenses.forEach(function (expense) {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }

    categories[expense.category] += expense.amount;
  });

  for (let category in categories) {
    const card = document.createElement("div");
    card.className = "summary-card";

    card.innerHTML = `
      <strong>${category}</strong>
      <span>${categories[category].toLocaleString("ru-RU")} ₸</span>
    `;

    categorySummary.appendChild(card);
  }

  if (expenses.length === 0) {
    categorySummary.innerHTML = `<div class="summary-card">Пока нет расходов</div>`;
  }
}

function renderExpenseList() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  expenses.forEach(function (expense) {
    const item = document.createElement("div");
    item.className = "expense-item";

    item.innerHTML = `
      <div class="expense-info">
        <span class="expense-category">${expense.category}</span>
        <span>${expense.date}</span>
        <span>${expense.description || "Без описания"}</span>
      </div>

      <div>
        <div class="expense-amount">${expense.amount.toLocaleString("ru-RU")} ₸</div>
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">Удалить</button>
      </div>
    `;

    expenseList.appendChild(item);
  });
}