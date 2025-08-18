let ytPlayer;
function onYouTubeIframeAPIReady() {
    if (document.getElementById('trailer-iframe')) {
        ytPlayer = new YT.Player('trailer-iframe', {
            events: { 'onReady': onPlayerReady }
        });
    }
}
function onPlayerReady(event) { }
function loadYouTubeAPI() {
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }
}


document.addEventListener("DOMContentLoaded", () => {

    function showToastNotification(message, type = 'info') {
        let toast = document.getElementById('custom-toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'custom-toast-notification';
            document.body.appendChild(toast);
        }
        clearTimeout(window.toastTimer);
        toast.textContent = message;
        toast.className = 'toast-show ' + type;
        window.toastTimer = setTimeout(() => {
            toast.className = toast.className.replace('toast-show', '');
        }, 3000);
    }

    function toggleBookmark(itemData) {
        const { id, type, title, poster } = itemData;
        let bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
        const existingIndex = bookmarks.findIndex(b => b.id == id);
        if (existingIndex > -1) {
            bookmarks.splice(existingIndex, 1);
            showToastNotification("Removed from Watchlist", 'info');
        } else {
            const url = `/p/details.html?id=${id}&type=${type}`;
            bookmarks.push({ id, type, title, poster, url });
            showToastNotification("Added to Watchlist", 'success');
        }
        localStorage.setItem("abefilm_bookmarks", JSON.stringify(bookmarks));
    }

    async function initDetailsPage(API_KEY) {
        const loader = document.getElementById('page-loader');
    
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const type = params.get("type");
        const container = document.getElementById('details-page-container');

        if (!id || !type) {
            container.innerHTML = "<p style='color:red; text-align:center;'>Error: Content ID or type is missing.</p>";
         
            if (loader) loader.style.display = 'none';
          
            return;
        }

        const BASE_URL = "https://api.themoviedb.org/3";
        const IMG_URL = "https://image.tmdb.org/t/p/";

        function renderHeader(details, credits, videos, ratings) {
            const headerContainer = document.getElementById('details-header');
            if (!headerContainer) return;
            
            const heroWrapper = document.createElement('div');
            heroWrapper.className = 'details-hero-wrapper';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'details-header-content';

            const mediaContainer = document.createElement('div');
            mediaContainer.className = 'details-media-container';

            const title = details.name || details.title;
            const year = (details.first_air_date || details.release_date || '').split('-')[0];
            const rating = details.vote_average?.toFixed(1);
            const director = credits.crew?.find(p => p.job === 'Director')?.name || 'N/A';
            const cast = credits.cast?.slice(0, 5).map(p => p.name).join(', ');
            const overview = details.overview || "No description available.";

            contentDiv.innerHTML = `
                <h1 class="details-title">${title}</h1>
                <div class="details-meta-badges">
                    <span class="top-badge">Original</span>
                    <span class="meta-badge">Free</span>
                </div>
                <div class="details-meta-badges">
                    <span class="meta-badge star">★ ${rating}</span>
                    <span class="meta-badge">${year}</span>
                    ${type === 'tv' ? `<span class="meta-badge">${details.number_of_episodes || '?'} Episodes</span>` : ''}
                </div>
                <div class="details-tags">
                    ${details.genres.map(g => `<span class="details-tag">${g.name}</span>`).join('')}
                </div>
                <div class="details-description">${overview} <span id="desc-toggle">More</span></div>
                <div class="details-actions">
                    <a href="/p/player.html?id=${id}&type=${type}&season=1&ep=1" class="btn-play">▶ Play</a>
                    <button class="btn-secondary btn-bookmark"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="var(--text-secondary)" fill="none">
    <path d="M11 2C7.22876 2 5.34315 2 4.17157 3.12874C3 4.25748 3 6.07416 3 9.70753V17.9808C3 20.2867 3 21.4396 3.77285 21.8523C5.26947 22.6514 8.0768 19.9852 9.41 19.1824C10.1832 18.7168 10.5698 18.484 11 18.484C11.4302 18.484 11.8168 18.7168 12.59 19.1824C13.9232 19.9852 16.7305 22.6514 18.2272 21.8523C19 21.4396 19 20.2867 19 17.9808V13" stroke="#7a7a7a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M17 10L17 2M13 6H21" stroke="var(--text-secondary)" stroke-width="1.5" stroke-linecap="round"></path>
</svg> Watch Later</button>
                    <button class="btn-secondary btn-share"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="var(--text-secondary)" fill="none">
    <path d="M11.922 4.79004C16.6963 3.16245 19.0834 2.34866 20.3674 3.63261C21.6513 4.91656 20.8375 7.30371 19.21 12.078L18.1016 15.3292C16.8517 18.9958 16.2267 20.8291 15.1964 20.9808C14.9195 21.0216 14.6328 20.9971 14.3587 20.9091C13.3395 20.5819 12.8007 18.6489 11.7231 14.783C11.4841 13.9255 11.3646 13.4967 11.0924 13.1692C11.0134 13.0742 10.9258 12.9866 10.8308 12.9076C10.5033 12.6354 10.0745 12.5159 9.21705 12.2769C5.35111 11.1993 3.41814 10.6605 3.0909 9.64127C3.00292 9.36724 2.97837 9.08053 3.01916 8.80355C3.17088 7.77332 5.00419 7.14834 8.6708 5.89838L11.922 4.79004Z" stroke="var(--text-secondary)" stroke-width="1.5" />
</svg>Share</button>
                </div>
            `;

            const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) {
                const iframeId = 'trailer-iframe';
                const iframeHTML = `<iframe id="${iframeId}" src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&enablejsapi=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                const volumeToggleHTML = `
                    <button id="volume-toggle" title="Toggle Sound">
                        <svg class="icon-muted" viewBox="0 0 24 24" style="display: block;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></svg>
                        <svg class="icon-unmuted" viewBox="0 0 24 24" style="display: none;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.28 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
                    </button>`;
                mediaContainer.innerHTML = iframeHTML + volumeToggleHTML;
                loadYouTubeAPI();
                const volumeButton = mediaContainer.querySelector('#volume-toggle');
                volumeButton.addEventListener('click', () => {
                    if (ytPlayer && typeof ytPlayer.isMuted === 'function') {
                        const iconMuted = volumeButton.querySelector('.icon-muted');
                        const iconUnmuted = volumeButton.querySelector('.icon-unmuted');
                        if (ytPlayer.isMuted()) {
                            ytPlayer.unMute();
                            iconMuted.style.display = 'none';
                            iconUnmuted.style.display = 'block';
                        } else {
                            ytPlayer.mute();
                            iconMuted.style.display = 'block';
                            iconUnmuted.style.display = 'none';
                        }
                    }
                });
            } else if (details.backdrop_path) {
                headerContainer.style.backgroundImage = `url(${IMG_URL}original${details.backdrop_path})`;
                mediaContainer.style.backgroundImage = `url(${IMG_URL}w780${details.backdrop_path})`;
            }

            headerContainer.innerHTML = '';
            heroWrapper.appendChild(contentDiv);
            heroWrapper.appendChild(mediaContainer);
            headerContainer.appendChild(heroWrapper);

            const descDiv = contentDiv.querySelector('.details-description');
            const toggle = contentDiv.querySelector('#desc-toggle');
            if (descDiv.scrollHeight <= descDiv.clientHeight) {
                toggle.style.display = 'none';
            }
            toggle.addEventListener('click', () => {
                descDiv.classList.toggle('expanded');
                toggle.textContent = descDiv.classList.contains('expanded') ? 'Less' : 'More';
            });
            contentDiv.querySelector('.btn-bookmark').addEventListener('click', () => {
                 const posterPath = details.poster_path ? `${IMG_URL}w500${details.poster_path}` : '';
                 toggleBookmark({ id: details.id, type: type, title: title, poster: posterPath });
            });
            contentDiv.querySelector('.btn-share').addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({ title: document.title, url: window.location.href }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(window.location.href).then(() => showToastNotification('Link copied!', 'success'));
                }
            });
        }

        function setupBodyWrapper() {
            const container = document.getElementById('details-page-container');
            if (document.querySelector('.details-body-wrapper')) return;
            const bodyWrapper = document.createElement('div');
            bodyWrapper.className = 'details-body-wrapper';
            const tabsContainer = document.createElement('div');
            tabsContainer.id = 'details-tabs-container';
            const panelsContainer = document.createElement('div');
            panelsContainer.id = 'details-content-panels';
            bodyWrapper.appendChild(tabsContainer);
            bodyWrapper.appendChild(panelsContainer);
            container.appendChild(bodyWrapper);
        }

        function renderTabsAndPanels(details, credits, videos, recommendations) {
            const tabsContainer = document.getElementById('details-tabs-container');
            const panelsContainer = document.getElementById('details-content-panels');
            if (!tabsContainer || !panelsContainer) return;
            let tabs = ['Highlights', 'Cast', 'Recommended'];
            if (type === 'tv') tabs.unshift('Episodes');
            tabsContainer.innerHTML = tabs.map((tab, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab.toLowerCase()}">${tab}</button>`).join('');
            panelsContainer.innerHTML = tabs.map((tab, i) => `<div class="content-panel ${i === 0 ? 'active' : ''}" id="${tab.toLowerCase()}-panel"></div>`).join('');
            if (type === 'tv') renderEpisodesPanel(details);
            renderHighlightsPanel(videos);
            renderCastPanel(credits);
            renderRecommendationsPanel(recommendations, details.id, type, API_KEY);
            tabsContainer.querySelectorAll('.tab-btn').forEach(button => {
                button.addEventListener('click', () => {
                    tabsContainer.querySelector('.active')?.classList.remove('active');
                    button.classList.add('active');
                    panelsContainer.querySelector('.active')?.classList.remove('active');
                    const panel = panelsContainer.querySelector(`#${button.dataset.tab}-panel`);
                    if (panel) panel.classList.add('active');
                });
            });
        }

        function renderEpisodesPanel(details) {
            const panel = document.getElementById('episodes-panel');
            if (!panel) return;

            if (type === 'tv' && details.seasons) {
                const validSeasons = details.seasons.filter(s => s.season_number > 0 && s.episode_count > 0);
                if (validSeasons.length === 0) {
                    panel.innerHTML = `<p>No seasons available for this series yet.</p>`;
                    return;
                }

                const selectWrapper = document.createElement('div');
                selectWrapper.className = 'custom-select-wrapper';

                const trigger = document.createElement('div');
                trigger.className = 'custom-select-trigger';
                trigger.innerHTML = `<span>${validSeasons[0].name}</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9.5L12 14.5L7 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'custom-options';
                optionsContainer.innerHTML = validSeasons.map((s, index) => 
                    `<div class="custom-option ${index === 0 ? 'selected' : ''}" data-value="${s.season_number}">${s.name}</div>`
                ).join('');
                
                selectWrapper.appendChild(trigger);
                selectWrapper.appendChild(optionsContainer);
                panel.appendChild(selectWrapper);

                const grid = document.createElement('div');
                grid.className = 'episodes-grid';
                panel.appendChild(grid);

                trigger.addEventListener('click', () => {
                    selectWrapper.classList.toggle('open');
                });

                optionsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('custom-option')) {
                        const selectedValue = e.target.dataset.value;
                        const selectedText = e.target.textContent;
                        
                        trigger.querySelector('span').textContent = selectedText;
                        selectWrapper.classList.remove('open');
        
                        optionsContainer.querySelector('.selected')?.classList.remove('selected');
                        e.target.classList.add('selected');
                        
                        loadSeason(selectedValue);
                    }
                });
                
                window.addEventListener('click', (e) => {
                    if (!selectWrapper.contains(e.target)) {
                        selectWrapper.classList.remove('open');
                    }
                });

                const loadSeason = async (seasonNum) => {
                    grid.innerHTML = '<p>Loading episodes...</p>';
                    const res = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNum}?api_key=${API_KEY}`);
                    const seasonData = await res.json();
                    grid.innerHTML = seasonData.episodes.map(ep => `
                        <a href="/p/player.html?id=${id}&type=tv&season=${seasonNum}&ep=${ep.episode_number}" class="episode-card">
                            <div class="episode-thumb"><img src="${ep.still_path ? IMG_URL + 'w300' + ep.still_path : (details.poster_path ? IMG_URL + 'w300' + details.poster_path : 'https://imgur.com/gG2Vb2x')}" alt="${ep.name}" loading="lazy"></div>
                            <div class="episode-title">${ep.episode_number}. ${ep.name}</div>
                        </a>
                    `).join('');
                };
                
                // Initial load
                loadSeason(validSeasons[0].season_number);
            }
        }

        function renderCastPanel(credits) {
            const panel = document.getElementById('cast-panel');
            if (!panel) return;
            if (!credits?.cast?.length) { 
                panel.innerHTML = `<p>Cast information is not available.</p>`; 
                return; 
            }
            panel.innerHTML = `<div class="cast-grid">${credits.cast.slice(0, 18).map(person => `
                <div class="cast-card">
                    <img src="${person.profile_path ? IMG_URL + 'w185' + person.profile_path : 'https://i.imgur.com/obaaZjk.png'}" alt="${person.name}" loading="lazy">
                    <div class="cast-name">${person.name}</div>
                    <div class="cast-character">${person.character}</div>
                </div>`).join('')}</div>`;
        }
        
             async function renderRecommendationsPanel(initialRecommendations, currentItemId, currentItemType, apiKey) {
            const panel = document.getElementById('recommended-panel');
            if (!panel) return;

            panel.innerHTML = `<p>Loading recommendations...</p>`;

            let finalItems = initialRecommendations?.results || [];

            if (finalItems.length < 12) {
                try {
                    const res = await fetch(`${BASE_URL}/${currentItemType}/${currentItemId}/similar?api_key=${apiKey}`);
                    if (res.ok) {
                        const similarData = await res.json();
                        const similarItems = similarData.results || [];
                        const existingIds = new Set(finalItems.map(item => item.id));
                        const uniqueSimilarItems = similarItems.filter(item => !existingIds.has(item.id));
                        finalItems = [...finalItems, ...uniqueSimilarItems];
                    }
                } catch (error) {
                    console.warn("Could not fetch similar content:", error);
                }
            }
            
            const itemsToDisplay = finalItems.filter(item => item.poster_path).slice(0, 14);

            if (itemsToDisplay.length === 0) {
                panel.innerHTML = `<p>No recommendations available for this title.</p>`;
                return;
            }

            panel.innerHTML = `<div class="recommendations-grid">${itemsToDisplay.map(item => `
                <a href="/p/details.html?id=${item.id}&type=${item.media_type || currentItemType}" class="rec-card">
                    <div class="rec-thumb">
                        <img src="${IMG_URL}w300${item.poster_path}" alt="${item.title || item.name}" loading="lazy">
                        <div class="rec-overlay">
                            <svg class="play-button" height="60px" version="1.1" viewBox="0 0 60 60" width="60px"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><circle cx="30" cy="30" fill="var(--keycolor)" r="30"></circle><path d="M35.7461509,22.4942263 L45.1405996,36.5858994 C46.059657,37.9644855 45.6871354,39.8270935 44.3085493,40.7461509 C43.8157468,41.0746859 43.2367237,41.25 42.6444487,41.25 L23.8555513,41.25 C22.198697,41.25 20.8555513,39.9068542 20.8555513,38.25 C20.8555513,37.657725 21.0308654,37.078702 21.3594004,36.5858994 L30.7538491,22.4942263 C31.6729065,21.1156403 33.5355145,20.7431187 34.9141006,21.662176 C35.2436575,21.8818806 35.5264463,22.1646695 35.7461509,22.4942263 Z" fill="#FFFFFF" transform="translate(33.250000, 30.000000) rotate(-270.000000) translate(-33.250000, -30.000000) "></path></g></svg>
                        </div>
                    </div>
                    <div class="rec-title">${item.title || item.name}</div>
                </a>`).join('')}</div>`;
        }
        
        function renderHighlightsPanel(videos) {
            const panel = document.getElementById('highlights-panel');
            if (!panel) return;
            const highlights = videos.results?.filter(v => ['Trailer', 'Teaser', 'Clip'].includes(v.type) && v.site === 'YouTube');
            if (highlights?.length > 0) {
                 panel.innerHTML = `<div class="episodes-grid">${highlights.map(v => `
                    <a href="https://www.youtube.com/watch?v=${v.key}" target="_blank" rel="noopener noreferrer" class="episode-card">
                       <div class="episode-thumb"><img src="https://i.ytimg.com/vi/${v.key}/mqdefault.jpg" alt="${v.name}" loading="lazy"></div>
                       <div class="episode-title">${v.name}</div>
                    </a>`).join('')}</div>`;
            } else {
                panel.innerHTML = '<p>No highlights available for this title.</p>';
            }
        }


        try {
            const appendToResponse = 'release_dates,content_ratings,videos,credits,recommendations,images';
            const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=${appendToResponse}&include_image_language=en,null`);
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            
            const allDetails = await res.json();
            
            renderHeader(allDetails, allDetails.credits, allDetails.videos, allDetails.content_ratings || allDetails.release_dates);
            setupBodyWrapper();
            renderTabsAndPanels(allDetails, allDetails.credits, allDetails.videos, allDetails.recommendations);
            

            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 300);
            }
    

        } catch (error) {
            console.error("Failed to render details page:", error);
            container.innerHTML = `<p style='color:red; text-align:center; padding: 50px;'>Failed to load content. Please verify the content ID and API key.</p>`;
  
            if (loader) loader.style.display = 'none';
          
        }
    }
    

    function initializeApp(apiKey) {
        if (window.location.pathname.includes('/p/details.html')) {
            initDetailsPage(apiKey);
        }
    }
    
     function waitForApiKey() {
        let attempts = 0; const maxAttempts = 50;
        const interval = setInterval(() => {
            if (window.apiKey) {
                clearInterval(interval);
                initializeApp(window.apiKey);
            } else if (attempts++ >= maxAttempts) {
                clearInterval(interval);
                console.error("FATAL: API Key (window.apiKey) was not found. App will not run.");
                const errorTargets = [document.getElementById("tmdb-slider"), document.getElementById('details-page-container')];
                document.querySelectorAll(".tmdb-row").forEach(el => el.innerHTML = "<p style='color:red;'>Error: API configuration is missing.</p>");
                errorTargets.forEach(el => { if (el) el.innerHTML = "<p style='color:red; text-align:center; padding: 2rem;'>Error: API configuration is missing.</p>"; });
            }
        }, 100);
    }

    waitForApiKey();
});
