document.addEventListener("DOMContentLoaded", () => {
   
    const svgIconBookmarkPlus = `
    <svg width="60px" height="60px" viewBox="0 0 60 60"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><circle fill="#FFFFFF" cx="30" cy="30" r="30"></circle>
    <path d="M29.3055556,17.25 C29.6890866,17.25 30,17.5609134 30,17.9444444 L30,19.3888889 C30,19.77242 29.6890866,20.0833333 29.3055556,20.0833333 L22.9166667,20.0833333 L22.9166667,39.724 L28.6396082,34.9562398 C29.3713667,34.346441 30.4106369,34.302884 31.1863257,34.8255686 L31.3603918,34.9562398 L37.0833333,39.7254167 L37.0833333,33.5277778 C37.0833333,33.1442467 37.3942467,32.8333333 37.7777778,32.8333333 L39.2222222,32.8333333 C39.6057533,32.8333333 39.9166667,33.1442467 39.9166667,33.5277778 L39.9166667,41.2376789 C39.9166667,42.4112764 38.9652794,43.3627321 37.7916667,43.3627321 C37.3655561,43.3627321 36.9510168,43.2346313 36.6007867,42.9976358 L36.4312748,42.8701491 L30,37.50975 L23.5687252,42.8701491 C22.7234861,43.574515 21.4929682,43.5114751 20.7233835,42.7579578 L20.5758631,42.5980707 C20.3030814,42.2707327 20.1360669,41.8703014 20.0939154,41.4495208 L20.0833333,41.2376789 L20.0833333,20.0833333 C20.0833333,18.5896541 21.2391602,17.3659327 22.7052117,17.2577715 L22.9166667,17.25 L29.3055556,17.25 Z M39.2222222,17.25 C39.6057533,17.25 39.9166667,17.5609134 39.9166667,17.9444444 L39.9163333,21.499 L43.4722222,21.5 C43.8557533,21.5 44.1666667,21.8109134 44.1666667,22.1944444 L44.1666667,23.6388889 C44.1666667,24.02242 43.8557533,24.3333333 43.4722222,24.3333333 L39.9163333,24.333 L39.9166667,27.8888889 C39.9166667,28.27242 39.6057533,28.5833333 39.2222222,28.5833333 L37.7777778,28.5833333 C37.3942467,28.5833333 37.0833333,28.27242 37.0833333,27.8888889 L37.0823333,24.333 L33.5277778,24.3333333 C33.1442467,24.3333333 32.8333333,24.02242 32.8333333,23.6388889 L32.8333333,22.1944444 C32.8333333,21.8109134 33.1442467,21.5 33.5277778,21.5 L37.0823333,21.499 L37.0833333,17.9444444 C37.0833333,17.5609134 37.3942467,17.25 37.7777778,17.25 L39.2222222,17.25 Z" fill="#111319" fill-rule="nonzero"></path>
    </g></svg>`;

    const svgIconBookmarkChecked = `
    <svg width="50" height="50" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle fill="#fff" cx="30" cy="30" r="30"></circle>
      <path d="M29.3,17.25C29.7,17.25,30,17.56,30,17.94V19.38C30,19.77,29.7,20.08,29.3,20.08H22.91V39.72L28.64,34.95C29.37,34.34,30.41,34.3,31.18,34.82L37.08,39.72V33.52C37.08,33.14,37.39,32.83,37.77,32.83H39.22C39.6,32.83,39.91,33.14,39.91,33.52V41.23C39.91,42.41,38.96,43.36,37.79,43.36C37.36,43.36,36.95,43.23,36.6,42.99L30,37.5L23.56,42.87C22.72,43.57,21.49,43.51,20.72,42.75C20.3,42.27,20.13,41.87,20.08,41.23V20.08C20.08,18.58,21.23,17.36,22.7,17.25H29.3Z" fill="#111319" fill-rule="nonzero"></path>
      <path d="M33 23L37 27L44 18" stroke="#111319" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;

    function isBookmarked(id) {
        const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
        return bookmarks.some(b => b.id == id);
    }

    function toggleBookmark(itemData) {
        const { id, type, title, poster } = itemData;
        const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
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
        updateBookmarkCount();
        return existingIndex === -1;
    }

    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("scroll-btn") || e.target.classList.contains("cast-scroll-btn") || e.target.classList.contains("tmdb-scroll")) {
          const wrapper = e.target.closest(".cast-scroll-wrapper, .tmdb-wrapper");
          const scrollContainer = wrapper?.querySelector(".cast-scroll, .tmdb-row");
          if (scrollContainer) {
              const direction = e.target.classList.contains("left") ? -1 : 1;
              const scrollAmount = scrollContainer.clientWidth;
              scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
          }
      }
    });

    let toastTimer;
    function setupToastNotification() {
        if (document.getElementById('custom-toast-notification')) return;
        const toastHTML = document.createElement('div');
        toastHTML.id = 'custom-toast-notification';
        document.body.appendChild(toastHTML);
    }

    function showToastNotification(message, type = 'info') {
        const toast = document.getElementById('custom-toast-notification');
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = 'toast-show ' + type;
        toastTimer = setTimeout(() => {
            toast.className = toast.className.replace('toast-show', '');
        }, 3000);
    }

    function updateBookmarkCount() {
        const countEl = document.getElementById("bookmark-count");
        if (countEl) {
            const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
            countEl.textContent = bookmarks.length;
            countEl.style.display = bookmarks.length > 0 ? 'flex' : 'none';
        }
    }

    function showBookmarks() {
        const bookmarkList = document.getElementById('bookmark-list');
        if (!bookmarkList) return;
        const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
        bookmarkList.innerHTML = bookmarks.length === 0 ? "<li>Your watchlist is empty.</li>" : bookmarks.map((b, i) => `
      <li class="bookmark-item">
        <a href="${b.url}" class="bookmark-link">
          <img src="${b.poster || 'https://i.imgur.com/YyHsyEr.png'}" alt="${b.title}" class="bookmark-thumb">
          <span class="bookmark-title">${b.title}</span>
        </a>
        <button class="delete-bookmark" data-index="${i}" title="Remove">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.84254 5.48939L8.52333 5.80406L7.84254 5.48939ZM8.81802 4.18112L8.31749 3.62258L8.31749 3.62258L8.81802 4.18112ZM10.2779 3.30696L10.5389 4.01009L10.2779 3.30696ZM13.7221 3.30696L13.9831 2.60384V2.60384L13.7221 3.30696ZM16.1575 5.48939L16.8383 5.17471L16.1575 5.48939ZM8.25 7.03259C8.25 6.61367 8.34194 6.19649 8.52333 5.80406L7.16175 5.17471C6.89085 5.76079 6.75 6.39238 6.75 7.03259H8.25ZM8.52333 5.80406C8.70487 5.41133 8.97357 5.04881 9.31855 4.73966L8.31749 3.62258C7.82675 4.06235 7.43251 4.58893 7.16175 5.17471L8.52333 5.80406ZM9.31855 4.73966C9.66369 4.43037 10.0778 4.18126 10.5389 4.01009L10.0169 2.60384C9.38616 2.83798 8.80808 3.18295 8.31749 3.62258L9.31855 4.73966ZM10.5389 4.01009C11.0001 3.8389 11.4968 3.75 12 3.75V2.25C11.3213 2.25 10.6477 2.36972 10.0169 2.60384L10.5389 4.01009ZM12 3.75C12.5032 3.75 12.9999 3.8389 13.4611 4.01009L13.9831 2.60384C13.3523 2.36972 12.6787 2.25 12 2.25V3.75ZM13.4611 4.01009C13.9222 4.18126 14.3363 4.43037 14.6815 4.73966L15.6825 3.62258C15.1919 3.18295 14.6138 2.83798 13.9831 2.60384L13.4611 4.01009ZM14.6815 4.73966C15.0264 5.04881 15.2951 5.41133 15.4767 5.80406L16.8383 5.17471C16.5675 4.58893 16.1733 4.06235 15.6825 3.62258L14.6815 4.73966ZM15.4767 5.80406C15.6581 6.19649 15.75 6.61367 15.75 7.03259H17.25C17.25 6.39238 17.1092 5.7608 16.8383 5.17471L15.4767 5.80406Z" fill="var(--keycolor)"></path><path d="M3 6.28259C2.58579 6.28259 2.25 6.61838 2.25 7.03259C2.25 7.44681 2.58579 7.78259 3 7.78259V6.28259ZM21 7.78259C21.4142 7.78259 21.75 7.44681 21.75 7.03259C21.75 6.61838 21.4142 6.28259 21 6.28259V7.78259ZM5 7.03259V6.28259H4.25V7.03259H5ZM19 7.03259H19.75V6.28259H19V7.03259ZM18.3418 16.8303L19.0624 17.0383L18.3418 16.8303ZM13.724 20.8553L13.8489 21.5949L13.724 20.8553ZM10.276 20.8553L10.401 20.1158L10.401 20.1158L10.276 20.8553ZM10.1183 20.8287L9.9933 21.5682L9.9933 21.5682L10.1183 20.8287ZM5.65815 16.8303L4.93757 17.0383L5.65815 16.8303ZM13.8817 20.8287L13.7568 20.0892L13.8817 20.8287ZM3 7.78259H21V6.28259H3V7.78259ZM13.7568 20.0892L13.599 20.1158L13.8489 21.5949L14.0067 21.5682L13.7568 20.0892ZM10.401 20.1158L10.2432 20.0892L9.9933 21.5682L10.151 21.5949L10.401 20.1158ZM18.25 7.03259V12.1758H19.75V7.03259H18.25ZM5.75 12.1759V7.03259H4.25V12.1759H5.75ZM18.25 12.1758C18.25 13.6806 18.0383 15.1776 17.6212 16.6223L19.0624 17.0383C19.5185 15.4583 19.75 13.8212 19.75 12.1758H18.25ZM13.599 20.1158C12.5404 20.2947 11.4596 20.2947 10.401 20.1158L10.151 21.5949C11.3751 21.8017 12.6248 21.8017 13.8489 21.5949L13.599 20.1158ZM10.2432 20.0892C8.40523 19.7786 6.90157 18.4335 6.37873 16.6223L4.93757 17.0383C5.61878 19.3981 7.58166 21.1607 9.9933 21.5682L10.2432 20.0892ZM6.37873 16.6223C5.9617 15.1776 5.75 13.6806 5.75 12.1759H4.25C4.25 13.8212 4.48148 15.4583 4.93757 17.0383L6.37873 16.6223ZM14.0067 21.5682C16.4183 21.1607 18.3812 19.3981 19.0624 17.0383L17.6212 16.6223C17.0984 18.4335 15.5947 19.7786 13.7568 20.0892L14.0067 21.5682ZM5 7.78259H19V6.28259H5V7.78259Z" fill="#6c6e76"></path><path d="M10 12V16M14 12V16" stroke="var(--keycolor)" stroke-width="1.5" stroke-linecap="round"></path></g></svg>
        </button>
      </li>`).join('');
    }

    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const bookmarkModal = document.getElementById('bookmark-modal');
    if (bookmarkBtn && bookmarkModal) {
        bookmarkBtn.addEventListener('click', (e) => { e.preventDefault(); const isVisible = bookmarkModal.style.display === 'block'; bookmarkModal.style.display = isVisible ? 'none' : 'block'; if (!isVisible) { showBookmarks(); } });
        document.addEventListener('click', (e) => { if (bookmarkModal.style.display === 'block' && !bookmarkModal.contains(e.target) && !bookmarkBtn.contains(e.target)) { bookmarkModal.style.display = 'none'; } });
        bookmarkModal.addEventListener('click', (e) => { const deleteBtn = e.target.closest('.delete-bookmark'); if (deleteBtn) { e.stopPropagation(); const index = parseInt(deleteBtn.getAttribute('data-index')); const bookmarks = JSON.parse(localStorage.getItem('abefilm_bookmarks') || '[]'); bookmarks.splice(index, 1); localStorage.setItem('abefilm_bookmarks', JSON.stringify(bookmarks)); showBookmarks(); updateBookmarkCount(); } });
    }

function initTmdbHoverPopups() {

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }

    if (!document.getElementById('tmdb-card-popup')) {
        const popupEl = document.createElement('div');
        popupEl.id = 'tmdb-card-popup';
        document.body.appendChild(popupEl);
    }
    const popup = document.getElementById('tmdb-card-popup');
    
    let showTimer = null;
    let hideTimer = null;

    const hidePopup = () => {
        popup.classList.remove('visible');

        setTimeout(() => {
            document.querySelectorAll('.tmdb-card.is-growing').forEach(card => card.classList.remove('is-growing'));
        }, 150);
    };

    const showPopup = (card) => {

        document.querySelectorAll('.tmdb-card.is-growing').forEach(c => c.classList.remove('is-growing'));
        card.classList.add('is-growing');
        
        const { id, type, title, backdrop, year, rating, overview, genres } = card.dataset;
        const posterSrc = card.querySelector('img')?.src;
        const genreList = JSON.parse(genres);
        const detailUrl = `${window.location.origin}/p/details.html?id=${id}&type=${type}`;
        const playUrl = `${window.location.origin}/p/player.html?id=${id}&type=${type}${type === 'tv' ? '&season=1&ep=1' : ''}`;
        
        const bookmarked = isBookmarked(id);
        const bookmarkButtonTitle = bookmarked ? "Remove from Watchlist" : "Add to Watchlist";
        const bookmarkButtonIcon = bookmarked ? svgIconBookmarkChecked : svgIconBookmarkPlus;

        popup.innerHTML = `
            <div class="popup-backdrop" style="background-image: url('https://image.tmdb.org/t/p/w500${backdrop}')">
                <div class="popup-controls">
                    <a href="${playUrl}" class="popup-play-btn" title="Play"><svg class="play-button" height="30px" version="1.1" viewBox="0 0 60 60" width="30px"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><circle cx="30" cy="30" fill="var(--keycolor)" r="30"></circle><path d="M35.7461509,22.4942263 L45.1405996,36.5858994 C46.059657,37.9644855 45.6871354,39.8270935 44.3085493,40.7461509 C43.8157468,41.0746859 43.2367237,41.25 42.6444487,41.25 L23.8555513,41.25 C22.198697,41.25 20.8555513,39.9068542 20.8555513,38.25 C20.8555513,37.657725 21.0308654,37.078702 21.3594004,36.5858994 L30.7538491,22.4942263 C31.6729065,21.1156403 33.5355145,20.7431187 34.9141006,21.662176 C35.2436575,21.8818806 35.5264463,22.1646695 35.7461509,22.4942263 Z" fill="#FFFFFF" transform="translate(33.250000, 30.000000) rotate(-270.000000) translate(-33.250000, -30.000000) "></path></g></svg></a>
                    <button class="popup-add-btn ${bookmarked ? 'bookmarked' : ''}" title="${bookmarkButtonTitle}" data-id="${id}" data-type="${type}" data-title="${title}" data-poster="${posterSrc}">${bookmarkButtonIcon}</button>
                </div>
            </div>
            <div class="popup-content">
                <h3 class="popup-title">${title}</h3><div class="popup-meta"><span class="popup-rating">★ ${rating}</span><span>${year}</span></div>
                <div class="popup-genres">${genreList.slice(0, 3).map(g => `<span>${g}</span>`).join('')}</div>
                <p class="popup-overview">${overview.replace(/&quot;/g, '"') || 'No overview available.'}</p>
                <a href="${detailUrl}" class="popup-more-info">More Info</a>
            </div>`;

        const cardRect = card.getBoundingClientRect();
        const popupWidth = 250;
        popup.style.display = 'block';
        const popupHeight = popup.offsetHeight;
        
        let top = cardRect.top + (cardRect.height / 2) - (popupHeight / 2);
        let left = cardRect.left + (cardRect.width / 2) - (popupWidth / 2);

        left = Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10));
        top = Math.max(10, Math.min(top, window.innerHeight - popupHeight - 10));
        
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        popup.classList.add('visible');
    };


    document.body.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.tmdb-card');
        if (card) {
    
            clearTimeout(hideTimer);
            showTimer = setTimeout(() => showPopup(card), 200);
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.tmdb-card');
        const popupEl = e.target.closest('#tmdb-card-popup');

        if (card || popupEl) {     
            clearTimeout(showTimer);        
            hideTimer = setTimeout(hidePopup, 250);
        }
    });

    popup.addEventListener('mouseover', () => clearTimeout(hideTimer));
    
    popup.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('.popup-add-btn');
        if (bookmarkBtn) {
            e.preventDefault(); e.stopPropagation();
            const isNowBookmarked = toggleBookmark({ id: bookmarkBtn.dataset.id, type: bookmarkBtn.dataset.type, title: bookmarkBtn.dataset.title, poster: bookmarkBtn.dataset.poster });
            bookmarkBtn.classList.toggle('bookmarked', isNowBookmarked);
            bookmarkBtn.title = isNowBookmarked ? "Remove from Watchlist" : "Add to Watchlist";
            bookmarkBtn.innerHTML = isNowBookmarked ? svgIconBookmarkChecked : svgIconBookmarkPlus;
        }
    });

    window.addEventListener('scroll', hidePopup, { passive: true });
}

    function manageScrollButtons(wrapperElement) { const scrollContainer = wrapperElement.querySelector('.cast-scroll, .tmdb-row'); const leftBtn = wrapperElement.querySelector('.scroll-btn.left, .cast-scroll-btn.left, .tmdb-scroll.left'); const rightBtn = wrapperElement.querySelector('.scroll-btn.right, .cast-scroll-btn.right, .tmdb-scroll.right'); if (!scrollContainer || !leftBtn || !rightBtn) return; const observer = new ResizeObserver(() => { const isOverflowing = scrollContainer.scrollWidth > scrollContainer.clientWidth + 5; if (isOverflowing) { leftBtn.style.display = 'flex'; rightBtn.style.display = 'flex'; leftBtn.style.pointerEvents = 'auto'; rightBtn.style.pointerEvents = 'auto'; } else { leftBtn.style.display = 'none'; rightBtn.style.display = 'none'; } }); observer.observe(scrollContainer); }

    async function initHomepage(apiKey) {
        
        let genreMap = {};
        try {
            const [movieRes, tvRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`),
                fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`)
            ]);
            const movieData = await movieRes.json();
            const tvData = await tvRes.json();
            movieData.genres.forEach(genre => { genreMap[genre.id] = genre.name; });
            tvData.genres.forEach(genre => { genreMap[genre.id] = genre.name; });
        } catch (error) {
            console.error("Failed to fetch genres:", error);
            return; 
        }

        const endpointEl = document.querySelector("#Text1 .widget-content");
        const loaderLogoEl = document.querySelector("#Text2 .widget-content");
        const loaderLogoUrl = loaderLogoEl?.textContent.trim() || "";
        const sliderEndpoint = endpointEl?.textContent.trim();

        if (sliderEndpoint) {
            await initSlider(sliderEndpoint, apiKey);
        }
        
        initContentRows(apiKey, loaderLogoUrl, genreMap);
    }

    async function initSlider(rawEndpoint, apiKey) {
        const sliderWrapper = document.querySelector(".slider-wrapper"); if (!sliderWrapper) return;
        const slider = document.getElementById("tmdb-slider"), dotContainer = document.getElementById("slider-dots"), titleEl = document.getElementById("slider-title"), badgesEl = document.getElementById("slider-badges"), metaPrimaryEl = document.getElementById("slider-meta-primary"), metaSecondaryEl = document.getElementById("slider-meta-secondary"), overviewEl = document.getElementById("slider-overview"), actionsEl = document.getElementById("slider-actions");
        if (!slider || !dotContainer || !titleEl || !badgesEl || !metaPrimaryEl || !metaSecondaryEl || !overviewEl || !actionsEl) { console.error("Slider init failed."); return; }
        slider.innerHTML = ''; dotContainer.innerHTML = '';
        function buildSliderApiUrl(path, key, params = "") { return `https://api.themoviedb.org/3/${path}?api_key=${key}&language=en-US${params}`; }
        function getSliderMediaType(item, endpoint) { return item.media_type || (endpoint.includes('tv') ? 'tv' : 'movie'); }
        function getCertification(item) { const releases = item.release_dates || item.content_ratings; if (!releases) return 'NR'; const usRating = releases.results?.find(r => r.iso_3166_1 === "US"); if (!usRating) return 'NR'; return getSliderMediaType(item, rawEndpoint) === 'movie' ? (usRating.release_dates?.[0]?.certification || 'NR') : (usRating.rating || 'NR'); }
        try {
            const listResponse = await fetch(buildSliderApiUrl(rawEndpoint, apiKey)); const listData = await listResponse.json(); const items = (listData.results || []).filter(item => item.backdrop_path).slice(0, 7);
            if (items.length === 0) { sliderWrapper.style.display = 'none'; return; }
            const detailPromises = items.map(item => { const mediaType = getSliderMediaType(item, rawEndpoint); const appendToResponse = mediaType === 'movie' ? 'release_dates' : 'content_ratings'; const detailUrl = buildSliderApiUrl(`${mediaType}/${item.id}`, apiKey, `&append_to_response=images,${appendToResponse}&include_image_language=en,null`); return fetch(detailUrl).then(res => res.json()); });
            const detailedItems = await Promise.all(detailPromises);
            detailedItems.forEach((item, i) => { const slide = document.createElement("div"); slide.className = "slide"; slide.dataset.index = i; slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`; slider.appendChild(slide); const dot = document.createElement("div"); dot.className = "thumbnail-dot"; dot.dataset.index = i; dot.addEventListener('click', () => showSlide(i)); dotContainer.appendChild(dot); });
            const slides = slider.querySelectorAll(".slide"); const dots = dotContainer.querySelectorAll(".thumbnail-dot");
            let currentIndex = 0; let sliderInterval;
            function showSlide(index) {
                currentIndex = (index + slides.length) % slides.length;
                const currentItem = detailedItems[currentIndex];
                const mediaType = getSliderMediaType(currentItem, rawEndpoint);
                slides.forEach((s, j) => s.classList.toggle("active", j === currentIndex)); dots.forEach((d, j) => d.classList.toggle("active", j === currentIndex));
                const bestLogo = currentItem.images?.logos?.[0];
                titleEl.innerHTML = bestLogo ? `<img class="slider-title-logo" src="https://image.tmdb.org/t/p/w500${bestLogo.file_path}" alt="${currentItem.title || currentItem.name}">` : `<h2>${currentItem.title || currentItem.name}</h2>`;
                let badgeHTML = ''; if (currentItem.vote_average > 7.5) badgeHTML += `<span class="slider-badge">Top Score</span>`; badgeHTML += `<span class="slider-badge">TOP ${currentIndex + 1}</span>`; const isOriginal = ['Netflix', 'Amazon', 'Hulu', 'HBO', 'Apple TV+'].some(p => currentItem.production_companies?.some(c => c.name.includes(p))); if (isOriginal) badgeHTML += `<span class="slider-badge">Original</span>`; badgesEl.innerHTML = badgeHTML;
                const rating = currentItem.vote_average?.toFixed(1) || 'N/A';
                const year = (currentItem.release_date || currentItem.first_air_date || '').split('-')[0] || '';
                const certification = getCertification(currentItem); const episodes = mediaType === 'tv' ? `${currentItem.number_of_episodes || '?'} Episodes` : ''; metaPrimaryEl.innerHTML = [`<span class="star-icon">★</span> ${rating}`, year, certification, episodes].filter(Boolean).join(' <span style="opacity:0.5;font-weight:100;">|</span> ');
                const country = (currentItem.origin_country?.[0] || currentItem.production_countries?.[0]?.iso_3166_1 || '');
                const genres = (currentItem.genres || []).slice(0, 5).map(g => `<span class="genre-tag">${g.name}</span>`).join(''); metaSecondaryEl.innerHTML = (country ? `<span class="genre-tag">${country}</span>` : '') + genres;
                overviewEl.textContent = currentItem.overview || "No description available."; const detailUrl = `${window.location.origin}/p/details.html?id=${currentItem.id}&type=${mediaType}`;
                const bookmarked = isBookmarked(currentItem.id);
                const bookmarkButtonClass = bookmarked ? 'bookmarked' : '';
                const bookmarkButtonTitle = bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist';
                const posterPathForBookmark = currentItem.poster_path ? `https://image.tmdb.org/t/p/w500${currentItem.poster_path}` : 'https://i.imgur.com/YyHsyEr.png';
                const bookmarkButtonIcon = bookmarked ? svgIconBookmarkChecked : svgIconBookmarkPlus;
                actionsEl.innerHTML = `
                    <a href="${detailUrl}" class="slider-action-btn play"><svg class="play-button" height="60px" version="1.1" viewBox="0 0 60 60" width="60px"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><circle cx="30" cy="30" fill="var(--keycolor)" r="30"></circle><path d="M35.7461509,22.4942263 L45.1405996,36.5858994 C46.059657,37.9644855 45.6871354,39.8270935 44.3085493,40.7461509 C43.8157468,41.0746859 43.2367237,41.25 42.6444487,41.25 L23.8555513,41.25 C22.198697,41.25 20.8555513,39.9068542 20.8555513,38.25 C20.8555513,37.657725 21.0308654,37.078702 21.3594004,36.5858994 L30.7538491,22.4942263 C31.6729065,21.1156403 33.5355145,20.7431187 34.9141006,21.662176 C35.2436575,21.8818806 35.5264463,22.1646695 35.7461509,22.4942263 Z" fill="#FFFFFF" transform="translate(33.250000, 30.000000) rotate(-270.000000) translate(-33.250000, -30.000000) "></path></g></svg></a>
                    <button class="slider-action-btn add ${bookmarkButtonClass}" title="${bookmarkButtonTitle}" data-id="${currentItem.id}" data-type="${mediaType}" data-title="${currentItem.title || currentItem.name}" data-poster="${posterPathForBookmark}">${bookmarkButtonIcon}</button>`;
                if (sliderInterval) clearInterval(sliderInterval); sliderInterval = setInterval(() => changeSlide(1), 7000);
            }
            function changeSlide(direction) { showSlide(currentIndex + direction); }
            sliderWrapper.querySelector('.slider-arrow.left').onclick = () => changeSlide(-1);
            sliderWrapper.querySelector('.slider-arrow.right').onclick = () => changeSlide(1);
            if (window.bookmarkItemFromSlider) { delete window.bookmarkItemFromSlider; }
            actionsEl.addEventListener('click', (e) => { const bookmarkBtn = e.target.closest('.slider-action-btn.add'); if (bookmarkBtn) { toggleBookmark({ id: bookmarkBtn.dataset.id, type: bookmarkBtn.dataset.type, title: bookmarkBtn.dataset.title, poster: bookmarkBtn.dataset.poster }); showSlide(currentIndex); } });
            if (slides.length > 0) showSlide(0);
        } catch (err) { console.error("Failed to load slider content:", err); if (sliderWrapper) sliderWrapper.innerHTML = "<p style='color:red;'>Error loading slider.</p>"; }
    }

    async function initContentRows(apiKey, loaderLogoUrl, genreMap) {
        const isDesktop = !('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        function buildApiUrl(endpoint, apiKey) {
            const baseUrl = "https://api.themoviedb.org/3/";
            const separator = endpoint.includes('?') ? '&' : '?';
            return `${baseUrl}${endpoint}${separator}api_key=${apiKey}&language=en-US`;
        }

        const getMediaType = (item, endpointPath) => { if (item.media_type) return item.media_type; if (endpointPath.includes("tv")) return "tv"; return "movie"; };

        document.querySelectorAll(".widget-content").forEach((contentEl) => {
            const parentWidget = contentEl.closest(".widget");
            if (!parentWidget || ["HTML01", "Text1", "Text2"].includes(parentWidget.id)) return;
            const endpointPath = contentEl.textContent.trim();
            if (!endpointPath || endpointPath.includes(" ") || endpointPath.startsWith("http")) return;
            const wrapper = document.createElement("div");
            wrapper.className = "tmdb-wrapper";
            const displayEl = document.createElement("div");
            displayEl.className = "tmdb-row";
            displayEl.innerHTML = [...Array(7)].map(() => `<div class="tmdb-card shimmer-card"><div class="tmdb-thumb shimmer"><img src="${loaderLogoUrl}" class="tmdb-logo" alt="Logo" /></div><div class="tmdb-title shimmer"></div></div>`).join("");
            wrapper.appendChild(displayEl);
            contentEl.insertAdjacentElement("afterend", wrapper);
            const observer = new IntersectionObserver(async (entries, obs) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    obs.unobserve(entry.target);
                    try {
                        const res = await fetch(buildApiUrl(endpointPath, apiKey));
                        const data = await res.json();
                        const results = data.results || [];
                        if (results.length === 0) { displayEl.innerHTML = "<p>No results found.</p>"; return; }
                        displayEl.innerHTML = results.slice(0, 20).map(item => {
                            const mediaType = getMediaType(item, endpointPath);
                            const title = item.title || item.name || "Untitled";
                            const image = item.poster_path;
                            if (!image) return '';
                            const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
                            const rating = item.vote_average?.toFixed(1) || "N/A";
                            const dynamicLink = `${window.location.origin}/p/details.html?id=${item.id}&type=${mediaType}`;
                            const primaryGenreId = item.genre_ids?.[0];
                            const genreLabel = primaryGenreId ? (genreMap[primaryGenreId] || '') : '';
                            const allGenres = JSON.stringify((item.genre_ids || []).map(id => genreMap[id]).filter(Boolean));
                            const overview = (item.overview || '').replace(/"/g, '&quot;');
                            const backdrop = item.backdrop_path || item.poster_path;
                            const playButtonHTML = isDesktop ? '' : `<div class="play-btn"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="var(--keycolor)"/><path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="#FFFFFF"/></svg></div>`;
                            return `<a class="tmdb-card" title="${title}" href="${dynamicLink}"
                                      data-id="${item.id}" data-type="${mediaType}" data-title="${title}"
                                      data-backdrop="${backdrop}" data-year="${year}" data-rating="${rating}"
                                      data-overview="${overview}" data-genres='${allGenres}'>
                                      <div class="tmdb-thumb">
                                        ${genreLabel ? `<span class="tmdb-genre-label">${genreLabel}</span>` : ''}
                                        <img src="https://image.tmdb.org/t/p/w300${image}" alt="${title}" loading="lazy" />
                                        <div class="hover-overlay"></div>
                                        <span class="tmdb-meta tmdb-year">${year}</span>
                                        <span class="tmdb-meta tmdb-rating"><i class="bi bi-star"></i> ${rating}</span>
                                        ${playButtonHTML} 
                                      </div>
                                      <div class="tmdb-title">${title}</div>
                                    </a>`;
                        }).join("");
                        const leftBtn = document.createElement("button"); leftBtn.className = "tmdb-scroll left"; leftBtn.innerHTML = "&#8249;";
                        const rightBtn = document.createElement("button"); rightBtn.className = "tmdb-scroll right"; rightBtn.innerHTML = "&#8250;";
                        wrapper.prepend(leftBtn);
                        wrapper.append(rightBtn);
                        manageScrollButtons(wrapper);
                    } catch (err) {
                        displayEl.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
                        console.error("Failed to load content row:", err);
                    }
                }
            }, { threshold: 0.1, rootMargin: '150px 0px' });
            observer.observe(wrapper);
        });
    }

    async function initializeApp(apiKey) {
        setupToastNotification();
        updateBookmarkCount();
        initTmdbHoverPopups();
        const path = window.location.pathname;
        const isDetailsPage = path.includes('/p/details.html');
        const isPlayerPage = path.includes('/p/player.html');

        if (!isDetailsPage && !isPlayerPage && document.getElementById("tmdb-slider")) {
            // This is the homepage, so we will manage the preloader here.
            const sliderWrapper = document.querySelector('.slider-wrapper');
            const mainContentWrapper = sliderWrapper ? sliderWrapper.parentElement : null;

            if (mainContentWrapper) {
                const preloaderHTML = `
                    <div id="page-loader">
                        <div class="spinner"></div>
                    </div>
                `;
                document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
                mainContentWrapper.classList.add('content-hidden');

                const loader = document.getElementById('page-loader');
                try {
                    await initHomepage(apiKey);
                } catch (error) {
                    console.error("Homepage initialization failed:", error);
                    mainContentWrapper.innerHTML = "<p style='color:red; text-align:center;'>Failed to load homepage content.</p>";
                } finally {
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => { loader.style.display = 'none'; }, 300);
                    }
                    mainContentWrapper.classList.remove('content-hidden');
                }
            } else {
                 // Fallback if a proper wrapper isn't found, just run normally without a loader
                await initHomepage(apiKey);
            }
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
                const errorTargets = [document.getElementById("tmdb-slider")];
                document.querySelectorAll(".tmdb-row").forEach(el => el.innerHTML = "<p style='color:red;'>Error: API configuration is missing.</p>");
                errorTargets.forEach(el => { if (el) el.innerHTML = "<p style='color:red; text-align:center; padding: 2rem;'>Error: API configuration is missing.</p>"; });
            }
        }, 100);
    }

    waitForApiKey();
});
