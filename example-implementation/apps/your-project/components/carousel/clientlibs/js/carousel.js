(function() {
    'use strict';

    var CAROUSEL_SELECTOR = '.custom-carousel-3cards';
    var ITEM_SELECTOR = '.cmp-carousel__item';
    var TRACK_SELECTOR = '.cmp-carousel__track';
    var PREVIOUS_BUTTON_SELECTOR = '[data-cmp-hook-carousel="previous"]';
    var NEXT_BUTTON_SELECTOR = '[data-cmp-hook-carousel="next"]';
    var INDICATOR_SELECTOR = '[data-cmp-hook-carousel="indicator"]';

    function CustomCarousel(element) {
        this.element = element;
        this.track = element.querySelector(TRACK_SELECTOR);
        this.items = element.querySelectorAll(ITEM_SELECTOR);
        this.previousButton = element.querySelector(PREVIOUS_BUTTON_SELECTOR);
        this.nextButton = element.querySelector(NEXT_BUTTON_SELECTOR);
        this.indicators = element.querySelectorAll(INDICATOR_SELECTOR);
        
        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.maxIndex = Math.max(0, this.items.length - this.cardsToShow);
        
        this.init();
    }

    CustomCarousel.prototype.init = function() {
        this.bindEvents();
        this.updateCarousel();
        this.updateIndicators();
        
        // Handle window resize
        var self = this;
        window.addEventListener('resize', function() {
            self.cardsToShow = self.getCardsToShow();
            self.maxIndex = Math.max(0, self.items.length - self.cardsToShow);
            self.currentIndex = Math.min(self.currentIndex, self.maxIndex);
            self.updateCarousel();
        });
    };

    CustomCarousel.prototype.getCardsToShow = function() {
        var width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        return 3;
    };

    CustomCarousel.prototype.bindEvents = function() {
        var self = this;
        
        if (this.previousButton) {
            this.previousButton.addEventListener('click', function() {
                self.previous();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', function() {
                self.next();
            });
        }
        
        this.indicators.forEach(function(indicator, index) {
            indicator.addEventListener('click', function() {
                self.goToSlide(index);
            });
        });
    };

    CustomCarousel.prototype.previous = function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            this.updateIndicators();
        }
    };

    CustomCarousel.prototype.next = function() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
            this.updateIndicators();
        }
    };

    CustomCarousel.prototype.goToSlide = function(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
        this.updateCarousel();
        this.updateIndicators();
    };

    CustomCarousel.prototype.updateCarousel = function() {
        var translateX = -(this.currentIndex * (100 / this.cardsToShow));
        this.track.style.transform = 'translateX(' + translateX + '%)';
        
        // Update button states
        if (this.previousButton) {
            this.previousButton.disabled = this.currentIndex === 0;
        }
        if (this.nextButton) {
            this.nextButton.disabled = this.currentIndex === this.maxIndex;
        }
    };

    CustomCarousel.prototype.updateIndicators = function() {
        var self = this;
        this.indicators.forEach(function(indicator, index) {
            indicator.classList.toggle('cmp-carousel__indicator--active', index === self.currentIndex);
        });
    };

    // Initialize carousels when DOM is ready
    function initCarousels() {
        var carousels = document.querySelectorAll(CAROUSEL_SELECTOR);
        carousels.forEach(function(carousel) {
            new CustomCarousel(carousel);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }

    // Re-initialize on AEM editor refresh
    if (window.Granite && window.Granite.author) {
        document.addEventListener('cq-editor-loaded', initCarousels);
    }

})();