<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prosty POS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-slate-800 h-screen flex flex-col overflow-hidden">

    <!-- Górny pasek -->
    <header class="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 class="text-xl font-bold">System POS</h1>
        <div class="flex gap-4">
            <button onclick="switchTab('pos')" id="btn-pos" class="bg-indigo-700 px-4 py-2 rounded-lg font-medium transition">Kasjer</button>
            <button onclick="switchTab('admin')" id="btn-admin" class="bg-indigo-500 px-4 py-2 rounded-lg font-medium transition">Produkty</button>
        </div>
    </header>

    <!-- Główna zawartość -->
    <main class="flex-1 flex overflow-hidden">

        <!-- KASA / POS -->
        <div id="tab-pos" class="flex-1 flex w-full">
            <!-- Siatka produktów -->
            <div class="flex-1 p-6 overflow-y-auto">
                <div id="products-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!-- Dynamiczne karty produktów -->
                </div>
            </div>

            <!-- Panel koszyka -->
            <div class="w-96 bg-white border-l border-slate-200 flex flex-col shadow-lg">
                <div class="p-4 border-b border-slate-200 font-bold text-lg bg-slate-50">Aktualne zamówienie</div>
                
                <div id="cart-items" class="flex-1 p-4 overflow-y-auto divide-y divide-slate-100">
                    <!-- Dynamiczne elementy koszyka -->
                    <p class="text-slate-400 text-center py-8">Koszyk jest pusty</p>
                </div>

                <div class="p-4 bg-slate-50 border-t border-slate-200">
                    <div class="flex justify-between text-lg font-bold mb-4">
                        <span>Do zapłaty:</span>
                        <span id="cart-total" class="text-indigo-600">0.00 zł</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="checkout('Gotówka')" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition">Gotówka</button>
                        <button onclick="checkout('Karta')" class="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition">Karta</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- PANEL ZARZĄDZANIA PRODUKTAMI -->
        <div id="tab-admin" class="flex-1 p-8 overflow-y-auto hidden bg-white">
            <h2 class="text-2xl font-bold mb-6">Zarządzanie produktami</h2>
            
            <form id="product-form" onsubmit="addProduct(event)" class="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 max-w-xl">
                <h3 class="font-semibold text-lg mb-4">Dodaj nowy produkt</h3>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Nazwa produktu</label>
                    <input type="text" id="p-name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Cena (zł)</label>
                    <input type="number" step="0.01" id="p-price" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">Dodaj produkt</button>
            </form>

            <h3 class="font-semibold text-lg mb-4">Lista produktów</h3>
            <div class="max-w-xl overflow-hidden border border-slate-200 rounded-xl">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th class="p-3">Nazwa</th>
                            <th class="p-3">Cena</th>
                            <th class="p-3 text-right">Akcja</th>
                        </tr>
                    </thead>
                    <tbody id="admin-products-table" class="divide-y divide-slate-100">
                        <!-- Dynamiczna tabela -->
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <script>
        // Domyślne produkty startowe
        const defaultProducts = [
            { id: 1, name: 'Kawa Espresso', price: 9.00 },
            { id: 2, name: 'Kawa Latte', price: 14.00 },
            { id: 3, name: 'Herbata Czarna', price: 8.00 },
            { id: 4, name: 'Sok Pomarańczowy', price: 10.00 },
            { id: 5, name: 'Ciastko Czekoladowe', price: 12.00 },
            { id: 6, name: 'Kanapka z szynką', price: 16.50 }
        ];

        let products = JSON.parse(localStorage.getItem('pos_products')) || defaultProducts;
        let cart = [];

        function saveProducts() {
            localStorage.setItem('pos_products', JSON.stringify(products));
        }

        // Przełączanie zakładek
        function switchTab(tab) {
            document.getElementById('tab-pos').classList.toggle('hidden', tab !== 'pos');
            document.getElementById('tab-admin').classList.toggle('hidden', tab !== 'admin');
            
            document.getElementById('btn-pos').className = tab === 'pos' ? 'bg-indigo-700 px-4 py-2 rounded-lg font-medium transition' : 'bg-indigo-500 px-4 py-2 rounded-lg font-medium transition';
            document.getElementById('btn-admin').className = tab === 'admin' ? 'bg-indigo-700 px-4 py-2 rounded-lg font-medium transition' : 'bg-indigo-500 px-4 py-2 rounded-lg font-medium transition';

            if(tab === 'pos') renderProducts();
            if(tab === 'admin') renderAdminTable();
        }

        // Renderowanie produktów w kasie
        function renderProducts() {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = '';
            products.forEach(p => {
                grid.innerHTML += `
                    <div onclick="addToCart(${p.id})" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition flex flex-col justify-between h-32">
                        <span class="font-semibold text-slate-700">${p.name}</span>
                        <span class="text-xl font-bold text-indigo-600">${p.price.toFixed(2)} zł</span>
                    </div>
                `;
            });
        }

        // Logika koszyka
        function addToCart(id) {
            const product = products.find(p => p.id === id);
            const existing = cart.find(item => item.id === id);
            
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ ...product, qty: 1 });
            }
            renderCart();
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            renderCart();
        }

        function renderCart() {
            const container = document.getElementById('cart-items');
            const totalEl = document.getElementById('cart-total');
            
            if (cart.length === 0) {
                container.innerHTML = `<p class="text-slate-400 text-center py-8">Koszyk jest pusty</p>`;
                totalEl.textContent = '0.00 zł';
                return;
            }

            container.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.qty;
                container.innerHTML += `
                    <div class="py-3 flex justify-between items-center">
                        <div>
                            <div class="font-medium text-slate-800">${item.name}</div>
                            <div class="text-xs text-slate-400">${item.qty} × ${item.price.toFixed(2)} zł</div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="font-semibold"> ${(item.price * item.qty).toFixed(2)} zł</span>
                            <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 font-bold">&times;</button>
                        </div>
                    </div>
                `;
            });

            totalEl.textContent = total.toFixed(2) + ' zł';
        }

        function checkout(method) {
            if (cart.length === 0) return alert('Koszyk jest pusty!');
            alert(`Zamówienie opłacone pomyślnie (${method})!`);
            cart = [];
            renderCart();
        }

        // Panel Admina - Tabela i Dodawanie
        function renderAdminTable() {
            const tbody = document.getElementById('admin-products-table');
            tbody.innerHTML = '';
            products.forEach(p => {
                tbody.innerHTML += `
                    <tr class="border-b border-slate-100">
                        <td class="p-3">${p.name}</td>
                        <td class="p-3">${p.price.toFixed(2)} zł</td>
                        <td class="p-3 text-right">
                            <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:text-red-700 font-medium text-sm">Usuń</button>
                        </td>
                    </tr>
                `;
            });
        }

        function addProduct(e) {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = parseFloat(document.getElementById('p-price').value);

            const newProduct = {
                id: Date.now(),
                name,
                price
            };

            products.push(newProduct);
            saveProducts();
            renderAdminTable();
            
            document.getElementById('product-form').reset();
        }

        function deleteProduct(id) {
            products = products.filter(p => p.id !== id);
            saveProducts();
            renderAdminTable();
        }

        // Inicjalizacja widoku
        renderProducts();
    </script>
</body>
</html>
