(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll("[data-animate]");

  const markVisible = (el) => {
    el.classList.add("reveal", "is-visible");
  };

  if (revealItems.length) {
    if (prefersReduced) {
      revealItems.forEach(markVisible);
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal", "is-visible");
              if (entry.target.dataset.count) {
                animateCount(entry.target);
              }
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      revealItems.forEach((item) => observer.observe(item));
    }
  }

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const filterButtons = document.querySelectorAll(".filter-btn");
  const filterCards = document.querySelectorAll("[data-category]");
  const faqButtons = document.querySelectorAll("[data-faq-button]");
  const faqItems = document.querySelectorAll("[data-faq-item]");
  const faqSearch = document.querySelector("#faq-search");
  const faqEmpty = document.querySelector("#faq-empty");

  if (filterButtons.length && filterCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;

        filterCards.forEach((card) => {
          if (filter === "all" || card.dataset.category === filter) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  if (faqButtons.length) {
    faqButtons.forEach((button, index) => {
      const item = button.closest("[data-faq-item]");
      const isOpen = index === 0;

      if (item) {
        item.classList.toggle("is-open", isOpen);
      }
      button.setAttribute("aria-expanded", String(isOpen));

      button.addEventListener("click", () => {
        const shouldOpen = !item?.classList.contains("is-open");

        faqButtons.forEach((otherButton) => {
          const otherItem = otherButton.closest("[data-faq-item]");
          otherItem?.classList.remove("is-open");
          otherButton.setAttribute("aria-expanded", "false");
        });

        if (shouldOpen && item) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  if (faqSearch && faqItems.length) {
    const runFaqFilter = () => {
      const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
      const searchTerm = faqSearch.value.trim().toLowerCase();
      let visibleCount = 0;

      faqItems.forEach((item) => {
        const category = item.dataset.category || "";
        const text = item.textContent?.toLowerCase() || "";
        const categoryMatch = activeFilter === "all" || category === activeFilter;
        const searchMatch = !searchTerm || text.includes(searchTerm);
        const shouldShow = categoryMatch && searchMatch;

        item.classList.toggle("is-hidden", !shouldShow);
        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (faqEmpty) {
        faqEmpty.classList.toggle("is-visible", visibleCount === 0);
      }
    };

    runFaqFilter();
    faqSearch.addEventListener("input", runFaqFilter);

    if (filterButtons.length) {
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", runFaqFilter);
      });
    }
  }

  const nav = document.querySelector(".navbar");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("nav-scrolled", window.scrollY > 10);
    });
  }
})();
