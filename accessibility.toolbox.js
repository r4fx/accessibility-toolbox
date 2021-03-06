/*
    Page accessibility tools
 */

var theme = (function () {
    var themeIsSet = false;
    var currentTheme = localStorage.getItem('currentTheme');

    /*
        Set theme at start if was activated
     */

    var setTheme = function () {
        if (currentTheme) {
            var themeCssLink = document.querySelector('link[title="' + currentTheme + '"]');

            document.querySelector('html').classList.add(currentTheme);
            themeCssLink.disabled = true;
            themeCssLink.disabled = false;
            themeIsSet = true;
        }
    };

    /*
        HIGH CONTRAST TOGGLE BUTTON
    */

    var themeSwitcher = function () {
        var themeSwitchBtn = document.querySelector('[data-theme-switcher]');

        // Set classes to the related elements if theme is active
        if (themeIsSet) {
            themeSwitchBtn.classList.add('active');
            document.querySelector('html').classList.add(currentTheme);
        }

        // BTN SWITCH
        if (themeSwitchBtn) {
            themeSwitchBtn.addEventListener('click', function (evt) {
                var themeName = this.getAttribute('data-theme-switcher');
                var themeCssLink = document.querySelector('link[title="' + themeName + '"]');

                if (!themeCssLink) {
                    console.info('theme stylesheet file not set');
                    evt.preventDefault();
                }

                this.classList.toggle('active');
                document.querySelector('html').classList.toggle(themeName);

                if (localStorage.getItem('currentTheme')) {
                    themeCssLink.disabled = true;
                    localStorage.removeItem('currentTheme');
                } else {
                    themeCssLink.disabled = true;
                    themeCssLink.disabled = false;
                    localStorage.setItem('currentTheme', themeName);
                }

                evt.preventDefault();
            });
        }

    };

    return {
        setTheme: setTheme,
        themeSwitcher: themeSwitcher
    };
})();


var accessibility = {

    /*
        HIDDEN TABULATOR MENU
    */

    tabMenu: function () {
        var accessibilityTabMenu = document.getElementById('accessibility-tab-menu');

        accessibilityTabMenu.addEventListener('click', function (event) {
            if (event.target.matches('a')) {
                var targetId = event.target.getAttribute('href').substring(1);
                var targetElement = document.getElementById(targetId);

                targetElement.setAttribute('tabindex', -1);
                targetElement.focus();

                if (targetElement === document.activeElement){
                    console.info('Focused element: id="' + targetId + '"');
                }

                event.stopPropagation();
            }
        });
    },

    /*
        CODE EXAMPLES
    */

    /*
        SHOW HIDDEN SECOND LEVEL MENU ON TAB SWITCH
    */

    hoveredNav: function () {
        var mainNav = document.querySelector('.main-nav');

        function focusAndBlurHandler(event) {
            if (event.target.matches('a')) {
                var focusedElement = event.target;
                var focusedElementParent = focusedElement.parentElement;
                var secondLevel = focusedElement.closest('ul');
                var secondLevelParent = secondLevel.parentElement;

                focusedElement.classList.add('focused');

                if (focusedElementParent.tagName == 'LI'){
                    focusedElementParent.classList.add('hover');
                }

                if (secondLevelParent.tagName == 'LI'){
                    focusedElementParent.classList.add('hover');
                }

                focusedElement.addEventListener('blur', function () {
                    focusedElement.classList.remove('focused');

                    if (!focusedElementParent.nextElementSibling){
                        secondLevelParent.classList.remove('hover');
                    }

                    if (secondLevelParent.tagName == 'LI'){
                        focusedElementParent.classList.remove('hover');
                    }
                }, true);

                event.stopPropagation();
            }
        }

        mainNav.addEventListener('focus', focusAndBlurHandler, true);
    },

    init: function () {
        this.tabMenu();
        this.hoveredNav();
    }
};

/*
    SET THEME IMMEDIATELY
*/

theme.setTheme();

/*
    WHEN DOCUMENT READY
*/

document.addEventListener('DOMContentLoaded', function () {
    accessibility.init();
    theme.themeSwitcher();
}, false);
