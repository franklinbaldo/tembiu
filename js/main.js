console.log("Tembiu main.js loaded.");

document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});

async function loadMenu() {
    try {
        const response = await fetch('menu.csv');
        if (!response.ok) {
            console.error('Failed to load menu.csv:', response.statusText);
            document.getElementById('menu-container').innerHTML = '<p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
            return;
        }
        const csvData = await response.text();
        const menuItems = parseCSV(csvData);
        
        console.log("Menu Items Loaded:", menuItems);
        // For now, just log. Later, this will render items to the DOM.
        if (menuItems.length > 0) {
            // Clear the "Carregando cardápio..." message
            document.getElementById('menu-container').innerHTML = ''; 
            
            // Example: Display item names
            const menuContainer = document.getElementById('menu-container');
            const ul = document.createElement('ul');
            menuItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.nome} (${item.categoria}): R$ ${item.preco}`;
                ul.appendChild(li);
            });
            menuContainer.appendChild(ul);

        } else {
            document.getElementById('menu-container').innerHTML = '<p>Nenhum item encontrado no cardápio.</p>';
        }

    } catch (error) {
        console.error('Error fetching or parsing menu.csv:', error);
        document.getElementById('menu-container').innerHTML = '<p>Ocorreu um erro inesperado ao carregar o cardápio.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        console.warn("CSV has no data rows.");
        return []; // No data rows
    }
    
    const headers = lines[0].split(',');
    const items = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const item = {};
            headers.forEach((header, index) => {
                item[header.trim()] = values[index].trim();
            });
            items.push(item);
        } else {
            console.warn(`Skipping malformed CSV line: ${lines[i]}`);
        }
    }
    return items;
}
