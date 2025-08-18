document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('library')) {
        let attempts = 0;
        const maxAttempts = 50;
        const interval = setInterval(() => {
            if (window.apiKey) {
                clearInterval(interval);
                initializeLibraryPage(window.apiKey);
            } else if (attempts++ >= maxAttempts) {
                clearInterval(interval);
                console.error("Library page could not be initialized: API Key not found.");
            }
        }, 100);
    }
});

function initializeLibraryPage(apiKey) {
    const targetDiv = document.getElementById('library');
    if (!targetDiv) return;

    targetDiv.innerHTML = `
        <div id="library-page-container">
            <div id="filter-container">
                <div class="filter-main-categories">
                    <a class="main-category-btn active" data-type="movie">Movie</a>
                    <a class="main-category-btn" data-type="tv">TV Series</a>
                    <a class="main-category-btn" data-type="animation">Animation</a>
                </div>
                <div id="active-filters-bar"></div>
                <div id="filter-options"></div>
            </div>
            <div id="filter-placeholder" style="display: none;"></div>
            <div id="results-container">
                <div id="results-grid"></div>
                <div id="loader-sentinel" style="display: none;"><div class="spinner"></div></div>
            </div>
            <div id="no-results-message" style="display: none; text-align: center; padding: 50px; color: var(--text-secondary);">
                <p>No titles found matching your criteria. Please try a different filter.</p>
            </div>
        </div>`;

    const API_KEY = apiKey;
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMG_URL = "https://image.tmdb.org/t/p/w342";

    const libraryContainer = document.getElementById('library-page-container');
    const mainCategoryContainer = document.querySelector('.filter-main-categories');
    const filterContainer = document.getElementById('filter-container');
    const filterPlaceholder = document.getElementById('filter-placeholder');
    const activeFiltersBar = document.getElementById('active-filters-bar');
    const filterOptionsContainer = document.getElementById('filter-options');
    const resultsGrid = document.getElementById('results-grid');
    const loaderSentinel = document.getElementById('loader-sentinel');
    const noResultsMessage = document.getElementById('no-results-message');

    let state = { mediaType: 'movie', region: '', genre: '', year: '', sortBy: 'popularity.desc', page: 1, isLoading: false, hasMore: true };
    
    const filters = {
        regions: [
            { label: 'All Regions', value: '' }, { label: 'English (All)', value: 'en' }, { label: 'USA', value: 'US' }, { label: 'United Kingdom', value: 'GB' },
            { label: 'Canada', value: 'CA' }, { label: 'Australia', value: 'AU' }, { label: 'Korea', value: 'KR' }, { label: 'Japan', value: 'JP' },
            { label: 'Taiwan', value: 'TW' }, { label: 'China', value: 'CN' }, { label: 'Thailand', value: 'TH' }, { label: 'Philippines', value: 'PH' },
            { label: 'Vietnam', value: 'VN' }, { label: 'Indonesia', value: 'ID' }, { label: 'Malaysia', value: 'MY' }
        ],
        genres: [
            { label: 'All Genres', value: '' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
            { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
            { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' }, { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' },
            { id: 878, name: 'Sci-Fi' }
        ],
        years: ['All Time Periods', ...Array.from({length: 16}, (_, i) => 2025 - i)],
        sortOptions: [
            { label: 'Sort By', value: 'popularity.desc' }, { label: 'Popular', value: 'popularity.desc' }, { label: 'Top Rated', value: 'vote_average.desc' },
            { label: 'Newest', value: 'primary_release_date.desc' }, { label: 'Oldest', value: 'primary_release_date.asc' }, { label: 'Now Playing', value: 'now_playing' },
            { label: 'Upcoming', value: 'upcoming_sort' }, { label: 'Trending', value: 'trending' }
        ]
    };

    const updateActiveFiltersBar = () => {
        const filterOrder = ['region', 'genre', 'year', 'sortBy'];
        const activeFilterLabels = filterOrder.map(type => {
            const activeButton = filterOptionsContainer.querySelector(`.filter-btn[data-type="${type}"].active`);
            if (activeButton) {
                let label = activeButton.textContent;
                if (label === 'Sort By') {
                    return 'Popular';
                }
                return label;
            }
            return null;
        }).filter(Boolean);

        activeFiltersBar.textContent = activeFilterLabels.join(' • ');
    };

    const fetchContent = async () => {
        if (state.isLoading || !state.hasMore) return;
        state.isLoading = true;
        loaderSentinel.style.display = 'flex';
        noResultsMessage.style.display = 'none';
        
        const params = new URLSearchParams({ api_key: API_KEY, page: state.page, sort_by: state.sortBy });
        
        if (state.genre) params.append('with_genres', state.genre);
        
        if (state.region) {
            if (state.region === 'en') {
                params.append('with_original_language', 'en');
            } else {
                params.append('with_origin_country', state.region);
            }
        }
        
        if (state.year && state.year !== 'All Time Periods') {
            params.append(state.mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year', state.year);
        }
        if (state.sortBy === 'vote_average.desc') {
            params.append('vote_count.gte', 200);
        }
        
        try {
            const response = await fetch(`${BASE_URL}/discover/${state.mediaType}?${params.toString()}`);
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const data = await response.json();
            renderContent(data.results);
            state.hasMore = data.page < data.total_pages;
            
            if (!state.hasMore || (data.results.length === 0 && state.page === 1)) {
                loaderSentinel.style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching content:', error);
            if (state.page === 1) noResultsMessage.style.display = 'block';
            loaderSentinel.style.display = 'none';
        } finally {
            state.isLoading = false;
        }
    };

    const renderContent = (items) => {
        if (state.page === 1 && (!items || items.length === 0)) {
            noResultsMessage.style.display = 'block';
            resultsGrid.innerHTML = '';
        }
        const itemsHTML = items.map(item => {
            const title = item.title || item.name;
            const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
            const rating = item.vote_average > 0 ? item.vote_average.toFixed(1) : 'NR';
            return `
                <a href="/p/details.html?id=${item.id}&type=${state.mediaType}" class="library-card">
                    <div class="library-thumb">
                        <img src="${item.poster_path ? IMG_URL + item.poster_path : 'https://i.imgur.com/gG2Vb2x.png'}" alt="${title}" loading="lazy">
                        <div class="library-meta library-rating"><i class="bi">★</i> ${rating}</div>
                        <div class="library-meta library-year">${year}</div>
                        <div class="hover-overlay"></div>
                        <div class="play-btn"><svg viewBox="0 0 60 60"><g fill="none"><circle cx="30" cy="30" fill="var(--keycolor)" r="30"/><path d="M35.75,22.5 L45.14,36.58 C46.06,37.96 45.69,39.83 44.31,40.75 C43.82,41.07 43.24,41.25 42.64,41.25 L23.86,41.25 C22.2,41.25 20.86,39.91 20.86,38.25 C20.86,37.66 21.03,37.08 21.36,36.59 L30.75,22.5 C31.67,21.12 33.54,20.74 34.91,21.66 C35.24,21.88 35.53,22.16 35.75,22.5Z" fill="#FFFFFF" transform="translate(33.25, 30) rotate(-270) translate(-33.25, -30)"/></g></svg></div>
                    </div>
                    <div class="library-title">${title}</div>
                </a>`;
        }).join('');
        resultsGrid.insertAdjacentHTML('beforeend', itemsHTML);
    };

    const createFilterRow = (type, options) => {
        const row = document.createElement('div');
        row.className = 'filter-row';
        row.innerHTML = options.map(opt => {
                const display = opt.label || opt.name || opt;
                const value = (type === 'sortBy' && display === 'Sort By') ? 'popularity.desc' : (opt.value ?? opt.id ?? (display === 'All Time Periods' || display === 'All Regions' || display === 'All Genres' ? '' : opt));
                return `<button class="filter-btn" data-type="${type}" data-value="${value}">${display}</button>`;
            }).join('');
        return row;
    };

    const renderFilters = () => {
        filterOptionsContainer.innerHTML = '';
        filterOptionsContainer.appendChild(createFilterRow('region', filters.regions));
        filterOptionsContainer.appendChild(createFilterRow('genre', filters.genres));
        filterOptionsContainer.appendChild(createFilterRow('year', filters.years));
        filterOptionsContainer.appendChild(createFilterRow('sortBy', filters.sortOptions));
        updateActiveButtons();
    };

    const updateActiveButtons = () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const type = btn.dataset.type;
            const value = String(btn.dataset.value);
            btn.classList.toggle('active', String(state[type]) === value);
        });
    };

    const resetAndFetch = () => {
        resultsGrid.innerHTML = '';
        state.page = 1;
        state.hasMore = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchContent();
    };

    mainCategoryContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('.main-category-btn');
        if (target && !target.classList.contains('active')) {
            mainCategoryContainer.querySelector('.active').classList.remove('active');
            target.classList.add('active');
            const type = target.dataset.type;
            
            state.genre = '';
            
            if (type === 'animation') {
                state.mediaType = 'movie';
                state.genre = '16';
            } else {
                state.mediaType = type;
            }
            
            resetAndFetch();
            renderFilters();
            updateActiveFiltersBar();
        }
    });

    filterOptionsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.filter-btn');
        if (target && !target.classList.contains('active')) {
            const type = target.dataset.type;
            const value = target.dataset.value;

            state[type] = value;
            
            if (type === 'genre' && value !== '') {
                const animButton = mainCategoryContainer.querySelector('[data-type="animation"]');
                if (animButton && animButton.classList.contains('active')) {
                   animButton.classList.remove('active');
                   mainCategoryContainer.querySelector(`[data-type="${state.mediaType === 'tv' ? 'tv' : 'movie'}"]`).classList.add('active');
                }
            }
            
            const siblings = target.parentElement.querySelectorAll('.filter-btn');
            siblings.forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');
            
            resetAndFetch();
            updateActiveFiltersBar();
        }
    });

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore && !state.isLoading) {
            state.page++;
            fetchContent();
        }
    }, { rootMargin: '500px' });

    observer.observe(loaderSentinel);

    let filterContainerOffsetTop = 0;
    setTimeout(() => {
        if(filterContainer) filterContainerOffsetTop = filterContainer.offsetTop;
    }, 100); 

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            if (window.scrollY > filterContainerOffsetTop) {
                if (!filterContainer.classList.contains('fixed-filters')) {
                    filterPlaceholder.style.height = `${filterContainer.offsetHeight}px`;
                    filterPlaceholder.style.display = 'block';
                    filterContainer.classList.add('fixed-filters');
                }
            } else {
                if (filterContainer.classList.contains('fixed-filters')) {
                    filterContainer.classList.remove('fixed-filters');
                    filterPlaceholder.style.display = 'none';
                }
            }
        }
    });

    renderFilters();
    fetchContent().then(() => {
        if(libraryContainer) libraryContainer.classList.add('loaded');
        updateActiveFiltersBar();
    });
}
