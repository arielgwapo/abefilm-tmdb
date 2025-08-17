document.addEventListener('DOMContentLoaded', function () {

  const path = window.location.href;
  const isMobile = window.innerWidth <= 768;
  const homeURL = location.origin + "/";

  const isHomepage = location.pathname === "/" ||
                     location.pathname.endsWith("/index.html") ||
                     (location.hostname.includes("blogspot.com") && !location.pathname.includes("/p/"));
  const isDetailsPage = path.includes('/p/details.html');
  const isPlayerPage = path.includes('/p/player.html');
  const isLibraryPage = path.includes('/p/library.html');
  const isAboutPage = path.includes('/p/about-us.html');
  const isPrivacyPage = path.includes('/p/privacy-policy.html');
  const isDisclaimerPage = path.includes('/p/disclaimer.html');

  const text12 = document.querySelector('#Text12 .widget-content');
  const text13 = document.querySelector('#Text13 .widget-content');
  const text14 = document.querySelector('#Text14 .widget-content');
  const name = document.querySelector('footer .website-name');
  const desc = document.querySelector('footer .website-description');
  const credit = document.querySelector('footer .credit');

  if (text12 && name) { name.innerHTML = text12.innerHTML; }
  if (text13 && desc) { desc.innerHTML = text13.innerHTML; }
  if (text14 && credit) {
    credit.innerHTML = text14.innerHTML;
    const yearSpan = credit.querySelector('#currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
  }
  const aboutUsContainer = document.getElementById("about-us");
  const privacyPolicyContainer = document.getElementById("privacy-policy");
  const disclaimerContainer = document.getElementById("disclaimer");
  const aboutWidget = document.querySelector("#Text10 .widget-content");
  const privacyWidget = document.querySelector("#Text9 .widget-content");
  const disclaimerWidget = document.querySelector("#Text11 .widget-content");

  if (isAboutPage && aboutUsContainer && aboutWidget) { aboutUsContainer.innerHTML = aboutWidget.innerHTML; }
  if (isPrivacyPage && privacyPolicyContainer && privacyWidget) { privacyPolicyContainer.innerHTML = privacyWidget.innerHTML; }
  if (isDisclaimerPage && disclaimerContainer && disclaimerWidget) { disclaimerContainer.innerHTML = disclaimerWidget.innerHTML; }

  const detailsContent = document.getElementById('details-content');
  const playerContent = document.getElementById('player-content');
  const libraryContent = document.getElementById('library');
  const playerContainer = document.getElementById('abefilm-player-container');
  const detailsPageContainer = document.getElementById('details-page-container');

  if (detailsPageContainer) detailsPageContainer.style.display = isDetailsPage ? 'block' : 'none';
  if (playerContainer) playerContainer.style.display = isPlayerPage ? 'block' : 'none';
  if (detailsContent) detailsContent.style.display = (isDetailsPage || isPlayerPage) ? 'block' : 'none';
  if (libraryContent) libraryContent.style.display = isLibraryPage ? 'block' : 'none';
  if (aboutUsContainer) aboutUsContainer.style.display = isAboutPage ? 'block' : 'none';
  if (privacyPolicyContainer) privacyPolicyContainer.style.display = isPrivacyPage ? 'block' : 'none';
  if (disclaimerContainer) disclaimerContainer.style.display = isDisclaimerPage ? 'block' : 'none';

  if (isPlayerPage) {
    document.querySelector('.top-header')?.remove();
    document.querySelector('.side-menu')?.remove();
  }
  if (isLibraryPage && isMobile) {
    document.querySelector('.top-header')?.remove();
  }

  const hashToSection = {
    home: 'tmdb-section-1',
    movies: 'tmdb-section-2',
    tvseries: 'tmdb-section-3',
    animation: 'tmdb-section-4',
    toplink1: 'tmdb-section-5',
    toplink2: 'tmdb-section-6',
    toplink3: 'tmdb-section-7',
    'toplink4': 'tmdb-section-8',
    'toplink5': 'tmdb-section-9'
  };
  document.querySelectorAll('.side-menu a[href^="#"], .bottom-navbar a[href^="#"], .anchor-links a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      if (!isHomepage) {
        e.preventDefault();
        window.location.href = homeURL + this.getAttribute("href");
      }
    });
  });
  if (!isHomepage && location.hash && hashToSection[location.hash.replace('#','')]) {
    window.location.href = homeURL + location.hash;
    return;
  }
  if (isHomepage) {
    const updateSectionsFromHash = () => {
      const currentHash = window.location.hash.replace('#', '') || 'home';
      Object.entries(hashToSection).forEach(([key, sectionId]) => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = (key === currentHash) ? 'block' : 'none';
        }
      });
      document.querySelectorAll('.side-menu a, .bottom-navbar a, .anchor-links a').forEach(link => {
        const linkHash = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', linkHash === currentHash);
      });
    };
    updateSectionsFromHash();
    window.addEventListener('hashchange', updateSectionsFromHash);
  }

  let toastTimer;
  function showToastNotification(message, type = 'info') { /* ... code unchanged ... */ }

  const topHeader = document.querySelector(".top-header");
  if (topHeader) {
    const handleScroll = () => {
      if (isMobile) {
        return;
      }
      if (isHomepage || isDetailsPage) {
        topHeader.classList.toggle('scrolled', window.scrollY > 60);
      } 
      else {
        topHeader.classList.add('scrolled');
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
  }

  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("mobileSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      overlay.style.display = sidebar.classList.contains("active") ? "block" : "none";
    });
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.style.display = "none";
    });
  }
  document.querySelector('.share-btn')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href })
        .catch(err => console.warn('Share failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => showToastNotification('Link copied to clipboard!', 'success'))
        .catch(() => showToastNotification('Could not copy link.', 'error'));
    }
  });
  document.querySelector('.top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.querySelector('.back-history')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  });
  const commentButton = document.getElementById('comment-nav-button');
  const commentSection = document.getElementById('comment-section');
  if (commentButton && commentSection) {
    commentButton.addEventListener('click', (e) => {
      e.preventDefault();
      commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

}); 
