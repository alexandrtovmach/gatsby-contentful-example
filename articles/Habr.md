Вы уже слышали о новом подходе JAMstack? Возможность писать веб-приложения на любимом фреймворке, управлять контентом из админ панели, а на выходе получать полностью валидные HTML-страницы построенные согласно с самыми последними рекомендациями SEO, PWA и a11y.

Интересно? Тогда вот список рассматриваемых вопросов в этой статье:

- Что это за новый стек и зачем он нужен?
- Как запустить базовое приложение используя Gatsby?
- Работа с Contentful и создание первой порции данных
- Как связать Contentful и Gatsby используя GraphQL?
- Настроить автоматический деплоймент используя Netlify

<cut/>

## JAMstack
Как известно: “Всё новое это давно забытое старое” и вот очередное подтверждение ― мода на статические сайты возвращается. Что представлял собой интернет десять лет назад? Это был PHP сервер-рендеринг, который подставлял данные из БД в HTML-шаблоны и отправлял на клиент.

![server rendering](https://habrastorage.org/webt/nk/4j/lr/nk4jlri46dpf-yeilgloknxtx8o.png)

На смену этому подходу пришли JavaScript фреймворки, которые в последние годы представлены святой троицей веба _React Angular Vue_ ~~Аминь~~. В чем было кардинальное отличие? В скорости и отзывчивости интерфейса, ведь теперь вся логика сайта находилась на клиенте, и на любое движение мышью можно вызывать красивую анимацию с изменением контента, отправкой запросов на API.

![client rendering](https://habrastorage.org/webt/yz/yl/yd/yzylydcklduuinekhlfcf6lqwmk.png)

Что дальше? JAM предлагает:
- никакого server-side рендеринга, да и вообще убрать сервер как таковой
- никакого client-side рендеринга, долой `<div id=”root”></div>`
- компилировать сайт в обычный HTML код, единожды, в момент изменения контента
- размещение сайта на любом файловом хостинге

![JAM](https://habrastorage.org/webt/s_/cl/8x/s_cl8xgwabvmmlr8yp7rssmwg48.png)

Клиент всегда получает, заранее отрендеренную страницу с полностью валидной версткой и вопрос о производительности теперь касается только скорости интернет соединения (но конечно же не стоит забывать про коэффициент прямоты рук разработчиков).

## Инструментарий
JAM это всего лишь подход, средств для которого на рынке уже достаточно, но как известно гвозди можно забивать чем угодно, но я предпочту молоток.

![hammer nail](https://media.giphy.com/media/1AJ7FSKXXGnmb8NT3e/giphy.gif)

**Список лучших инструментов на 2019 год:**

[Gatsby](https://www.gatsbyjs.org/) ― это генератор статических сайтов из _React + GraphQL_ приложений. Почему именно такой выбор, а не _Angular_ или _Vue_ я затрудняюсь ответить, но скорее всего дело в злой статистике, которая говорит что не смотря на все споры, _React_ самый популярный фреймворк последних трех лет (не забросайте меня камнями в комментариях, за это утверждение, на самом деле мне заплатили). Для более наглядного представления `create-react-app` компилирует код в JavaScript билд, для дальнейшего рендера при запуске страницы, Gatsby генерирует полноценные HTML-страницы, с валидной версткой, которые показываются как есть, даже с выключенным JS.

[Contentful](https://www.contentful.com/) ― система управления контентом на статических страницах. Это _WordPress_, который не сохраняет связи между шаблонами и данными в БД, а вместо этого меняет данные непосредственно в HTML файлах.

[Netlify](https://app.netlify.com/) ― это очень простая в использовании система деплоймента, которая позволяет связать большинство популярных файловых хостингов с JAM приложением, да ещё и на HTTPS протоколе.

## От теории к практике
Теперь когда определились с инструментами ― можно приступать.

### Contentful
Создаем аккаунт и видим что по умолчанию сервис генерирует образцовый проект, который я рекомендую сразу же удалять, так как по моему субъективному мнению он больше мешает, чем помогает разобраться. Создаем новый бесплатный проект, без генерации примеров.

Система управления контентом базируется на двух сущностях ― **Content model**, описывающая структуру и типы данных,  и непосредственно **Content**. Для начала создадим простую модель для нашего блога. **Content model** состоит из типов данных, например для блога типами данных будут: _Article_, _Person_.

![](https://habrastorage.org/webt/tf/h_/ae/tfh_aezqyltilbnfometsxytrfg.gif)

> конечно же можно выбрать любой уровень абстракции, который по душе, например можно упразднить _Person_ и указывать данные об авторе внутри _Article_, как _Article.author_name_

<spoiler title="Структура моей модели">

  ```
  article/
  ├── title (Short text)
  ├── text (Long text)
  ├── banner (Single media)
  └── publishedAt (Date & Time)

  person/
  ├── fullName (Short text)
  └── avatar (Single media)
  ```

</spoiler>

Далее, используя уже созданные типы данных, добавляем контент, для текстов можно использовать [SaganIpsum](http://saganipsum.com/) для картинок [Unsplash](https://unsplash.com/search/photos/space).

![contentful add content](https://habrastorage.org/webt/t_/je/1u/t_je1uev3db2j6-io_f7xpnq9fm.gif)


### Gatsby
Открываем терминал и создаем рабочую среду
```
## Установка
npm install --global gatsby-cli

## Создание проекта
gatsby new personal-blog

## Для любителей минимализма можно установить Hello World проект
## gatsby new minimal-gatsby https://github.com/gatsbyjs/gatsby-starter-hello-world

## Переходим в папку
cd personal-blog
```

<spoiler title="Структура проекта">
    
  ```
  personal-blog/
  ├── gatsby-browser.js
  ├── gatsby-config.js
  ├── gatsby-node.js
  ├── gatsby-ssr.js
  ├── LICENSE
  ├── node_modules
  ├── package.json
  ├── README.md
  └── src
      ├── components
      │   ├── header.js
      │   ├── image.js
      │   ├── layout.css
      │   ├── layout.js
      │   └── seo.js
      ├── images
      │   ├── gatsby-astronaut.png
      │   └── gatsby-icon.png
      └── pages
          ├── 404.js
          ├── index.js
          └── page-2.js
  ```

</spoiler>

```
## Запуск проекта с hot-reloading
gatsby develop
```

Что получилось? _React + GraphQL_ приложение собираемое с помощью _Gatsby_, что значит что можно любой старый проект, который долго рендерится перевести в статический HTML сайт и получить прирост в скорости в несколько раз.

### Gatsby+Contentful
```
## Установка дополнительных пакетов
npm install gatsby-source-contentful dotenv
```

Создаем файл _.env_ в корне приложения со следующим содержимым:
```
/* 12-и значный ключ из Contentful → Settings → API keys → Example key 1→ Space ID */
CONTENTFUL_SPACE_ID=xxxxxxxxxxxx
/* 64-х значный ключ из Contentful → Settings → API keys → Example key 1→ Content Delivery API - access token */
CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Расширяем конфигурацию в _gatsby-config.js_:
```
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
module.exports = {
  /* other settings */
  plugins: [
    /* other plugins */
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    }
  ]
}
```

Перезапускаем Gatsby сервер и если консоль не показывает никаких ошибок, значит соединение с Contentful установлено и можно переходить дальше.

### Gatsby+GraphQL+Contentful

Если Вы еще не знакомы с GraphQL, то не переживайте потому что это достаточно просто. Наш сайт сейчас находится по адресу:

[http://localhost:8000/](http://localhost:8000/)

Но мы пока что оставим его и откроем вторую вкладку:

[http://localhost:8000/___graphql](http://localhost:8000/)

Перед нами IDE для _GraphQL_ прямо в браузере. С ним очень удобно строить запросы и тестировать их. Кликните на **Docs** в верхнем правом углу, чтобы развернуть сайдбар с документацией, но сюрприз, это не документация к _GraphQL_, это документация Вашего API. Разверните список **Query** чтобы увидеть все доступные схемы для запросов, с их типами данных.

Интересующие нас схемы имеют примерно следующее название:

**contentful**_ВашТипДанных_ - один экземпляр  
**allContentful**_ВашТипДанных_ - список экземпляров

<spoiler title="Пример моих данных">

  - contentfulArticle
  - contentfulPerson
  - allContentfulArticle
  - allContentfulPerson

</spoiler>

Используя левую панель построим правильный запрос для наших данных (попробуйте автодополнение, очень удобно).

<spoiler title="Пример запрашивающий один экземпляр типа Person и список из Article">

  ```
  {
    contentfulPerson {
      fullName
      avatar {
        file {
          url
        }
      }
    } 
    allContentfulArticle {
      edges {
        node {
          title
          text {
            text
          }
          banner {
            file {
              url
            }
          }
          publishedAt
        }
      }
    }
  }
  ```

</spoiler>

Что можно отметить из структуры запросов:
- чтобы получить URL для файла, нужно обращаться по пути `typeName.file.url`
- чтобы получить текст из типа Long text, идем по пути `typeName.typeName`
- чтобы получить список экземпляров какого-то типа нужно использовать следующий путь `allContentfulName.edges`

Переносим схему запроса в проект и рендерим их как обычные данные в React-приложении. Общепринятым Best Practice считается использование `<StaticQuery />` компонента из пакета [gatsby](https://www.npmjs.com/package/gatsby), который уже установлен в проект.

<spoiler title="Пример файла index.js">
    
  ```
  import React from "react"
  import { StaticQuery, graphql } from "gatsby"

  import Layout from "../components/layout"
  import Article from "../components/article"

  const IndexPage = () => (
    <Layout>
      <StaticQuery
        query={graphql`
          {
            allContentfulArticle {
              edges {
                node {
                  id
                  title
                  text {
                    text
                  }
                  banner {
                    file {
                      url
                    }
                  }
                  publishedAt
                }
              }
            }
          }
        `}
        render={({
          allContentfulArticle: {
            edges
          }
        }) => (
          edges.map(({ node }) => (
            <Article key={node.id} content={node} />
          ))
        )}
      />
    </Layout>
  )

  export default IndexPage
  ```

</spoiler>

Как это работает? В `query` передается схема запроса _GraphQL_, а в `render` наш любимый JSX. Используйте деструктуризацию  чтобы сделать код более читабельным.

<spoiler title="Деструктуризация на примере components/article.js">

  ```
  import React from "react"

  const Article = ({
    content: {
      title,
      text,
      banner: {
        file: {
          url
        }
      },
      publishedAt
    }
  }) => (
    <div>
      <h2>{title}</h2>
      <img src={url} alt={title}/>
      <p>
        {text}
      </p>
      <h5>{publishedAt}</h5>
    </div>
  )

  export default Article
  ```

</spoiler>
Теперь когда стало ясно как получить и отрендерить данные можно приступать к разработке, но так как эта статья не о том как сделать сайт на реакте, то мы опустим этот момент и представим что сайт готов.

Разместим наш проект на GitHub, откуда его можно будет деплоить в следующем шаге.

<spoiler title="Для тех кто до сих пор не в курсе как это сделать">
    
  ```
  ## Находясь в папке с проектом инициализируем пустой репозиторий
  git init

  ## Сделаем первый коммит
  git add .
  git commit -m “initial commit”

  ## Создаем репозиторий на GitHub и подключаем
  git remote add origin git@github.com:yourname/my-repository-name.git

  ## Публикуем изменения
  git push origin master
  ```
  
</spoiler>

### Настраиваем Netlify
Создаем аккаунт используя тот сервис, на котором планируется размещение проектов. Я выбрал GitHub, поэтому после успешной авторизации настроим новый проект, клик на **New site from Git**. Подключаем наш репозиторий, а _Netlify_ автоматически определит что это _Gatsby_ проект и настроит все скрипты для сборки.

Выбираем нужную ветку, и не забываем про переменные окружения, для этого раскрываем меню **Advanced settings** и добавляем содержимое локального файла _.env_ и подтверждаем настройки.

Пара минут магии и сайт на месте:  
[https://tender-liskov-ce3ad0.netlify.com](https://tender-liskov-ce3ad0.netlify.com)

Осталось добавить хук на обновление контента. Переходим в настройки:  

**Deploy settings → Build hooks → Add build hook**
![netlify webhook](https://habrastorage.org/webt/qp/ry/1o/qpry1oyehcw2wvh9v9yq--odrgg.gif)
Устанавливаем любое понятное название, для примера _"Contentful hook"_, выбираем ветку с которой будем делать билд и подтверждаем. Результатом будет ссылка, копируем и идем в панель _Contentful_:  

**Settings → Webhooks**  
![contentful webhook](https://habrastorage.org/webt/he/en/i8/heeni8del9_aw7o-wlgkypmb6b0.gif)
Ищем на правой боковой панели темплейт для _Netlify_ и в два клика связываем две системы. Пробуем изменить контент и смотрим как новые данные появляются на сайте.

## Итого
JAM-stack совмещает в себе решение проблем предшествующих подходов и похоже претендует на захват власти и всемирную популярность, но революция ли это? Ничего нового и особенного нет, но это самая передовая методология последних двух лет, там, [на чужбине](https://jamstack.org/community/), а у нас? Мы только-только начали переводить проекты с _WordPress_ на _React_ и это однозначно прогресс, но может чтобы не остаться за бортом, как легендарный индийский аутсорс, нам пора делать более решительные шаги?


[Ссылка на репозиторий с проектом](https://github.com/alexandrtovmach/gatsby-contentful-example)