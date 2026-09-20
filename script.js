let money = 1000;
let employees = 1;
let reputation = 50;

function updateUI() {
  document.getElementById("money").innerText = money;
  document.getElementById("employees").innerText = employees;
  document.getElementById("reputation").innerText = reputation;
}

function log(message) {
  const li = document.createElement("li");
  li.textContent = message;
  document.getElementById("logList").prepend(li);
}

function developProduct() {
  let cost = 200;
  if (money >= cost) {
    money -= cost;
    let success = Math.random();

    if (success > 0.5) {
      let profit = Math.floor(Math.random() * 500 + 200);
      money += profit;
      reputation += 5;
      log("✅ Produkt sukces! Zarobiłeś " + profit);
    } else {
      reputation -= 5;
      log("❌ Produkt flop...");
    }
  } else {
    log("❗ Za mało pieniędzy");
  }

  updateUI();
}

function hireEmployee() {
  let cost = 300;

  if (money >= cost) {
    money -= cost;
    employees += 1;
    log("👨‍💻 Zatrudniono pracownika");
  } else {
    log("❗ Za mało pieniędzy");
  }

  updateUI();
}

function marketing() {
  let cost = 150;

  if (money >= cost) {
    money -= cost;
    let boost = Math.floor(Math.random() * 10 + 5);
    reputation += boost;
    log("📢 Kampania marketingowa +"+boost+" reputacji");
  } else {
    log("❗ Za mało pieniędzy");
  }

  updateUI();
}

function nextTurn() {
  // dochód pasywny
  let income = employees * 50;
  money += income;

  // losowe wydarzenie
  let event = Math.random();

  if (event > 0.7) {
    let loss = Math.floor(Math.random() * 200);
    money -= loss;
    log("⚠️ Kryzys! Straciłeś " + loss);
  } else if (event < 0.3) {
    let bonus = Math.floor(Math.random() * 300);
    money += bonus;
    log("🔥 Viral! Zarobiłeś " + bonus);
  }

  updateUI();
}

updateUI();
