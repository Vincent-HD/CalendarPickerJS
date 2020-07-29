/**
 * @class CalendarPicker
 * @description Provides a simple way to get a minimalistic calender in your DOM.
 * @author Mathias Picker - 29 July 2020
 */

class CalendarPicker {
    constructor(element, options) {
        // Core variables.
        this.day = new Date().getDay()
        this.month = new Date().getMonth();
        this.year = new Date().getFullYear();

        // The date used for calculation, starts as today.
        this.date = new Date();
        this._formatDateToInit(this.date)

        // Storing the todays date for practical reasons.
        this.today = this.date;

        // The calendars value should always be the current date
        this.value = this.date;

        // Ranges for the calendar (optional)
        this.min = options.min;
        this.max = options.max;
        this._formatDateToInit(this.min)
        this._formatDateToInit(this.max)

        // Element to insert calendar in.
        this.userElement = document.querySelector(element);

        // Destructuring current date as readable text.
        [this.dayAsText, this.monthAsText, this.dateAsText, this.yearAsText] = this.date.toString().split(' ')

        // The elements used to build the calendar.
        this.calendarWrapper = document.createElement('div');
        this.calendarElement = document.createElement('div')
        this.calendarHeader = document.createElement('header');
        this.calendarHeaderTitle = document.createElement('h4');
        this.navigationWrapper = document.createElement('section')
        this.previousMonthArrow = document.createElement('button');
        this.nextMonthArrow = document.createElement('button');
        this.calendarGridDays = document.createElement('section')
        this.calendarGrid = document.createElement('section');
        this.calendarDayElementType = 'time';

        // Hard-coded list of all days.
        this.listOfAllDaysAsText = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];

        // Hard-coded list of all months.
        this.listOfAllMonthsAsText = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        // Creating the calendar
        this.calendarWrapper.id = 'calendar-wrapper';
        this.calendarElement.id = 'calendar';
        this.calendarGridDays.id = 'calendar-days';
        this.calendarGrid.id = 'calendar-grid';
        this.navigationWrapper.id = 'navigation-wrapper';
        this.previousMonthArrow.id = 'previous-month';
        this.nextMonthArrow.id = 'next-month';

        this._insertHeaderIntoCalendarWrapper();

        this._insertCalendarGridDaysHeader();
        this._insertDaysIntoGrid();
        this._insertNavigationButtons();
        this._insertCalendarIntoWrapper();

        this.userElement.appendChild(this.calendarWrapper);
    }

    /**
     * @param {Number} The month number, 0 based.
     * @param {Number} The year, not zero based, required to account for leap years.
     * @return {Array<Date>} List with date objects for each day of the month.
     * @author Juan Mendes - 30th October 2012
     */
    _getDaysInMonth = (month, year) => {
        if (!month || !year) return;

        const date = new Date(year, month, 1);
        const days = [];

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    /**
     * @param {DateObject} date 
     * @description Sets the clock of a date to 00:00:00 to be consistent.
     */
    _formatDateToInit = (date) => {
        if (!date) return;
        date.setHours(0, 0, 0);
    }

    /**
     * @description Inserts the calendar into the wrapper +
     * adds eventListeners for the calender-grid.
     */
    _insertCalendarIntoWrapper = () => {
        this.calendarWrapper.appendChild(this.calendarElement);

        /**
         * @param {Event} event An event from an eventListener.
         */
        const handleSelectedElement = (event) => {
            if (event.target.nodeName.toLowerCase() === this.calendarDayElementType && !event.target.classList.contains('disabled')) {

                // Removes the 'selected' class from all elements that have it.
                Array.from(document.querySelectorAll('.selected')).forEach(element => element.classList.remove('selected'));

                // Adds the 'selected'-class to the selected date.
                event.target.classList.add('selected');

                this.value = event.target.value;

                // Fires the onValueChange function with the provided callback.
                this.onValueChange(this.callback);
            }
        }

        this.calendarGrid.addEventListener('click', handleSelectedElement, false);

        this.calendarGrid.addEventListener('keydown', (keyEvent) => {
            if (keyEvent.key !== 'Enter') return;

            handleSelectedElement(keyEvent);
        }, false);
    }

    /**
     * @description Adds the "main" calendar-header.
     */
    _insertHeaderIntoCalendarWrapper = () => {
        this.calendarHeaderTitle.textContent = `${this.listOfAllMonthsAsText[this.month]} - ${this.year}`;
        this.calendarHeader.appendChild(this.calendarHeaderTitle);
        this.calendarWrapper.appendChild(this.calendarHeader);
    }

    /**
     * @description Inserts the calendar-grid header with all the weekdays.
     */
    _insertCalendarGridDaysHeader = () => {
        this.listOfAllDaysAsText.forEach(day => {
            const dayElement = document.createElement('span');
            dayElement.textContent = day;
            this.calendarGridDays.appendChild(dayElement);
        })

        this.calendarElement.appendChild(this.calendarGridDays);
    }

    /**
     * @description Adds the "Previous" and "Next" arrows on the side-navigation.
     * Also inits the click-events used to navigating.
     */
    _insertNavigationButtons = () => {
        // Ugly long string, but at least the svg is pretty.
        const arrowSvg = '<svg viewBox="0 0 466.678 466.678" xmlns="http://www.w3.org/2000/svg"><path d="m411.631 240.58-171.093 222.552c-1.714 2.234-4.386 3.546-7.196 3.546-2.825 0-5.482-1.312-7.196-3.546l-171.108-222.552c-1.253-1.638-1.882-3.582-1.882-5.539 0-1.921.605-3.848 1.835-5.467 2.444-3.257 6.783-4.472 10.578-2.979l113.3 44.757-.013-262.273c.012-5.018 4.067-9.079 9.091-9.079h90.774c5.024 0 9.079 4.061 9.091 9.079l-.012 262.273 113.298-44.763c3.8-1.492 8.139-.278 10.592 2.985 2.459 3.263 2.448 7.767-.059 11.006z"/></svg>';

        this.previousMonthArrow.innerHTML = arrowSvg;
        this.nextMonthArrow.innerHTML = arrowSvg;

        this.previousMonthArrow.tabIndex = 1;
        this.nextMonthArrow.tabIndex = 1;

        this.navigationWrapper.appendChild(this.previousMonthArrow);
        this.navigationWrapper.appendChild(this.nextMonthArrow);

        this.navigationWrapper.addEventListener('click', (clickEvent) => {
            if (clickEvent.target.closest(`#${this.previousMonthArrow.id}`)) {
                if (this.month === 0) {
                    this.month = 11;
                    this.year -= 1;
                } else {
                    this.month -= 1;
                }
                this._updateCalendar();
            }

            if (clickEvent.target.closest(`#${this.nextMonthArrow.id}`)) {
                if (this.month === 11) {
                    this.month = 0;
                    this.year += 1;
                } else {
                    this.month += 1;
                }
                this._updateCalendar();
            }
        }, false)

        this.calendarElement.appendChild(this.navigationWrapper);
    }

    /**
     * @description Adds all the days for current month into the calendar-grid.
     * Takes into account which day the month starts on, so that "empty/placeholder" days can be added
     * in case the month for example starts on a Thursday.
     * Also disables the days that are not within the provided 
     */
    _insertDaysIntoGrid = () => {
        this.calendarGrid.innerHTML = '';

        let arrayOfDays = this._getDaysInMonth(this.month, this.year);

        let firstDayOfMonth = arrayOfDays[0].getDay();

        // Converting Sunday (0 when using getDay()) to 7 to make it easier to work with.
        firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

        if (1 < firstDayOfMonth) {
            arrayOfDays = Array(firstDayOfMonth - 1).fill(false, 0).concat(arrayOfDays);
        }

        arrayOfDays.forEach(date => {
            const dateElement = document.createElement(date ? this.calendarDayElementType : 'span');
            const [Day, Month, Date, Year] = date.toString().split(' ');

            const dateIsTheCurrentValue = this.value.toString() === date.toString();
            if (dateIsTheCurrentValue) this.activeDateElement = dateElement;

            const dateIsBetweenAllowedRange = (this.min || this.max) && (date.toString() !== this.today.toString() && (date < this.min || date > this.max))
            if (dateIsBetweenAllowedRange) {
                dateElement.classList.add('disabled');
            } else {
                dateElement.tabIndex = 0;
                dateElement.value = date;
            }

            dateElement.textContent = date ? `${Date}` : '';
            this.calendarGrid.appendChild(dateElement);
        })

        this.calendarElement.appendChild(this.calendarGrid)
        this.activeDateElement.classList.add('selected');
    }

    /**
     * @description Updates the core-values for the calendar based on the new month and year
     * given by the navigation. Also updates the UI with the new values.
     */
    _updateCalendar = () => {
        this.date = new Date(this.year, this.month);

        [this.dayAsText, this.monthAsText, this.dateAsText, this.yearAsText] = this.date.toString().split(' ');
        this.day = this.date.getDay();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();

        window.requestAnimationFrame(() => {
            this.calendarHeaderTitle.textContent = `${this.listOfAllMonthsAsText[this.month]} - ${this.year}`;
            this._insertDaysIntoGrid();
        })
    }

    /**
     * @param {Function} callback
     * @description A "listener" that lets the user do something everytime the value changes.
     */
    onValueChange = (callback) => {
        if (this.callback) return this.callback(this.value);
        this.callback = callback;
    }
}