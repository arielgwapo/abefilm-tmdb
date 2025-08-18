document.addEventListener('DOMContentLoaded', () => {
    let attempts = 0;
    const maxAttempts = 50;
    const interval = setInterval(() => {
        if (window.apiKey) {
            clearInterval(interval);
            initializeSearch(window.apiKey);
        } else if (attempts++ >= maxAttempts) {
            clearInterval(interval);
            console.error("Search could not be initialized: API Key (window.apiKey) was not found.");
        }
    }, 100);
});

function initializeSearch(apiKey) {
    // --- CONFIGURATION ---
    const API_KEY = apiKey;
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMG_URL = "https://image.tmdb.org/t/p/w92";
    const HISTORY_KEY = "tmdb_search_history_v2";
    const MAX_HISTORY_ITEMS = 3;

    const POPULAR_SEARCHES = [
        "Harmony Secret", "Legend of the Female General", "The Best Thing",
        "Secret Lover", "Coroner's Diary", "A Dream Within A Dream",
        "The Next Prince", "Falling Into Your Smile", "My Boss", "Amidst a Snowstorm of Love"
    ];

    // --- ELEMENT SELECTORS ---
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const searchDropdown = document.getElementById('search-results');

    if (!searchContainer || !searchInput || !searchDropdown) return;

    let debounceTimer;

    // --- HISTORY MANAGEMENT ---
    const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const saveToHistory = (query) => {
        if (!query) return;
        let history = getHistory().filter(item => item.toLowerCase() !== query.toLowerCase());
        history.unshift(query);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));
    };
    const removeFromHistory = (query) => {
        let history = getHistory().filter(item => item.toLowerCase() !== query.toLowerCase());
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderInitialDropdown();
    };
    const clearHistory = () => {
        localStorage.removeItem(HISTORY_KEY);
        renderInitialDropdown();
    };

    // --- UI RENDERING ---
    const renderInitialDropdown = () => {
        const history = getHistory();
        let historyHTML = '';
        if (history.length > 0) {
            historyHTML = `
                <div class="section-header">
                    <span>Search History</span>
                    <button class="clear-history-btn" title="Clear all history">Clear All</button>
                </div>
                ${history.map(item => `
                    <li class="search-history-item" data-query="${item}">
                        <span>${item}</span>
                        <button class="remove-history-btn" title="Remove">&times;</button>
                    </li>
                `).join('')}
            `;
        }
        const popularHTML = `
            <div class="section-header"><span>Popular Searches</span></div>
            ${POPULAR_SEARCHES.slice(0, 10).map((item, index) => `
                <li class="popular-search-item" data-query="${item}">
                    <span class="rank ${index < 3 ? 'top-3' : ''}">${index + 1}</span>
                    <span>${item}</span>
                </li>
            `).join('')}
        `;
        searchDropdown.innerHTML = historyHTML + popularHTML;
        searchDropdown.style.display = 'block';
    };

    const renderLiveResults = (items) => {
        if (!items || items.length === 0) {
            searchDropdown.innerHTML = '<li>No results found.</li>';
            return;
        }
        searchDropdown.innerHTML = items.filter(item => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv'))
            .slice(0, 7)
            .map(item => {
                const title = item.title || item.name;
                const year = (item.release_date || item.first_air_date || '').split('-')[0];
                return `
                    <li class="search-result-item" data-id="${item.id}" data-type="${item.media_type}">
                        <img src="${IMG_URL}${item.poster_path}" alt="${title}">
                        <div class="search-result-info">
                            <span>${title}</span>
                            <small>${year} &bull; ${item.media_type.toUpperCase()}</small>
                        </div>
                    </li>`;
            }).join('');
        searchDropdown.style.display = 'block';
    };

    // --- API & EVENT LOGIC ---
    const fetchAndRedirect = async (query) => {
        if (!query) return;
        searchDropdown.innerHTML = '<li>Searching...</li>';
        try {
            const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            const firstResult = data.results.find(item => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv'));
            if (firstResult) {
                saveToHistory(query);
                window.location.href = `/p/details.html?id=${firstResult.id}&type=${firstResult.media_type}`;
            } else {
                searchDropdown.innerHTML = `<li>No results found for "${query}".</li>`;
            }
        } catch (error) {
            console.error("Failed to handle popular/history search click:", error);
            searchDropdown.innerHTML = '<li>Error fetching results.</li>';
        }
    };

    const fetchLiveResults = async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            if (!response.ok) return;
            const data = await response.json();
            renderLiveResults(data.results);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
        }
    };

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '') renderInitialDropdown();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        if (query.length < 2) {
            renderInitialDropdown();
            return;
        }
        debounceTimer = setTimeout(() => fetchLiveResults(query), 300);
    });

    searchContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchAndRedirect(query);
        }
    });

    searchDropdown.addEventListener('click', async (e) => {
        const resultItem = e.target.closest('.search-result-item');
        const historyItem = e.target.closest('.search-history-item');
        const popularItem = e.target.closest('.popular-search-item');
        const clearBtn = e.target.closest('.clear-history-btn');
        const removeBtn = e.target.closest('.remove-history-btn');

        if (removeBtn && historyItem) {
            e.stopPropagation();
            removeFromHistory(historyItem.dataset.query);
            return;
        }
        if (clearBtn) {
            e.stopPropagation();
            clearHistory();
            return;
        }
        if (resultItem) {
            const id = resultItem.dataset.id;
            const type = resultItem.dataset.type;
            const title = resultItem.querySelector('.search-result-info span').textContent;
            saveToHistory(title);
            window.location.href = `/p/details.html?id=${id}&type=${type}`;
        } else if (historyItem || popularItem) {
            const query = (historyItem || popularItem).dataset.query;
            await fetchAndRedirect(query);
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
}
