(function(){const isPlayerPage=window.location.pathname.includes('/p/player.html');if(!isPlayerPage)return;let attempts=0;const maxAttempts=50;const interval=setInterval(()=>{if(window.apiKey){clearInterval(interval);initPlayerPage(window.apiKey)}else if(attempts++>=maxAttempts){clearInterval(interval);console.error("FATAL: API Key (window.apiKey) was not found.");const container=document.getElementById('abefilm-player-container');if(container){container.innerHTML="<p style='color:red; text-align:center;'>Error: API configuration is missing.</p>"}}},100)})();

function renderPlayerLayout() {
    const isMobile = window.innerWidth <= 768;

    const videoWrapperHTML = `
        <div id='player-video-wrapper'>
            <div id='video-player-embed'></div>
            <div id='mobile-video-controls-bar'>
                <div class="mobile-control-btn active" id="mobile-video-tab">Video</div>
                <div class="mobile-control-btn" id="mobile-comment-tab">Comment <span id="commentCount">10k</span></div>
            </div>
            <div id='video-controls-bar'>
                <div class="control-group left">
                    <button class="player-btn" id="player-comment-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M14 6H22M18 2L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.09881 19.5C4.7987 19.3721 3.82475 18.9816 3.17157 18.3284C2 17.1569 2 15.2712 2 11.5V11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H11.5M6.5 18C6.29454 19.0019 5.37769 21.1665 6.31569 21.8651C6.806 22.2218 7.58729 21.8408 9.14987 21.0789C10.2465 20.5441 11.3562 19.9309 12.5546 19.655C12.9931 19.5551 13.4395 19.5125 14 19.5C17.7712 19.5 19.6569 19.5 20.8284 18.3284C21.947 17.2098 21.9976 15.4403 21.9999 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M8 14H14M8 9H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Comment</span></button>
                    <button class="player-btn" id="player-bookmark-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 9.78274 21.6486 10.9014 21.0775 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M14 16H17.5M17.5 16H21M17.5 16V12.5M17.5 16V19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg><span>Add</span></button>
                    <button class="player-btn" id="player-share-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z" stroke="currentColor" stroke-width="1.5" /><path d="M11.5 12.5L15 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg><span>Share</span></button>
                </div>
                <div class="control-group center">
                    <button class="player-btn" id="player-prev-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M8.06492 12.6258C8.31931 13.8374 9.67295 14.7077 12.3802 16.4481C15.3247 18.3411 16.797 19.2876 17.9895 18.9229C18.3934 18.7994 18.7654 18.5823 19.0777 18.2876C20 17.4178 20 15.6118 20 12C20 8.38816 20 6.58224 19.0777 5.71235C18.7654 5.41773 18.3934 5.20057 17.9895 5.07707C16.797 4.71243 15.3247 5.6589 12.3802 7.55186C9.67295 9.29233 8.31931 10.1626 8.06492 11.3742C7.97836 11.7865 7.97836 12.2135 8.06492 12.6258Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M4 4L4 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg><span>Previous</span></button>
                    <span id="ep-pagination"></span>
                    <button class="player-btn" id="player-next-btn"><span>Next</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M15.9351 12.6258C15.6807 13.8374 14.327 14.7077 11.6198 16.4481C8.67528 18.3411 7.20303 19.2876 6.01052 18.9229C5.60662 18.7994 5.23463 18.5823 4.92227 18.2876C4 17.4178 4 15.6118 4 12C4 8.38816 4 6.58224 4.92227 5.71235C5.23463 5.41773 5.60662 5.20057 6.01052 5.07707C7.20304 4.71243 8.67528 5.6589 11.6198 7.55186C14.327 9.29233 15.6807 10.1626 15.9351 11.3742C16.0216 11.7865 16.0216 12.2135 15.9351 12.6258Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M20 5V19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></button>
                </div>
                <div class="control-group right">
                     <button class="player-btn" id="player-reload-btn" title="Reload Player"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M15.1667 0.999756L15.7646 2.11753C16.1689 2.87322 16.371 3.25107 16.2374 3.41289C16.1037 3.57471 15.6635 3.44402 14.7831 3.18264C13.9029 2.92131 12.9684 2.78071 12 2.78071C6.75329 2.78071 2.5 6.90822 2.5 11.9998C2.5 13.6789 2.96262 15.2533 3.77093 16.6093M8.83333 22.9998L8.23536 21.882C7.83108 21.1263 7.62894 20.7484 7.7626 20.5866C7.89627 20.4248 8.33649 20.5555 9.21689 20.8169C10.0971 21.0782 11.0316 21.2188 12 21.2188C17.2467 21.2188 21.5 17.0913 21.5 11.9998C21.5 10.3206 21.0374 8.74623 20.2291 7.39023" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Reload</span></button>
                    <button class="player-btn" id="player-light-btn" title="Toggle Lights"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M14 10C13.3875 10.6432 12.7111 11 12 11C11.2889 11 10.6125 10.6432 10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="currentColor" stroke-width="1.5"></path><path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="currentColor" stroke-width="1.5"></path><path d="M12 15.5V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Lights</span></button>
                    <button class="player-btn" id="player-fullscreen-btn" title="Fullscreen"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none"><path d="M15.5 21C16.8956 21 17.5933 21 18.1611 20.8278C19.4395 20.44 20.44 19.4395 20.8278 18.1611C21 17.5933 21 16.8956 21 15.5M21 8.5C21 7.10444 21 6.40666 20.8278 5.83886C20.44 4.56046 19.4395 3.56004 18.1611 3.17224C17.5933 3 16.8956 3 15.5 3M8.5 21C7.10444 21 6.40666 21 5.83886 20.8278C4.56046 20.44 3.56004 19.4395 3.17224 18.1611C3 17.5933 3 16.8956 3 15.5M3 8.5C3 7.10444 3 6.40666 3.17224 5.83886C3.56004 4.56046 4.56046 3.56004 5.83886 3.17224C6.40666 3 7.10444 3 8.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Fullscreen</span></button>
                </div>
            </div>
        </div>`;

    const sidebarModuleHTML = `
        <div class='sidebar-module' id='episode-sidebar'>
             <div class='mobile-controls'>
                <div class='sidebar-dropdowns-container'>
                    <div id="player-source-selector" class="custom-select-wrapper player-select"></div>
                    <div id="player-season-selector-mobile" class="custom-select-wrapper player-select"></div>
                    <a id="player-download-button" class="custom-select-wrapper player-select player-download-btn" title="Download">
                        <div class="custom-select-trigger">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7a7a7a" fill="none">
                                <path d="M2.99969 17.0002C2.99969 17.9302 2.99969 18.3952 3.10192 18.7767C3.37932 19.8119 4.18796 20.6206 5.22324 20.898C5.60474 21.0002 6.06972 21.0002 6.99969 21.0002L16.9997 21.0002C17.9297 21.0002 18.3947 21.0002 18.7762 20.898C19.8114 20.6206 20.6201 19.8119 20.8975 18.7767C20.9997 18.3952 20.9997 17.9302 20.9997 17.0002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16.4998 11.5002C16.4998 11.5002 13.1856 16.0002 11.9997 16.0002C10.8139 16.0002 7.49976 11.5002 7.49976 11.5002M11.9997 15.0002V3.00016" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                   </a>
                    <div id="player-sandbox-selector" class="custom-select-wrapper player-select"></div>
                </div>
                <div id="mobile-episode-nav">
                    <div class="mobile-ep-nav-group">
                        <button id="mobile-prev-btn" class="mobile-ep-btn">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="var(--text-color)" fill="none">
    <path d="M8.06492 12.6258C8.31931 13.8374 9.67295 14.7077 12.3802 16.4481C15.3247 18.3411 16.797 19.2876 17.9895 18.9229C18.3934 18.7994 18.7654 18.5823 19.0777 18.2876C20 17.4178 20 15.6118 20 12C20 8.38816 20 6.58224 19.0777 5.71235C18.7654 5.41773 18.3934 5.20057 17.9895 5.07707C16.797 4.71243 15.3247 5.6589 12.3802 7.55186C9.67295 9.29233 8.31931 10.1626 8.06492 11.3742C7.97836 11.7865 7.97836 12.2135 8.06492 12.6258Z" stroke="var(--text-color)" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M4 4L4 20" stroke="var(--text-color)" stroke-width="1.5" stroke-linecap="round"></path>
</svg>
                        </button>
                        <button id="mobile-next-btn" class="mobile-ep-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="var(--text-color)" fill="none">
    <path d="M15.9351 12.6258C15.6807 13.8374 14.327 14.7077 11.6198 16.4481C8.67528 18.3411 7.20303 19.2876 6.01052 18.9229C5.60662 18.7994 5.23463 18.5823 4.92227 18.2876C4 17.4178 4 15.6118 4 12C4 8.38816 4 6.58224 4.92227 5.71235C5.23463 5.41773 5.60662 5.20057 6.01052 5.07707C7.20304 4.71243 8.67528 5.6589 11.6198 7.55186C14.327 9.29233 15.6807 10.1626 15.9351 11.3742C16.0216 11.7865 16.0216 12.2135 15.9351 12.6258Z" stroke="var(--text-color)" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M20 5V19" stroke="var(--text-color)" stroke-width="1.5" stroke-linecap="round"></path>
</svg>
                        </button>
                    </div>
                    <button id="mobile-episodes-view-more" class="mobile-ep-btn">
                        Episodes
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 8L4 16M8 4L8 20M12 6L12 18M16 4L16 20M20 8L20 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>
            <h2 id='series-title-sidebar'>Loading...</h2>
            <div class="desktop-controls">
                <div id="sidebar-tabs">
                    <button class="sidebar-tab-btn active" data-panel="episodes-panel">Episode</button>
                    <button class="sidebar-tab-btn" data-panel="season-panel">Season</button>
                    <button class="sidebar-tab-btn" data-panel="download-panel">Download</button>
                    <button class="sidebar-tab-btn" data-panel="servers-panel">Server</button>
                </div>
            </div>
            <div id="sidebar-panels">
                <div class="sidebar-panel active" id="episodes-panel">
                    <div class='episode-header'>
                        <span id='episode-count-sidebar'>Episodes</span>
                        <div id="season-and-view-controls">
                           <div id="player-season-selector-desktop" class="custom-select-wrapper player-select"></div>
                           <button id='episode-view-toggle' title='Toggle View'></button>
                        </div>
                    </div>
                    <div class='grid-view' id='episode-list'></div>
                </div>
                <div class="sidebar-panel" id="season-panel"></div>
                <div class="sidebar-panel" id="download-panel"></div>
                <div class="sidebar-panel" id="servers-panel"></div>
            </div>       
            <div id="sidebar-bottom-controls"></div>
        </div>`;

    const mainDetailsHTML = `
        <div id='player-main-details'>
            <div class='video-details-content'>
                <h1 id='video-title-main'>Loading title...</h1>
                <div class='details-meta-grid'>
                    <div id='video-meta-main'></div>
                    <div id='video-meta-badges'></div>
                </div>
                <div class='video-tags-main' id='video-tags-main'></div>
                <p id='video-description-main'></p>
                
                ${isMobile ? sidebarModuleHTML : ''}

                <div class='details-row' id='cast-section'>
                    <h2>Cast</h2>
                    <div class='scroll-wrapper'><div class='horizontal-scroll-content' id='cast-scroll-container'></div><button aria-label='Scroll Left' class='scroll-btn left'>&#8249;</button><button aria-label='Scroll Right' class='scroll-btn right'>&#8250;</button></div>
                </div>
                <div class='details-row' id='recommendations-section'>
                    <h2>Recommended For You</h2>
                    <div class='scroll-wrapper'><div class='horizontal-scroll-content' id='recommendations-scroll-container'></div><button aria-label='Scroll Left' class='scroll-btn left'>&#8249;</button><button aria-label='Scroll Right' class='scroll-btn right'>&#8250;</button></div>
                </div>
                <div class='comment-container' id='comment-section'>
                    <div class='reaction-container'>
                        <h4>What’s your opinion on this?</h4>
                        <div class='responses'><span id='totalResponses'>0</span> Responses</div>
                        <div class='reaction-bar'>
                        <div class='reaction' data-reaction='upvote'><div class='emoji'>👍</div><div class='label'>Upvote</div><div class='count' id='upvote-count'>0</div></div>
                        <div class='reaction' data-reaction='funny'><div class='emoji'>😝</div><div class='label'>Funny</div><div class='count' id='funny-count'>0</div></div>
                        <div class='reaction' data-reaction='love'><div class='emoji'>😍</div><div class='label'>Love</div><div class='count' id='love-count'>0</div></div>
                        <div class='reaction' data-reaction='surprised'><div class='emoji'>😮</div><div class='label'>Surprised</div><div class='count' id='surprised-count'>0</div></div>
                        <div class='reaction' data-reaction='angry'><div class='emoji'>😠</div><div class='label'>Angry</div><div class='count' id='angry-count'>0</div></div>
                        <div class='reaction' data-reaction='sad'><div class='emoji'>😢</div><div class='label'>Sad</div><div class='count' id='sad-count'>0</div></div>
                        </div>
                    </div>
                    <div class='comment-box'>
                        <h3>Add Comment</h3>
                        <div id='loginPrompt'><p>Please log in or sign up to add a comment.</p><button class='comment-btn' id='showAuthModalBtn'>Login / Sign Up</button></div>
                        <div class='comment-form-container' id='commentFormContainer'>
                        <div id='userInfoDisplay'><img alt='User Avatar' id='currentUserAvatar' src='https://cdn-icons-png.flaticon.com/128/1046/1046929.png'/><span> <strong id='currentUsernameDisplay'>Guest</strong></span><button class='comment-btn' id='logoutBtn'>Logout</button></div>
                        <div class='comment-input-area'><textarea id='message' placeholder='What&apos;s on your mind?' required='true'></textarea><button class='comment-btn' id='submit'>Comment</button></div>
                        </div>
                    </div>
                    <div class='sort-container'>
                        <div><strong>Comments (<span id='commentCount'>0</span>)</strong></div>
                        <div style='display: flex; align-items: center;'><label for='sortDropdown'>Sort by:</label><div class='custom-dropdown' id='customSortDropdown'><div class='selected-option'>Most Recent</div><ul class='dropdown-options'><li class='active' data-value='recent'>Most Recent</li><li data-value='oldest'>Oldest</li></ul></div></div>
                    </div>
                    <div id='comments-list'></div>
                    <div class='modal' id='avatarModal'><div class='modal-content'><span class='close' id='closeAvatarModalBtn'><i class='bi bi-x'></i></span><h4>Choose Your Avatar</h4><div class='tabs'><button class='tab-btn active' data-tab='person'>Person</button><button class='tab-btn' data-tab='animal'>Animal</button><button class='tab-btn' data-tab='animation'>Animation</button><button class='tab-btn' data-tab='emoji'>Emoji</button></div><div class='tab-content active' id='person'></div><div class='tab-content' id='animal'></div><div class='tab-content' id='animation'></div><div class='tab-content' id='emoji'></div><button class='comment-btn' id='saveAvatarBtn' style='margin-top: 20px;'>Save Avatar</button></div></div>
                    <div class='modal' id='authModal'><div class='modal-content'><span class='close' id='closeAuthModalBtn'>x</span><h4>Welcome!</h4><div class='tabs'><button class='tab-btn comment-btn active' data-tab='login'>Login</button><button class='tab-btn comment-btn' data-tab='signup'>Sign Up</button></div><div class='tab-content active' id='login'><input id='loginEmail' placeholder='Email' required='true' type='email'/><input id='loginPassword' placeholder='Password' required='true' type='password'/><button class='comment-btn' id='signInBtn'>Login</button><button class='comment-btn' id='guestSignInBtn'>Login as Guest</button></div><div class='tab-content' id='signup'><input id='signupEmail' placeholder='Email' required='true' type='email'/><input id='signupPassword' placeholder='Password' required='true' type='password'/><input id='signupUsername' placeholder='Your Display Name' required='true' type='text'/><button class='comment-btn' id='signUpBtn'>Sign Up</button></div></div></div>
                </div>
            </div>
        </div>`;
    
    const detailsSidebarHTML = `
        <div id='player-details-sidebar'>
            <div class='sidebar-module' id='top-movies-sidebar'>
                <h2>Top Searches</h2>
                <div id='top-movies-list'></div>
            </div>
        </div>`;

    let layoutHTML = `
        <!-- START: Page Loader -->
        <div id="page-loader">
            <div class="spinner"></div>
        </div>
        <!-- END: Page Loader -->`;

    if (isMobile) {
        layoutHTML += `
            <div id='player-top-section' class='content-hidden'>
                ${videoWrapperHTML}
            </div>
            <div id='player-details-section' class='content-hidden'>
                ${mainDetailsHTML}
                ${detailsSidebarHTML}
            </div>`;
    } else {
        // Desktop Layout (Original Structure)
        layoutHTML += `
            <div id='player-top-section' class='content-hidden'>
                ${videoWrapperHTML}
                ${sidebarModuleHTML}
            </div>
            <div id='player-details-section' class='content-hidden'>
                ${mainDetailsHTML}
                ${detailsSidebarHTML}
            </div>`;
    }

    layoutHTML += `
        <div id="episodes-modal-overlay">
            <div id="episodes-modal-content">
                <div id="episodes-modal-header">
                    <h3 id="episodes-modal-title">Episodes</h3>
                    <button id="episodes-modal-close-btn">&times;</button>
                </div>
                <div id="episodes-modal-list"></div>
            </div>
        </div>
        <div id="download-modal-overlay">
            <div id="download-modal-content">
                <div id="download-modal-header">
                    <h3 id="download-modal-title">Download</h3>
                    <button id="download-modal-close-btn">&times;</button>
                </div>
                <div id="download-modal-list"></div>
            </div>
        </div>`;
    
    return layoutHTML;
}

async function initPlayerPage(API_KEY){
    const container=document.getElementById('abefilm-player-container');
    if(!container)return;
    container.innerHTML=renderPlayerLayout();
    
    // The CSS injection block that was here has been removed.

    const isMobile = window.innerWidth <= 768;
    const BASE_URL="https://api.themoviedb.org/3";
    const IMG_URL="https://image.tmdb.org/t/p/";
    const params=new URLSearchParams(window.location.search);
    const id=params.get("id");
    const type=params.get("type");
    let currentSeason=parseInt(params.get("season")||1);
    let currentEpisode = Math.max(1, parseInt(params.get("ep") || 1));
    let seriesTitle = '';
    let currentSeasonDetails = null;
    let isSandboxEnabled=localStorage.getItem('abefilm_sandbox_enabled')==='false'?false:true;
    if(!id||!type){container.innerHTML="<p style='color:red; text-align:center;'>Error: Missing content ID or type.</p>";return}
    
    document.body.classList.add('player-type-' + type);

    const ICONS = {
        list: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M17.25 3V10.5M21 6.75L13.5 6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 9.56928 3.1903 19.4567Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
        grid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M10.5 6.75C10.5 4.67893 8.82107 3 6.75 3C4.67893 3 3 4.67893 3 6.75C3 8.82107 4.67893 10.5 6.75 10.5C8.82107 10.5 10.5 8.82107 10.5 6.75Z" stroke="currentColor" stroke-width="1.5" /><path d="M21 17.25C21 15.1789 19.3211 13.5 17.25 13.5C15.1789 13.5 13.5 15.1789 13.5 17.25C13.5 19.3211 15.1789 21 17.25 21C19.3211 21 21 19.3211 21 17.25Z" stroke="currentColor" stroke-width="1.5" /><path d="M10.5 17.25C10.5 15.1789 8.82107 13.5 6.75 13.5C4.67893 13.5 3 15.1789 3 17.25C3 19.3211 4.67893 21 6.75 21C8.82107 21 10.5 19.3211 10.5 17.25Z" stroke="currentColor" stroke-width="1.5" /><path d="M21 6.75L13.5 6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
        sandboxOn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                        <path d="M12 2.5C12 2.5 4 3.5 4 11.5C4 18.5 12 21.5 12 21.5C12 21.5 20 18.5 20 11.5C20 3.5 12 2.5 12 2.5Z" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.5 11L11.5 13L14.5 10" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`,
        sandboxOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                         <path d="M12.0001 2.5C12.0001 2.5 4.00006 3.5 4.00006 11.5C4.00006 15.6531 6.55149 18.9912 10.1341 20.6757M14.6501 20.3013C17.7915 18.9056 20.0001 15.526 20.0001 11.5C20.0001 3.5 12.0001 2.5 12.0001 2.5" stroke="#F44336" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                         <path d="M4 4L20 20" stroke="#F44336" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                     </svg>`
    };

    let videoSources = [];
    let currentSourceIndex = 0;

    function loadVideoSources() {
        const sourceWidgets = document.querySelectorAll('.video-sources .widget');
        sourceWidgets.forEach(widget => {
            const name = widget.querySelector('.title')?.textContent.trim();
            const contentEl = widget.querySelector('.widget-content');
            if (!name || !contentEl) return;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentEl.innerHTML;

            let logoInfo = { type: 'none', value: null };
            const imgTag = tempDiv.querySelector('img');
            if (imgTag) {
                logoInfo = { type: 'direct', value: imgTag.src };
                imgTag.remove();
            }

            const urls = tempDiv.textContent.trim().split('\n').map(url => url.trim()).filter(Boolean);

            if (urls.length >= 2) {
                const movieUrl = urls[0];
                const tvUrl = urls[1];
                
                if (logoInfo.type === 'none') {
                    try {
                        const domain = new URL(movieUrl).hostname;
                        logoInfo = { type: 'fallback', value: domain };
                    } catch (e) {
                        console.warn(`Could not parse domain for source: ${name}`);
                    }
                }
                videoSources.push({ name, movieUrl, tvUrl, logoInfo });
            }
        });
        const savedSource = localStorage.getItem('abefilm_player_source');
        const savedIndex = videoSources.findIndex(s => s.name === savedSource);
        if (savedIndex !== -1) {
            currentSourceIndex = savedIndex;
        }
    }

    function getSourceLogo(source) {
        if (!source || !source.logoInfo || source.logoInfo.type === 'none') return '';
        if (source.logoInfo.type === 'direct') {
            return `<img src="${source.logoInfo.value}" alt="${source.name} logo" />`;
        }
        if (source.logoInfo.type === 'fallback') {
            const domain = source.logoInfo.value;
            const localIconPath = `/icons/${domain}.png`;
            const fallbackIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            return `<img src="${localIconPath}" onerror="this.onerror=null; this.src='${fallbackIcon}';" class="source-logo" alt="${domain} logo" />`;
        }
        return '';
    }

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
    
    let genreMap=new Map();
    
    async function fetchGenres(){try{const[movieRes,tvRes]=await Promise.all([fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`),fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`)]);const movieData=await movieRes.json();const tvData=await tvRes.json();movieData.genres.forEach(g=>genreMap.set(g.id,g.name));tvData.genres.forEach(g=>genreMap.set(g.id,g.name))}catch(error){console.error("Failed to fetch genres:",error)}}
    
    function renderVideoPlayer() {
        const playerContainer = document.getElementById('video-player-embed');
        if (!playerContainer || videoSources.length === 0) return;
        
        const source = videoSources[currentSourceIndex];
        const urlTemplate = (type === 'movie') ? source.movieUrl : source.tvUrl;
        
        const videoUrl = urlTemplate
            .replace(/\$\{id\}/g, id)
            .replace(/\$\{season\}/g, currentSeason)
            .replace(/\$\{episode\}/g, currentEpisode);
            
        const sandboxAttribute = isSandboxEnabled ? 'sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"' : '';
        playerContainer.innerHTML = `<iframe src="${videoUrl}" ${sandboxAttribute} allowfullscreen></iframe>`;
    }
    
    function renderVideoDetails(details, credits) {
        seriesTitle = details.name || details.title;
        const titleEl = document.getElementById('video-title-main');
        if (titleEl) {
            if (type === 'tv') {
                titleEl.textContent = `${seriesTitle} › Season ${currentSeason} › Episode ${currentEpisode}`;
            } else {
                titleEl.textContent = seriesTitle;
            }
        }
        const year = (details.first_air_date || details.release_date || '').split('-')[0];
        const rating = details.vote_average?.toFixed(1);
        const voteCount = details.vote_count || 0;
        const metaMainEl = document.getElementById('video-meta-main');
        if (metaMainEl) {
            metaMainEl.innerHTML = `<span class="star">★ ${rating}</span> <span class="vote-count">(${voteCount.toLocaleString()} ratings)</span> <span class="separator">|</span> <a href="#">Rate now</a>`;
        }
        const releaseDates = details.release_dates || details.content_ratings;
        let certification = 'NR';
        if (releaseDates?.results) {
            const usRating = releaseDates.results.find(r => r.iso_3166_1 === 'US');
            if (usRating) {
                certification = (type === 'movie' ? usRating.release_dates?.[0]?.certification : usRating.rating) || 'NR';
            }
        }
        const isOriginal = ['Netflix', 'Amazon', 'Hulu', 'HBO'].some(p => details.production_companies?.some(c => c.name.includes(p)));
        const metaBadgesEl = document.getElementById('video-meta-badges');
        if (metaBadgesEl) {
            metaBadgesEl.innerHTML = `<span class="meta-badge">TOP 8</span> ${isOriginal ? '<span>Original</span>' : ''} <span>${certification}</span> <span>${year}</span>`;
        }
        const tagsMainEl = document.getElementById('video-tags-main');
        if (tagsMainEl) {
            tagsMainEl.innerHTML = (details.genres || []).map(g => `<span>${g.name}</span>`).join('');
        }
        const descContainer = document.getElementById('video-description-main');
        if (descContainer) {
            descContainer.innerHTML = `<strong>Description:</strong> ${details.overview || "No description available."} <span id="desc-toggle">More <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg></span>`;
            const descToggle = document.getElementById('desc-toggle');
            if (descToggle) {
                if (descContainer.offsetHeight >= descContainer.scrollHeight - 5) {
                    descToggle.style.display = 'none';
                } else {
                    descToggle.addEventListener('click', () => {
                        descContainer.classList.toggle('expanded');
                    });
                }
            }
        }
    }
    
    function renderEpisodeList(detailsData, seasonDetails, currentEp) {
        const listContainer = document.getElementById('episode-list');
        const countEl = document.getElementById('episode-count-sidebar');
        if (!listContainer || !countEl || !seasonDetails?.episodes) return;

        countEl.textContent = `Episodes 1-${seasonDetails.episodes.length}`;
        const isListView = listContainer.classList.contains('list-view');

        const backdropUrl = detailsData && detailsData.backdrop_path ?
            IMG_URL + 'w300' + detailsData.backdrop_path :
            'https://i.imgur.com/gG2Vb2x.png';

        if (isListView) {
            const playIconSVG = `<svg class="play-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" /><path d="M40 30 L70 50 L40 70 Z"/></svg>`;
            listContainer.innerHTML = seasonDetails.episodes.map(ep => {
                const thumbUrl = ep.still_path ? IMG_URL + 'w300' + ep.still_path : backdropUrl;

                let episodeTitle = ep.name;
                if (!episodeTitle || episodeTitle === 'TBA' || episodeTitle.toLowerCase() === `episode ${ep.episode_number}`) {
                    episodeTitle = '';
                }

                return `<div class="episode-list-item ${ep.episode_number == currentEp ? 'active' : ''}" data-ep="${ep.episode_number}" data-season="${ep.season_number}">
                            <div class="thumb">
                                <img src="${thumbUrl}" loading="lazy" alt="Episode ${ep.episode_number}">
                                <div class="thumb-overlay">
                                    <span class="now-playing-text">Now playing...</span>
                                    ${playIconSVG}
                                </div>
                            </div>
                            <div class="details">
                                <p class="episode-number-text">Episode ${ep.episode_number}</p>
                                ${episodeTitle ? `<p class="episode-title-text">${episodeTitle}</p>` : ''}
                            </div>
                        </div>`;
            }).join('');
        } else { // Grid view
            listContainer.innerHTML = seasonDetails.episodes.map(ep => `<button class="episode-btn ${ep.episode_number == currentEp ? 'active' : ''}" data-ep="${ep.episode_number}" data-season="${ep.season_number}">${ep.episode_number}</button>`).join('');
        }
        addEpisodeClickListeners(seasonDetails);
    }

    function renderEpisodesModal(seasonDetails, currentEp) {
        const modalListContainer = document.getElementById('episodes-modal-list');
        if (!modalListContainer || !seasonDetails?.episodes) return;

        modalListContainer.innerHTML = seasonDetails.episodes.map(ep => `<button class="episode-btn ${ep.episode_number == currentEp ? 'active' : ''}" data-ep="${ep.episode_number}" data-season="${ep.season_number}">${ep.episode_number}</button>`).join('');

        modalListContainer.querySelectorAll('.episode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newEpisode = parseInt(btn.dataset.ep);
                const newSeason = parseInt(btn.dataset.season);
                document.getElementById('episodes-modal-overlay').classList.remove('visible');
                if (currentEpisode === newEpisode && currentSeason === newSeason) return;
                updatePlayerAndUrl(seasonDetails, newSeason, newEpisode);
            });
        });
    }

    function renderDownloadPanel(seasonDetails) {
        // Desktop Panel
        const desktopContainer = document.getElementById('download-panel');
        if (desktopContainer) {
            const downloadIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="var(--text-secondary)" fill="none">
                                        <path d="M2.99969 17.0002C2.99969 17.9302 2.99969 18.3952 3.10192 18.7767C3.37932 19.8119 4.18796 20.6206 5.22324 20.898C5.60474 21.0002 6.06972 21.0002 6.99969 21.0002L16.9997 21.0002C17.9297 21.0002 18.3947 21.0002 18.7762 20.898C19.8114 20.6206 20.6201 19.8119 20.8975 18.7767C20.9997 18.3952 20.9997 17.9302 20.9997 17.0002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16.4998 11.5002C16.4998 11.5002 13.1856 16.0002 11.9997 16.0002C10.8139 16.0002 7.49976 11.5002 7.49976 11.5002M11.9997 15.0002V3.00016" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>`;
            desktopContainer.innerHTML = '';
            const list = document.createElement('div');
            list.className = 'download-list';

            if (type === 'movie') {
                list.innerHTML = `<a href="https://dl.vidsrc.vip/movie/${id}" target="_blank" class="download-link">${downloadIconSVG}<span>Download Movie</span></a>`;
            } else if (type === 'tv' && seasonDetails?.episodes) {
                list.innerHTML = seasonDetails.episodes.map(ep => `<a href="https://dl.vidsrc.vip/tv/${id}/${currentSeason}/${ep.episode_number}" target="_blank" class="download-link">${downloadIconSVG}<span>Episode ${ep.episode_number}</span></a>`).join('');
            } else {
                list.innerHTML = '<p>No download links available.</p>';
            }
            desktopContainer.appendChild(list);
        }

        // Mobile Modal
        const mobileModalList = document.getElementById('download-modal-list');
        if (isMobile && mobileModalList) {
            mobileModalList.innerHTML = ''; 
            if (type === 'movie') {
                mobileModalList.innerHTML = `<a href="https://dl.vidsrc.vip/movie/${id}" target="_blank" class="download-btn-modal">Movie</a>`;
            } else if (type === 'tv' && seasonDetails?.episodes) {
                mobileModalList.innerHTML = seasonDetails.episodes.map(ep => `<a href="https://dl.vidsrc.vip/tv/${id}/${currentSeason}/${ep.episode_number}" target="_blank" class="download-btn-modal">${ep.episode_number}</a>`).join('');
            } else {
                mobileModalList.innerHTML = '<p>No download links available.</p>';
            }
        }
    }


    function renderServersPanel() {
        const container = document.getElementById('servers-panel');
        if (!container) return;

        container.innerHTML = `<div class="server-list">${videoSources.map((source, index) => `
            <button class="server-btn ${index === currentSourceIndex ? 'active' : ''}" data-index="${index}">
                ${getSourceLogo(source)}
                <span>${source.name}</span>
            </button>
        `).join('')}</div>`;

        container.querySelectorAll('.server-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newIndex = parseInt(btn.dataset.index);
                if (newIndex === currentSourceIndex) return;

                container.querySelector('.server-btn.active')?.classList.remove('active');
                btn.classList.add('active');
                
                currentSourceIndex = newIndex;
                localStorage.setItem('abefilm_player_source', videoSources[newIndex].name);
                renderVideoPlayer();
            });
        });
    }

    function renderSeasonPanel(allDetails, collectionDetails, currentSeasonNum) {
        const container = document.getElementById('season-panel');
        if (!container) return;

        container.innerHTML = ''; 
        const list = document.createElement('div');
        list.className = 'season-list';

        if (type === 'tv') {
            const validSeasons = allDetails.seasons.filter(s => s.season_number > 0 && s.episode_count > 0);
            if (validSeasons.length <= 1) {         
                document.querySelector('.sidebar-tab-btn[data-panel="season-panel"]')?.style.setProperty('display', 'none');
                return;
            }
            list.innerHTML = validSeasons.map(s =>
                `<button class="season-btn ${s.season_number == currentSeasonNum ? 'active' : ''}" data-season="${s.season_number}">
                    ${s.name}
                </button>`
            ).join('');
            container.appendChild(list);

            container.querySelectorAll('.season-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const newSeasonNum = parseInt(btn.dataset.season);
                    if (newSeasonNum === currentSeason) return;
                    
                    container.querySelector('.season-btn.active')?.classList.remove('active');
                    btn.classList.add('active');
                    
                    const seasonSelector = document.querySelector('#player-season-selector-desktop, #player-season-selector-mobile');
                    if (seasonSelector) {
                        const triggerSpan = seasonSelector.querySelector('.custom-select-trigger span');
                        if(triggerSpan) {
                             triggerSpan.textContent = isMobile ? `S${newSeasonNum}` : btn.textContent;
                        }
                        seasonSelector.querySelector('.custom-option.selected')?.classList.remove('selected');
                        seasonSelector.querySelector(`.custom-option[data-value="${newSeasonNum}"]`)?.classList.add('selected');
                    }
                    const seasonRes = await fetch(`${BASE_URL}/tv/${id}/season/${newSeasonNum}?api_key=${API_KEY}`);
                    const newSeasonDetails = await seasonRes.json();
                    currentSeasonDetails = newSeasonDetails;
                    renderEpisodeList(allDetails, newSeasonDetails, 1);
                    renderDownloadPanel(newSeasonDetails);
                    renderEpisodesModal(newSeasonDetails, 1);
                    updatePlayerAndUrl(newSeasonDetails, newSeasonNum, 1);
                });
            });

        } else if (type === 'movie' && collectionDetails && collectionDetails.parts && collectionDetails.parts.length > 1) {
            list.innerHTML = collectionDetails.parts.map(p =>
                `<a href="/p/player.html?id=${p.id}&type=movie" class="season-btn ${p.id == id ? 'active' : ''}">
                    ${p.title}
                </a>`
            ).join('');
            container.appendChild(list);
        } else {
            
            document.querySelector('.sidebar-tab-btn[data-panel="season-panel"]')?.style.setProperty('display', 'none');
        }
    }

    function addEpisodeClickListeners(seasonDetails){const listContainer=document.getElementById('episode-list');if(!listContainer)return;const selector=listContainer.classList.contains('list-view')?'.episode-list-item':'.episode-btn';listContainer.querySelectorAll(selector).forEach(btn=>{btn.addEventListener('click',()=>{const newEpisode=parseInt(btn.dataset.ep);const newSeason=parseInt(btn.dataset.season);if(currentEpisode===newEpisode&&currentSeason===newSeason)return;updatePlayerAndUrl(seasonDetails,newSeason,newEpisode)})})}
    
    function renderCast(credits) {
        const container = document.getElementById('cast-scroll-container');
        if (!container || !credits) return;
        const director = credits.crew?.find(p => p.job === 'Director');
        let castList = credits.cast || [];
        if (director) {
            castList.unshift({ name: director.name, character: 'Director', profile_path: director.profile_path });
        }
        if (castList.length === 0) {
            const castSection = document.getElementById('cast-section');
            if (castSection) castSection.style.setProperty('display', 'none');
            return;
        }
        container.innerHTML = castList.slice(0, 18).map(person => `
            <a class="cast-card-player">
                <img src="${person.profile_path ? IMG_URL + 'w185' + person.profile_path : 'https://i.imgur.com/obaaZjk.png'}" alt="${person.name}" loading="lazy">
                <div class="cast-name">${person.name}</div>
                <div class="cast-character">${person.character}</div>
            </a>`).join('');
    }

    function renderRecommendations(recommendations) {
        const container = document.getElementById('recommendations-scroll-container');
        if (!container || !recommendations?.results?.length) {
            const recSection = document.getElementById('recommendations-section');
            if (recSection) recSection.style.setProperty('display', 'none');
            return;
        }
        container.innerHTML = recommendations.results.slice(0, 18).map(item => {
            const title = item.title || item.name;
            const year = (item.release_date || item.first_air_date || "").split("-")[0];
            const rating = item.vote_average.toFixed(1);
            const genre = item.genre_ids[0] ? genreMap.get(item.genre_ids[0]) : '';
            const playButtonSVG = `<svg width="50px" height="50px" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="play-button"><g fill="none"><circle fill="var(--keycolor)" cx="30" cy="30" r="30"></circle><path d="M35.75,22.5 L45.14,36.58 C46.06,37.96 45.69,39.83 44.31,40.75 C43.82,41.07 43.24,41.25 42.64,41.25 L23.86,41.25 C22.20,41.25 20.86,39.91 20.86,38.25 C20.86,37.66 21.03,37.08 21.36,36.59 L30.75,22.5 C31.67,21.12 33.54,20.74 34.91,21.66 C35.24,21.88 35.53,22.16 35.75,22.5 Z" fill="#FFFFFF" transform="translate(33.25, 30) rotate(-270) translate(-33.25, -30)"></path></g></svg>`;
            return `
                <a href="/p/details.html?id=${item.id}&type=${item.media_type || type}" class="rec-card-player">
                    <div class="rec-thumb">
                        <img src="${item.poster_path ? IMG_URL + 'w300' + item.poster_path : 'https://i.imgur.com/gG2Vb2x.png'}" alt="${title}" loading="lazy">
                        ${genre ? `<div class="rec-genre-tag">${genre}</div>` : ''}
                        <div class="rec-overlay">${playButtonSVG}</div>
                    </div>
                    <div class="rec-info">
                        <div class="rec-title">${title}</div>
                        <div class="rec-meta"><span class="star">★ ${rating} </span> • ${year}</div>
                    </div>
                </a>`;
        }).join('');
    }
        
    async function renderTopMovies() {
        const container = document.getElementById('top-movies-list');
        if (!container) return;
        try {
            const trendRes = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
            const trendData = await trendRes.json(); 
            if (!trendData.results) throw new Error("No trending results");

            const validItems = trendData.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
            const topItems = validItems.slice(0, 10); 

            const detailPromises = topItems.map(item =>
                fetch(`${BASE_URL}/${item.media_type}/${item.id}?api_key=${API_KEY}&append_to_response=release_dates,content_ratings,genres`)
            );
            const detailResponses = await Promise.all(detailPromises);
            const detailedItems = await Promise.all(detailResponses.map(res => res.json()));

            container.innerHTML = detailedItems.map((item, index) => {
                const originalItem = topItems[index];
                const mediaType = originalItem.media_type;

                const title = item.title || item.name;
                const itemTypeLabel = mediaType === 'tv' ? 'Series' : 'Movie';
                const year = (item.release_date || item.first_air_date || '').split('-')[0];

                const releaseDates = item.release_dates || item.content_ratings;
                let certification = 'NR';
                if (releaseDates?.results) {
                    const usRating = releaseDates.results.find(r => r.iso_3166_1 === 'US');
                    if (usRating) {
                        certification = (mediaType === 'movie' ? usRating.release_dates?.[0]?.certification : usRating.rating) || 'NR';
                    }
                }
                const genres = (item.genres || []).slice(0, 3).map(g => `<span class="genre-tag">${g.name}</span>`).join('');
                const rank = index + 1;

                return `
                    <a href="/p/details.html?id=${item.id}&type=${mediaType}" class="top-movie-item">
                        <div class="thumb">
                            <div class="rank-badge top-${rank}">${rank}</div>
                            <img src="${item.poster_path ? IMG_URL + 'w300' + item.poster_path : 'https://i.imgur.com/gG2Vb2x.png'}" alt="${title}" loading="lazy"/>
                        </div>
                        <div class="info">
                            <div class="title">${title}</div>
                            <div class="type-badge ${mediaType}">${itemTypeLabel}</div>
                            <div class="genre-tags">${genres}</div>
                            <div class="meta-info">${certification} • ${year}</div>
                        </div>
                    </a>`;
            }).join('');
        } catch (error) {
            container.innerHTML = `<p>Could not load top content.</p>`;
            console.error("Error rendering top movies:", error);
        }
    }

    function renderSourceSelector() {
        const selectWrapper = document.getElementById('player-source-selector');
        if (!selectWrapper || videoSources.length <= 1) {
            if (selectWrapper) selectWrapper.style.display = 'none';
            return;
        }
        
        const currentSource = videoSources[currentSourceIndex];
        selectWrapper.innerHTML = `
            <div class='custom-select-trigger'>
                ${getSourceLogo(currentSource)}
                <span>${currentSource.name}</span>
                <svg viewBox="0 0 24 24" width="40px" height="40px" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9.5L12 14.5L7 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class='custom-options'>
                ${videoSources.map((s, index) => `
                    <div class="custom-option ${index === currentSourceIndex ? 'selected' : ''}" data-index="${index}">
                        ${getSourceLogo(s)}
                        <span>${s.name}</span>
                    </div>`).join('')}
            </div>`;
        
        const trigger = selectWrapper.querySelector('.custom-select-trigger');
        const optionsContainer = selectWrapper.querySelector('.custom-options');

        trigger.addEventListener('click', () => selectWrapper.classList.toggle('open'));

        optionsContainer.addEventListener('click', async (e) => {
            const option = e.target.closest('.custom-option');
            if (option) {
                const newIndex = parseInt(option.dataset.index);
                if (newIndex === currentSourceIndex) return;

                currentSourceIndex = newIndex;
                const newSource = videoSources[newIndex];
                localStorage.setItem('abefilm_player_source', newSource.name);

                trigger.innerHTML = `${getSourceLogo(newSource)}<span>${newSource.name}</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9.5L12 14.5L7 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                
                selectWrapper.classList.remove('open');
                optionsContainer.querySelector('.selected')?.classList.remove('selected');
                option.classList.add('selected');
                renderVideoPlayer(); 
            }
        });
        window.addEventListener('click', e => {
            if (!selectWrapper.contains(e.target)) {
                selectWrapper.classList.remove('open');
            }
        });
    }

    function renderPartSelector(allDetails, collectionDetails, currentSeasonNum) {
        const selectWrapper = document.querySelector(isMobile ? '#player-season-selector-mobile' : '#player-season-selector-desktop');
        if (!selectWrapper) return;

        let triggerText = '';
        let optionsHTML = '';
        let hasMultipleOptions = false;
        
        if (type === 'tv') {
            const validSeasons = allDetails.seasons.filter(s => s.season_number > 0 && s.episode_count > 0);
            if (validSeasons.length === 0 && isMobile) {
                triggerText = 'S1';
                optionsHTML = `<div class="custom-option selected">Season 1</div>`;
            } else if (validSeasons.length === 0) {
                 selectWrapper.style.display = 'none';
                 return;
            } else {
                const currentSeasonName = validSeasons.find(s => s.season_number == currentSeasonNum)?.name || `Season ${currentSeasonNum}`;
                triggerText = isMobile ? `S${currentSeasonNum}` : currentSeasonName;
                optionsHTML = validSeasons.map(s => `<div class="custom-option ${s.season_number == currentSeasonNum ? 'selected' : ''}" data-value="${s.season_number}">${s.name}</div>`).join('');
                hasMultipleOptions = validSeasons.length > 1;
            }
        } else if (type === 'movie') {
            if (collectionDetails && collectionDetails.parts.length > 1) {
                const currentPartIndex = collectionDetails.parts.findIndex(p => p.id == id);
                const currentPart = collectionDetails.parts[currentPartIndex];
                triggerText = isMobile ? `Part ${currentPartIndex + 1}` : (currentPart?.title || 'Select Part');
                optionsHTML = collectionDetails.parts.map((p, index) => `<div class="custom-option ${p.id == id ? 'selected' : ''}" data-value="${p.id}" data-index="${index}">${p.title}</div>`).join('');
                hasMultipleOptions = true;
            } else {
                 if (!isMobile) {
                    selectWrapper.style.display = 'none';
                    return;
                }
                triggerText = 'Part 1';
                optionsHTML = `<div class="custom-option selected" data-value="${id}">${allDetails.title}</div>`;
                hasMultipleOptions = false;
            }
        }
        
        selectWrapper.innerHTML = `
            <div class='custom-select-trigger'>
                <span>${triggerText}</span>       
            </div>
            <div class='custom-options'>${optionsHTML}</div>`;

        const trigger = selectWrapper.querySelector('.custom-select-trigger');
        const optionsContainer = selectWrapper.querySelector('.custom-options');

        trigger.addEventListener('click', () => {
            if (hasMultipleOptions) selectWrapper.classList.toggle('open');
        });

        optionsContainer.addEventListener('click', async (e) => {
            const option = e.target.closest('.custom-option');
            if (!option || option.classList.contains('selected')) {
                selectWrapper.classList.remove('open');
                return;
            };

            if (type === 'tv') {
                const newSeasonNum = parseInt(option.dataset.value);
                trigger.querySelector('span').textContent = isMobile ? `S${newSeasonNum}` : option.textContent;
                selectWrapper.classList.remove('open');
                optionsContainer.querySelector('.selected')?.classList.remove('selected');
                option.classList.add('selected');
                
                const seasonRes = await fetch(`${BASE_URL}/tv/${id}/season/${newSeasonNum}?api_key=${API_KEY}`);
                const newSeasonDetails = await seasonRes.json();
                currentSeasonDetails = newSeasonDetails;
                renderEpisodeList(allDetails, newSeasonDetails, 1);
                renderDownloadPanel(newSeasonDetails);
                renderEpisodesModal(newSeasonDetails, 1);
                updatePlayerAndUrl(newSeasonDetails, newSeasonNum, 1);
            } else if (type === 'movie') {
                const newMovieId = option.dataset.value;
                window.location.href = `/p/player.html?id=${newMovieId}&type=movie`;
            }
        });
        
        window.addEventListener('click', e => {
            if (!selectWrapper.contains(e.target)) {
                selectWrapper.classList.remove('open');
            }
        });
    }


    function renderAndSetupSandboxControls() {
        if (isMobile) {
            const selectWrapper = document.getElementById('player-sandbox-selector');
            if (!selectWrapper) return;

            const sandboxIcon = isSandboxEnabled ? ICONS.sandboxOn : ICONS.sandboxOff;
            const triggerText = isSandboxEnabled ? "Sandbox On" : "Sandbox Off";

            selectWrapper.innerHTML = `
                <div class='custom-select-trigger'>
                    ${sandboxIcon}
                    <span>${triggerText}</span>
                    
                </div>
                <div class='custom-options'>
                    <div class="custom-option ${isSandboxEnabled ? 'selected' : ''}" data-value="true">${ICONS.sandboxOn}<span>Enabled Sandbox</span></div>
                    <div class="custom-option ${!isSandboxEnabled ? 'selected' : ''}" data-value="false">${ICONS.sandboxOff}<span>Disabled Sandbox</span></div>
                </div>`;
            
            const trigger = selectWrapper.querySelector('.custom-select-trigger');
            const optionsContainer = selectWrapper.querySelector('.custom-options');

            trigger.addEventListener('click', () => selectWrapper.classList.toggle('open'));

            optionsContainer.addEventListener('click', (e) => {
                const option = e.target.closest('.custom-option');
                if (option) {
                    const newValue = option.dataset.value === 'true';
                    if (newValue === isSandboxEnabled) {
                         selectWrapper.classList.remove('open');
                         return;
                    }

                    isSandboxEnabled = newValue;
                    localStorage.setItem('abefilm_sandbox_enabled', isSandboxEnabled);
                    
                    const newIcon = isSandboxEnabled ? ICONS.sandboxOn : ICONS.sandboxOff;
                    const newText = isSandboxEnabled ? "Sandbox On" : "Sandbox Off";
                    trigger.querySelector('span').textContent = newText;
                    trigger.querySelector('svg:first-of-type').outerHTML = newIcon;
                    
                    selectWrapper.classList.remove('open');
                    optionsContainer.querySelector('.selected')?.classList.remove('selected');
                    option.classList.add('selected');
                    renderVideoPlayer();
                }
            });
            window.addEventListener('click', e => {
                if (!selectWrapper.contains(e.target)) selectWrapper.classList.remove('open');
            });
        } else {
            const desktopContainer = document.getElementById('sidebar-bottom-controls');
            if (!desktopContainer) return;
            
            desktopContainer.innerHTML = `
                <div id='sandbox-controls'>
                    <div class='sandbox-toggle-wrapper'>
                        <span id="sandbox-icon-desktop" style="display:none"></span>
                        <span>Enable Sandbox (Block ads)</span>
                        <label class='switch'><input type='checkbox' id='sandbox-toggle-checkbox'><span class='slider round'></span></label>
                    </div>
                     <p id="sandbox-note"><span>Note:</span> Disable it if the player doesn’t work.</p>
                </div>`;
            
            const sandboxToggle = document.getElementById('sandbox-toggle-checkbox');
            const iconContainer = document.getElementById('sandbox-icon-desktop');

            const updateDesktopIcon = () => {
                if(iconContainer) {
                    iconContainer.innerHTML = sandboxToggle.checked ? ICONS.sandboxOn : ICONS.sandboxOff;
                }
            };

            if (sandboxToggle) {
                sandboxToggle.checked = isSandboxEnabled;
                updateDesktopIcon(); 
                sandboxToggle.addEventListener('change', () => {
                    isSandboxEnabled = sandboxToggle.checked;
                    localStorage.setItem('abefilm_sandbox_enabled', isSandboxEnabled);
                    updateDesktopIcon();
                    renderVideoPlayer();
                });
            }
        }
    }
    
    function updatePlayerAndUrl(seasonDetails, season, episode) {
        currentSeason = season;
        currentEpisode = episode;
        renderVideoPlayer();
        if (!isMobile) renderDownloadPanel(seasonDetails);
        const titleEl = document.querySelector('#video-title-main');
        if(titleEl) titleEl.textContent = `${seriesTitle} › Season ${season} › Episode ${episode}`;

        const listContainer = document.getElementById('episode-list');
        if(listContainer) {
            listContainer.querySelector('.active')?.classList.remove('active');
            const selector = listContainer.classList.contains('list-view') ? `.episode-list-item[data-ep="${episode}"]` : `.episode-btn[data-ep="${episode}"]`;
            const activeEpElement = listContainer.querySelector(selector);
            if (activeEpElement) {
                activeEpElement.classList.add('active');
                activeEpElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        const modalListContainer = document.getElementById('episodes-modal-list');
        if (modalListContainer) {
            modalListContainer.querySelector('.active')?.classList.remove('active');
            const activeModalEpElement = modalListContainer.querySelector(`.episode-btn[data-ep="${episode}"]`);
            if (activeModalEpElement) {
                activeModalEpElement.classList.add('active');
                activeModalEpElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        const newUrl = new URL(window.location);
        newUrl.searchParams.set('season', season);
        newUrl.searchParams.set('ep', episode);
        history.pushState({}, '', newUrl);
        updateNavButtons(seasonDetails);
    }
    
   function updateNavButtons(seasonDetails) {
        const prevBtn = document.getElementById('player-prev-btn');
        const nextBtn = document.getElementById('player-next-btn');
        const pagination = document.getElementById('ep-pagination');
        const mobilePrevBtn = document.getElementById('mobile-prev-btn');
        const mobileNextBtn = document.getElementById('mobile-next-btn');
        const mobileNavContainer = document.getElementById('mobile-episode-nav');

        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        if (pagination) pagination.style.display = 'block';

        if (type === 'movie') {
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            if (pagination) pagination.textContent = '1 / 1';
            if (mobileNavContainer) mobileNavContainer.style.display = 'none';
        } else if (seasonDetails && seasonDetails.episodes && seasonDetails.episodes.length > 0) {
            const totalEpisodes = seasonDetails.episodes.length;
            if (prevBtn && nextBtn && pagination) {
                pagination.textContent = `${currentEpisode} / ${totalEpisodes}`;
                prevBtn.disabled = currentEpisode <= 1;
                nextBtn.disabled = currentEpisode >= totalEpisodes;
            }
            if (mobilePrevBtn && mobileNextBtn && mobileNavContainer) {
                mobileNavContainer.style.display = 'flex';
                mobilePrevBtn.disabled = currentEpisode <= 1;
                mobileNextBtn.disabled = currentEpisode >= totalEpisodes;
            }
        } else {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
            if (mobileNavContainer) mobileNavContainer.style.display = 'none';
        }
    }

  function setupUIInteractions(detailsData){
    document.getElementById('player-comment-btn')?.addEventListener('click', () => {
        document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('player-share-btn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({ title: document.title, url: window.location.href }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToastNotification('Link copied to clipboard!', 'success');
            });
        }
    });
    document.getElementById('player-bookmark-btn')?.addEventListener('click', () => {
        const posterPath = detailsData.poster_path ? `${IMG_URL}w500${detailsData.poster_path}` : '';
        toggleBookmark({ id: detailsData.id, type: type, title: seriesTitle, poster: posterPath });
    });
    document.querySelectorAll('.scroll-wrapper').forEach(wrapper=>{wrapper.addEventListener('click',e=>{const scrollBtn=e.target.closest('.scroll-btn');if(scrollBtn){const scrollContainer=wrapper.querySelector('.horizontal-scroll-content');if(!scrollContainer)return;const direction=scrollBtn.classList.contains('right')?1:-1;scrollContainer.scrollBy({left:scrollContainer.clientWidth*0.9*direction,behavior:'smooth'})}})});
    
    const toggleBtn = document.getElementById('episode-view-toggle');
    const listContainer = document.getElementById('episode-list');
    if (type === 'tv') {
        if (toggleBtn && listContainer) {
            const isInitiallyGrid = listContainer.classList.contains('grid-view');
            toggleBtn.innerHTML = isInitiallyGrid ? ICONS.list : ICONS.grid;
            toggleBtn.addEventListener('click', async () => {
                document.body.classList.add('abefilm-view-switching');
                listContainer.classList.toggle('grid-view');
                listContainer.classList.toggle('list-view');
                const isNowGridView = listContainer.classList.contains('grid-view');
                toggleBtn.innerHTML = isNowGridView ? ICONS.list : ICONS.grid;
                renderEpisodeList(detailsData, currentSeasonDetails, currentEpisode);
                setTimeout(() => { document.body.classList.remove('abefilm-view-switching'); }, 50);
            });
        }
    } else {
        if (toggleBtn) toggleBtn.style.display = 'none';
    }

    document.getElementById('player-reload-btn')?.addEventListener('click',()=>{renderVideoPlayer()});
    document.getElementById('player-prev-btn')?.addEventListener('click',()=>{if(type==='tv'&&currentSeasonDetails&&currentEpisode>1){updatePlayerAndUrl(currentSeasonDetails,currentSeason,currentEpisode-1)}});
    document.getElementById('player-next-btn')?.addEventListener('click',()=>{if(type==='tv'&&currentSeasonDetails&&currentEpisode<currentSeasonDetails.episodes.length){updatePlayerAndUrl(currentSeasonDetails,currentSeason,currentEpisode+1)}});
    document.getElementById('player-fullscreen-btn')?.addEventListener('click',()=>{const iframe=document.querySelector('#video-player-embed iframe');if(iframe?.requestFullscreen){iframe.requestFullscreen()}});
    
    const lightOverlay = document.createElement('div');
    lightOverlay.id = 'abefilm-light-overlay';
    document.body.appendChild(lightOverlay);
    document.getElementById('player-light-btn')?.addEventListener('click', () => {
        lightOverlay.classList.toggle('active');
        document.getElementById('player-top-section').classList.toggle('lights-off-mode');
    });

    if (isMobile) {
  
        if (type === 'tv') {
            const modalOverlay = document.getElementById('episodes-modal-overlay');
            const viewMoreBtn = document.getElementById('mobile-episodes-view-more');
            const closeModalBtn = document.getElementById('episodes-modal-close-btn');

            viewMoreBtn?.addEventListener('click', () => modalOverlay?.classList.add('visible'));
            closeModalBtn?.addEventListener('click', () => modalOverlay?.classList.remove('visible'));
            modalOverlay?.addEventListener('click', (e) => {
                if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
            });
            document.getElementById('mobile-prev-btn')?.addEventListener('click', () => {
                if (currentEpisode > 1) updatePlayerAndUrl(currentSeasonDetails, currentSeason, currentEpisode - 1);
            });
            document.getElementById('mobile-next-btn')?.addEventListener('click', () => {
                if (currentSeasonDetails && currentEpisode < currentSeasonDetails.episodes.length) updatePlayerAndUrl(currentSeasonDetails, currentSeason, currentEpisode + 1);
            });
        }

        const downloadButton = document.getElementById('player-download-button');
        if (downloadButton) {
            if (type === 'tv') {
                // For TV shows, the button opens a modal
                const downloadModalOverlay = document.getElementById('download-modal-overlay');
                const downloadModalCloseBtn = document.getElementById('download-modal-close-btn');
                
                if(downloadModalOverlay && downloadModalCloseBtn) {
                    // Make it act like a button, not a link
                    downloadButton.removeAttribute('href'); 
                    downloadButton.removeAttribute('target');
                    
                    downloadButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        downloadModalOverlay.classList.add('visible');
                    });
                    downloadModalCloseBtn.addEventListener('click', () => downloadModalOverlay.classList.remove('visible'));
                    downloadModalOverlay.addEventListener('click', (e) => {
                        if (e.target === downloadModalOverlay) downloadModalOverlay.classList.remove('visible');
                    });
                }
            } else if (type === 'movie') {
                // For movies, the button is a direct link that opens in a new tab
                downloadButton.href = `https://dl.vidsrc.vip/movie/${id}`;
                downloadButton.target = '_blank';
            }
        }

        const mobileVideoTab = document.getElementById('mobile-video-tab');
        const mobileCommentTab = document.getElementById('mobile-comment-tab');
        mobileCommentTab?.addEventListener('click', () => {
            document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
            mobileVideoTab.classList.remove('active');
            mobileCommentTab.classList.add('active');
        });
        mobileVideoTab?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            mobileCommentTab.classList.remove('active');
            mobileVideoTab.classList.add('active');
        });

    } else {
        const tabsContainer = document.getElementById('sidebar-tabs');
        const panelsContainer = document.getElementById('sidebar-panels');
        if (tabsContainer && panelsContainer) {
            const tabButtons = Array.from(tabsContainer.querySelectorAll('.sidebar-tab-btn'));
            const contentPanels = Array.from(panelsContainer.querySelectorAll('.sidebar-panel'));
            tabsContainer.addEventListener('click', (e) => {
                const button = e.target.closest('.sidebar-tab-btn');
                if (!button || button.classList.contains('active')) return;
                const targetPanelId = button.dataset.panel;
                tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
                contentPanels.forEach(panel => panel.classList.toggle('active', panel.id === targetPanelId));
            });
        }
    }
}

    async function main(){
        const container=document.getElementById('abefilm-player-container');
        const loader = document.getElementById('page-loader');
        const topSection = document.getElementById('player-top-section');
        const detailsSection = document.getElementById('player-details-section');
    
        try{
            loadVideoSources();
            await fetchGenres();
            const res=await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits,recommendations,genres,release_dates,content_ratings,seasons`);
            if(!res.ok)throw new Error('Failed to fetch main details.');
            const detailsData=await res.json();
            document.title=detailsData.name||detailsData.title;

            let collectionDetails = null;
            if (type === 'movie' && detailsData.belongs_to_collection) {
                try {
                    const collectionRes = await fetch(`${BASE_URL}/collection/${detailsData.belongs_to_collection.id}?api_key=${API_KEY}`);
                    if (collectionRes.ok) collectionDetails = await collectionRes.json();
                } catch (e) { console.error("Could not fetch collection details", e); }
            }
            
            renderVideoDetails(detailsData,detailsData.credits);
            renderCast(detailsData.credits);
            renderRecommendations(detailsData.recommendations);
            await renderTopMovies();
            
            if(type==='tv'){
                const seriesTitleEl = document.getElementById('series-title-sidebar');
                if(seriesTitleEl) seriesTitleEl.textContent=detailsData.name||detailsData.title;
                const seasonRes=await fetch(`${BASE_URL}/tv/${id}/season/${currentSeason}?api_key=${API_KEY}`);
                if(!seasonRes.ok)throw new Error('Failed to fetch season details.');
                currentSeasonDetails=await seasonRes.json();
                renderEpisodeList(detailsData, currentSeasonDetails,currentEpisode);
                renderEpisodesModal(currentSeasonDetails, currentEpisode);
            }else{
                const seriesTitleEl = document.getElementById('series-title-sidebar');
                if(seriesTitleEl) seriesTitleEl.textContent=detailsData.title||detailsData.name;
                const episodeCountSidebar = document.getElementById('episode-count-sidebar');
                if(episodeCountSidebar) episodeCountSidebar.style.display = 'none';
                const listContainer=document.getElementById('episode-list');
                if(listContainer){listContainer.innerHTML=`<button class="episode-btn active">1</button>`}
            }
            
            renderSourceSelector();
            renderPartSelector(detailsData, collectionDetails, currentSeason);
            renderSeasonPanel(detailsData, collectionDetails, currentSeason);
            renderDownloadPanel(currentSeasonDetails);
            renderServersPanel();
            renderAndSetupSandboxControls();
            renderVideoPlayer();
            setupUIInteractions(detailsData); 
            updateNavButtons(currentSeasonDetails);

            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 300);
            }
            if (topSection) topSection.classList.remove('content-hidden');
            if (detailsSection) detailsSection.classList.remove('content-hidden');

        }catch(error){
            console.error("Error initializing player page:",error);
            container.innerHTML=`<p style='color:red; text-align:center;'>${error.message}</p>`
            if (loader) loader.style.display = 'none';
        }
    }
    main();
}
