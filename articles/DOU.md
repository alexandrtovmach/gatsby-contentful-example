# JAMstack: Власний блог з Gatsby + Contentful + Netlify

[Стаття російською](https://habr.com/ru/post/439232/)

Ви вже чули про новий підхід JAMstack? Нарешті з’явилася можливість створювати веб додатки на улюбленому React, мати зручну адмін панель для керування контентом, а на виході отримувати повністю валідні HTML-сторінки, побудовані згідно з останніми рекомендаціями SEO, PWA та a11y.

Цікаво? Тоді ось список питаннь розглянутих у статті:

- Що це за новий стек і навіщо він потрібен?
- Як запустити перший проект на Gatsby?
- Contentful для керування даними
- Як зв'язати Contentful з Gatsby використовуючи GraphQL?
- Налаштування автоматичного деплойменту з Netlify

<cut/>

## JAMstack
Як відомо: "Все нове, то давно забуте старе" і ось ще одне підтвердження ― статичні сайти повертаються. Що таке web десять років тому? Це був PHP сервер-рендер, який при кожному запиті з клієнта підставляв дані з БД у HTML-шаблони і віддавав сторінку.

![server rendering](https://habrastorage.org/webt/nk/4j/lr/nk4jlri46dpf-yeilgloknxtx8o.png)

На зміну цьому підходу прийшли JavaScript фреймворки, які в останні роки представлені святою трійцею вебу _React Angular Vue_ ~~ Амінь ~~. У чому була кардинальна відмінність? У швидкості і чуйності інтерфейсу, адже тепер вся логіка сайту перебудобується на клієнті, і на будь-який рух мишею можна викликати красиву анімацію з одночасною зміною контенту та відправкою запитів на сервер.

![client rendering](https://habrastorage.org/webt/yz/yl/yd/yzylydcklduuinekhlfcf6lqwmk.png)

Что дальше? JAM предлагает:
Що далі? JAM пропонує:
- ніякого server-side рендерингу, та й взагалі прибрати сервер
- ніякого client-side рендерингу, ніякого більше `<div id ="root"></ div>`
- компілювати сайт в звичайний HTML код, одного разу, лише в момент зміни контенту
- розміщення сайту на будь-якому файловому хостингу

![JAM](https://habrastorage.org/webt/s_/cl/8x/s_cl8xgwabvmmlr8yp7rssmwg48.png)

Клієнт завжди отримує, заздалегідь відрендерену сторінку з повністю валідною з точки зору SEO структурою, і питання про продуктивність тепер стосується тільки швидкості інтернет з'єднання клієнта (але звичайно ж не варто забувати про коефіцієнт прямоти рук розробників).

## Інструменти
JAM це всього лише підхід, засобів для якого на ринку вже достатньо, але як відомо цвяхи можна забивати чим завгодно, але я пропоную використовувати молоток.

![hammer nail](https://media.giphy.com/media/1AJ7FSKXXGnmb8NT3e/giphy.gif)

**Список найкращих інструментів на 2019 рік:**

[Gatsby](https://www.gatsbyjs.org/) ― це генератор статичних сайтів з _React + GraphQL_ додатків. Чому саме такий вибір, а не _Angular_ або _Vue_ я не знаю, але швидше за все, справа у статистиці, яка говорить що не дивлячись на всі суперечки, _React_ це найпопулярніший фреймворк останніх трьох років (не закидайте мене камінням в коментарях, за це твердження, насправді мені заплатили). Для більш наочного уявлення `create-react-app` компілює код в JavaScript білд, для подальшого рендеру під час старту сторінки, Gatsby генерує повноцінні HTML-сторінки, які показуються як є, навіть з вимкненим JS.

[Contentful](https://www.contentful.com/) ― система управління контентом на статичних сторінках. Це _WordPress_, який не зберігає зв'язки між шаблонами і даними в БД, а замість цього змінює дані безпосередньо в HTML файлах.

[Netlify](https://app.netlify.com/) ― це дуже проста у використанні система деплойменту, яка дозволяє зв'язати більшість популярних файлових хостингів з JAM додатком, та ще й на HTTPS протоколі.

## До діла
Тепер коли визначилися з інструментами - можна починати.

### Contentful
Створюємо аккаунт і бачимо, що за замовчуванням сервіс генерує зразковий проект, який я рекомендую відразу ж видаляти, так як на мою суб'єктивну думку він більше заважає, аніж допомагає розібратися. Створюємо новий безкоштовний проект, без генерації зразків.

Вцілому система управління базується на двох сутностях - **Content model**, що описує структуру і типи даних, і сам **Content**. Для початку створимо просту модель для нашого блогу. **Content model** складається з типів даних, наприклад для блогу типами даних будуть: _Article_, _Person_.

![](https://habrastorage.org/webt/tf/h_/ae/tfh_aezqyltilbnfometsxytrfg.gif)

> звичайно ж можна вибрати рівень абстракції, якій здається кращим, наприклад можна замість _Person_ вказувати дані про автора всередині _Article_, як _Article.author_name_

<spoiler title="Зразок структури даних">

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

Далі, використовуючи вже створені типи даних додаємо контент, для текстів можна використовувати [SaganIpsum](http://saganipsum.com/) для зображеннь [Unsplash](https://unsplash.com/search/photos/space).

![contentful add content](https://habrastorage.org/webt/t_/je/1u/t_je1uev3db2j6-io_f7xpnq9fm.gif)


### Gatsby
Відкриваємо термінал і створюємо робоче середовище
```
## Встановлення
npm install --global gatsby-cli

## Створення проекту
gatsby new personal-blog

## Для любителів мінімалізму можна встановити Hello World проект
## gatsby new minimal-gatsby https://github.com/gatsbyjs/gatsby-starter-hello-world

## Переходимо в теку
cd personal-blog
```

<spoiler title="Структура згенерованого проекту">
    
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
## Запуск проекту с hot-reloading
gatsby develop
```

Що вийшло? _React + GraphQL_ додаток, який збирається за допомогою _Gatsby_, що означає що можна будь-який старий проект, який довго рендериться перевести в статичний HTML сайт і отримати приріст у швидкості в кілька разів.

### Gatsby+Contentful
```
## Встановлення додаткових пакетів
npm install gatsby-source-contentful dotenv
```

Створюємо файл _.env_ в кореневій теці додатку з наступним змістом:
```
/* 12-и значный ключ з Contentful → Settings → API keys → Example key 1→ Space ID */
CONTENTFUL_SPACE_ID=xxxxxxxxxxxx
/* 64-х значный ключ з Contentful → Settings → API keys → Example key 1→ Content Delivery API - access token */
CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Розширюємо конфігурацію в _gatsby-config.js_:
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

Перезапускаємо Gatsby сервер і якщо консоль не має ніяких помилок, значить з'єднання з Contentful встановлено і можна переходити далі.

### Gatsby+GraphQL+Contentful

Якщо Ви ще не знайомі з GraphQL, то не переймайтесь бо це досить просто. Сайт зараз знаходиться за адресою:

[http://localhost:8000/](http://localhost:8000/)

Але поки що залишимо його і відкриємо другу вкладку:

[http://localhost:8000/___graphql](http://localhost:8000/)

Перед нами IDE для _GraphQL_ прямо в браузері. З ним дуже зручно будувати запити і тестувати їх. Натисніть на **Docs** в верхньому правому куті, щоб розгорнути сайдбар з документацією, але сюрприз, це не документація до _GraphQL_, це документація Вашого API. Розгорніть список **Query**, щоб побачити всі доступні схеми для запитів, з їх типами даних.

Схеми, які нас цікавлять, мають приблизно наступну назву:

**contentful**_ВашТипДаних_ - один екземпляр  
**allContentful**_ВашТипДаних_ - список з екземплярів

<spoiler title="Зразок моїх даних">

  - contentfulArticle
  - contentfulPerson
  - allContentfulArticle
  - allContentfulPerson

</spoiler>

Використовуючи ліву панель побудуємо правильний запит для наших даних (спробуйте автодоповнення, дуже зручно).

<spoiler title="Зразок, який запитує один екземпляр типу Person та список з Article">

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

Що можна відзначити із структури запитів:
- щоб отримати URL для файлу, потрібно звертатися по шляху `typeName.file.url`
- щоб отримати текст з типу Long text, йдемо по шляху `typeName.typeName`
- щоб отримати список екземплярів якогось типу потрібно використовувати наступний шлях `allContentfulName.edges`

Переносимо схему запиту до проекту і рендеримо відповідь, як звичайні дані в React-додатку. Загальноприйнятим Best Practice вважається використання `<StaticQuery />` компонента, з пакета [gatsby] (https://www.npmjs.com/package/gatsby), який вже встановлений в проект.

<spoiler title="Зразок файлу index.js">
    
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

Як це працює? В `query` передається схема запиту _GraphQL_, а в` render` наш улюблений JSX. Використовуйте деструктуризацію, щоб зробити код більш читабельним.

<spoiler title="Зразок деструктуризації на прикладі components/article.js">

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

Тепер коли стало зрозуміло, як отримати і відрендерити дані, можна приступати до розробки, але так як ця стаття не про те "як зробити сайт на реакті", то ми опустимо цей момент і уявимо, що сайт вже готовий.

Розмістимо наш проект на GitHub, звідки його можна буде публікувати в наступному кроці.

<spoiler title="Для тих хто до сих пір не в курсі як це зробити">
    
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
Створюємо аккаунт використовуючи той сервіс, на якому планується розміщення проектів. Я вибрав GitHub, тому після успішної авторизації налаштуємо новий проект з **New site from Git**. Підключаємо наш репозиторій, а _Netlify_ автоматично визначить, що це _Gatsby_ проект, і налаштує всі скрипти для збірки.

Вибираємо потрібну гілку, і не забуваємо про змінні оточення, для цього відкриваємо меню **Advanced settings** і додаємо змінні з локального файлу _.env_ та підтверджуємо налаштування.

Пару хвилин магії і сайт на місці:
[https://tender-liskov-ce3ad0.netlify.com](https://tender-liskov-ce3ad0.netlify.com)

Залишилося додати хук на оновлення контенту. Переходимо в налаштування: 

**Deploy settings → Build hooks → Add build hook**
![netlify webhook](https://habrastorage.org/webt/qp/ry/1o/qpry1oyehcw2wvh9v9yq--odrgg.gif)
Встановлюємо будь зрозумілу назву, для прикладу _"Contentful hook"_, вибираємо гілку з якої будемо робити білд і підтверджуємо. Результатом буде посилання, копіюємо його і йдемо в панель _Contentful_:  

**Settings → Webhooks**  
![contentful webhook](https://habrastorage.org/webt/he/en/i8/heeni8del9_aw7o-wlgkypmb6b0.gif)
Шукаємо на правій панелі темплейт для _Netlify_ і в пару кліків пов'язуємо дві системи. Пробуємо змінити контент і дивимося, як нові дані з'являються на сайті.

## Висновок
JAM-stack поєднує в собі рішення проблем попередніх підходів і схоже претендує на захоплення влади і всесвітню популярність, але чи це революція? Нічого нового і особливого немає, але це найбільш передова методологія останніх двох років, там, [на чужині](https://jamstack.org/community/), а у нас? Ми тільки-тільки почали переводити проекти з _WordPress_ на _React_ і це однозначно прогрес, але може щоб не залишитися за бортом, як легендарний індійський аутсорс, нам пора робити більш рішучі кроки?


[Посилання на репозиторій з проектом](https://github.com/alexandrtovmach/gatsby-contentful-example)