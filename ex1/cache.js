const EventEmitter = require('events');

const db = require('../db/db');



class Cache extends EventEmitter {
    constructor() { // Используем принцип singleton
        super();
        if (Cache._instance) {
            return Cache._instance;
        } else {
            Cache._instance = this;
        }
    }
    
    query = null // Храним изначальный запрос к базе данных, который содержит все из таблицы lessons
    list = { // Храним кэшированные данные, полученные при помощи фильтра из запроса к бд
        value: null, // Список уроков
        params: { // Параметры запроса при кэшировании после фильтрации
            date: null, 
            status: null, 
            teachersId: null, 
            studentsCount: null
        }
    }

    async makeQuery() { // Запрос к базе данных
        if (this.query === null) { // Не храним предыдущий запрос к БД (его не было или базу данных обновили)
            this.query = await db.select('*').from('lessons');
        } 
        return;
    }

    clearQuery() { // Очистка от предыдущего запроса (при обновлении бд)
        this.clearList(); // Очистим список
        this.query = null;
    }

    clearList() { // Очистка списка уроков, полученного при фильтрации
        this.list.value = null;
        for (const key in this.list.params) {
            this.list.params[key] = null;
        }
    }
    
    compareList(req) { // Делаем новую фильтрацию, проверяем, не совпадает она со старой (чтобы взять из кэша)
        for (const key in this.list.params) {
            if (this.list.params[key] !== req[key]) { // Параметры фильтра изменились
                return false;
            }
        }
        return true; // Параметры фильтра не изменились
    } 

    async filterList(date, status, teachersId, studentsCount) { // Делаем фильтрацию по введеным параметрам

    }

    async getList({date, status, teachersId, studentsCount, page, lessons}) {
        await this.makeQuery(); // Делаем запрос к бд (либо запрос, либо берем кэш из прошлого запроса)
        if (!this.compareList()) { // Если параметры фильтра изменились, заново все отфильтровываем
            await this.filterList();
        }
        if (this.list.value === null || this.list.value.length === 0) { // Если ничего не найдено, вернем информацию с ошибкой
            return null;
        }
        return this.paginate(page, lessons);
    }

    paginate(page, lessons) {
        const maxPages = Math.ceil(this.list.value.length/lessons); // Максимальное число страниц
        const answer = {}; // Ответ бд по главному запросу
        let filterPage; // Страница, которую достаем из полученного запроса

        if (page <= maxPages) { // Страница запроса попадает в количество страниц
            filterPage = page;
            answer.page = page;
        } else { // Страница запроса больше максимальной, покажем последнюю
            filterPage = maxPages;
            answer.page = `Страницы ${page} нет! Показана последняя страница ${filterPage}`
        }

        answer.list = this.list.value.slice((filterPage-1)*5, 4+(filterPage-1)*5);

        return answer;
    }



    async updateDb() { // Обновляем результат, полученных в базе данных
        await db.select('*')
            .from('lessons')
            .where((builder) => {
                if (this.params.date.length > 10) {
                    const date1 = this.params.date.slice(0,10);
                    const date2 = this.params.date.slice(11)
                    builder
                        .where('date', '>=', date1)
                        .andWhere('date', '<=', date2)
                } else {
                    builder
                        .where('date', this.params.date.length)
                }
            })
    }
    



    clearQuery() {
        this.clear
    }
}

const cache = new Cache();

// Подписываеся на событие, которое будет ощищать кэш запроса при обновлении базы данных
cache.on('changeDb', function() { 
    this.clearQuery();
})

module.exports = cache;