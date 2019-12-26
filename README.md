# url-shortener: URL Shortener Project


### Инструкция по деплою проекта на Ubuntu.
* Для сборки и запуска проекта нужен Docker и Docker Compose. Установить, 
следуя инструкциям из официальной докумантации:
        https://docs.docker.com/install/linux/docker-ce/ubuntu/
        https://docs.docker.com/compose/install/



* Склонировать репозиторий: 
    ```
    git clone https://github.com/burkovski/url-shortener.git
    ```


* Перейти в директорию проекта: 
    ```
    cd url-shortener/
    ```


* Создать файл окружения: 
    ```
    touch .env
    ```


* Открыть файл окружения в текстовом редакторе, например, nano: 
    ```
    nano .env
    ```


* Вставить в этот файл следующие строки и соханить:
    
    ```    
    POSTGRES_DB=url_shortener
    POSTGRES_USER=url_shortener
    POSTGRES_PASSWORD=1qaz2wsx
    
    PYTHONASYNCIODEBUG=1
    PYTHONDONTWRITEBYTECODE=1
    
    SECRET_KEY=6d74486ed77c4a67b2320d84736c8bce
    TOKEN_TTL=1800
    REF_TOKEN_TTL=2592000
    
    SHORT_URL_MIN_TTL=86400
    SHORT_URL_MAX_TTL=31536000
    SHORT_URL_INCREASE=86400
    ```


*  Поднять docker-контейнеры:
    ```
    make build
    make run
    ```
  
   
* Открыть новое окно терминала. Выполнить тесты:
    ```
    make tests
    ```


* Создать реляции для СУБД PostgreSQL:
    ```
    make create_tables
    ```


### Мы подняли development-окружение. Попасть на веб-интерфейс можно по адресу: http://localhost/. Далее будет описан запуск production-mode. 
  
* Создать бандл frontend-приложения:
    ```
    make build_dist
    ```
  
* Остановить и удалить dev-контейнеры:
    ```
    make clean
  ```
  
  
* Запустить контейнеры:
    ```
    make run_prod
  ```

---


# Описание API:
По сути, backend проекта это два асинхронных(aiohttp) микросервиса, - один для аутентификации 
пользователей, другой - непосредственно для работы с URL'ами. В качестве схемы авторизации выбрал JWT - привлекла
возможность строить stateless сервисы. Начну описаниес сервиса auth, т.к. токены, выданные им использует сервис urls.


###auth
Задача этого микросервиса - произвести аутентификацию пользователя. Также доступно создание новых
пользователей, refresh и инвалидация токенов. Пользователи хранятся в postgres, рефреш-токены в redis.
#####endpoints:
* POST /api/auth/users
        
    Создание нового пользователя. Тело запроса - json вида: 
           
        {"email": "foo@bar.baz", "password": "foobarbaz"}
        
    Ответ:
    
        {"created": "foo@bar.baz"}
        
* POST /api/auth/tokens
 
    Аутентификация пользователя. Тело запроса - json вида: 
       
        {"email": "foo@bar.baz", "password": "foobarbaz"}
        
    Ответ:
    
        {
            "created": {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE1NzczMjQwMDB9.i8ttJuYGBSPlMDVNmKdl8Q6NIwOo702KsXBawIjc1EI",
                "refresh_token": "304a23f1a32a44a7b6f3d505222ce121"
            }
        }
       
        
* PUT /api/auth/tokens

    Получить новую пару access- refresh-token по старому refresh-token. Тело запроса - json вида: 
       
        {"refresh_token": "304a23f1a32a44a7b6f3d505222ce121"}

    Ответ:

        {
            "created": {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTU3NzMyNDA5Mn0.waDPNNtGBpe0lyS6rXEI2kk1emBhGisdCpY-oAeb7fA",
                "refresh_token": "687f582cde8e426a8d50af127e85efeb"
            }
        }     
        
* DEL /api/auth/tokens
        
    Удалить refresh-token. Тело запроса - json вида: 
       
        {"refresh_token": "687f582cde8e426a8d50af127e85efeb"}
    
    Ответ:
    
        {"deleted": "687f582cde8e426a8d50af127e85efeb"}
        
        
###urls:
Этот микросервис занимается сокращением длинных URL, перенаправлением с короткого алиаса на 
полный URL и выдачей пользователю всех сокращенных им URL. У каждого URL есть имя жизни - от 1 то 365 дней.

#####endpoints:
* POST /api/urls/shortify

    Сокращает URL, переданый в теле запроса. Присутствует опциональный заголовок [Authorization: Bearer {token}].
    Этот заголовок нужен для авторищации пользователя.
        
        {
            "url_long": "https://github.com/burkovski/url-shortener/branches",
            "expire_at": 1578143690
        }
        
    Ответ:
        
        {"created": "http://localhost/1"}
        
        
* GET /api/urls/redirect/{url_id}

    Перенаправляет на полный URL, связанный с коротким URL в рамках периода жизни. Обращение к
    данному эндпоинту через localhost/{url_id} проксирует NGINX.


* GET /api/urls/owned

    Выдача информации о URL'ах, сокращенных пользователем. Для этого запроса заголдовок
    вида: [Authorization: Bearer {token}] является обязательным.
    
    Ответ:
    
        [
            {
                "redirects": "8",
                "url_long": "https://github.com/burkovski/url-shortener",
                "url_short": "http://localhost/1"
            },
            {
                "redirects": "3",
                "url_long": "https://www.python.org/",
                "url_short": "http://localhost/2"
            }
        ] 
 