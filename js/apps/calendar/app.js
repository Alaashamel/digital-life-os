const CalendarApp = {
    events: [],
    currentDate: new Date(),
    window: null,
    
    init(window) {
        this.window = window;
        this.loadEvents();
        this.render();
        Notifications.success('Calendar', 'Calendar launched');
    },
    
    loadEvents() {
        this.events = Storage.get('dlos_calendar_events', []);
    },
    
    saveEvents() {
        Storage.set('dlos_calendar_events', this.events);
    },
    
    addEvent(date, title, description) {
        this.events.push({
            id: Math.random().toString(36).substr(2, 9),
            date,
            title,
            description,
            created: new Date().toISOString(),
        });
        this.saveEvents();
        Notifications.success('Event Created', title);
    },
    
    getEventsForDate(date) {
        return this.events.filter(e => e.date === date.toISOString().split('T')[0]);
    },
    
    getDaysInMonth() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    },
    
    getFirstDayOfMonth() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    },
    
    render() {
        const content = this.window.getContent();
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
        
        let days = '';
        const firstDay = this.getFirstDayOfMonth();
        const daysInMonth = this.getDaysInMonth();
        
        for (let i = 0; i < firstDay; i++) days += '<div class="calendar-day empty"></div>';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const events = this.getEventsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            days += `<div class="calendar-day ${isToday ? 'today' : ''} ${events.length > 0 ? 'has-events' : ''}" data-date="${dateStr}" onclick="const title = prompt('Event title:'); if(title) CalendarApp.addEvent('${dateStr}', title, ''); CalendarApp.render();"><div class="calendar-day-num">${day}</div>${events.length > 0 ? '<div class="calendar-event-dot">●</div>' : ''}</div>`;
        }
        
        content.innerHTML = `<div class="calendar-app"><div class="calendar-header"><button class="btn btn-icon" onclick="CalendarApp.currentDate.setMonth(CalendarApp.currentDate.getMonth() - 1); CalendarApp.render();">←</button><h2>${monthName} ${year}</h2><button class="btn btn-icon" onclick="CalendarApp.currentDate.setMonth(CalendarApp.currentDate.getMonth() + 1); CalendarApp.render();">→</button></div><div class="calendar-weekdays"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div><div class="calendar-days">${days}</div><style>.calendar-app{display:flex;flex-direction:column;height:100%}.calendar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.calendar-header h2{margin:0;flex:1;text-align:center}.calendar-weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:10px;text-align:center;font-weight:600;font-size:12px}.calendar-days{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;flex:1}.calendar-day{background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:4px;padding:8px;cursor:pointer;transition:all var(--transition-fast);position:relative;min-height:60px;display:flex;flex-direction:column}.calendar-day:hover{background:var(--accent-color);color:var(--bg-primary)}.calendar-day.today{border:2px solid var(--accent-color)}.calendar-day.empty{background:0;border:none}.calendar-day-num{font-weight:600;font-size:14px}.calendar-event-dot{position:absolute;top:4px;right:4px;color:var(--success-color);font-size:12px}</style></div>`;
    }
};