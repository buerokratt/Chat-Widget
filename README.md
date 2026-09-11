# Bürokratt Widget

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test:coverage`

Launches the test runner and displays code coverage

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

### `npm run webpack`

Bundles the app into a single bundle named `widget_bundle.js` for easy embedding

## Snippet embedding

Snippet can be embedded to any site using the following html:

```
<div id="byk-va"></div>
<script>
  window._env_ = {
    RUUTER_API_URL: 'LOCATION_OF_RUUTER',
    NOTIFICATION_NODE_URL: 'Notification Node Server Url',
    NOTIFICATIONS_VAPID_PUBLIC_KEY: 'Public VAPID key supplied by application configuration',
    ENVIRONMENT: 'development', // 'developement | production'
    TIM_AUTHENTICATION_URL: 'TIM url with callback parameter',
    OFFICE_HOURS: {
      TIMEZONE: 'Europe/Tallinn',
      BEGIN: 8,
      END: 17,
      DAYS: [1, 2, 4, 5],
    },
    ENABLE_HIDDEN_FEATURES: 'FALSE',
    IFRAME_TARGET_OIRGIN: "*",
    FEEDBACK_RATING_COLORS_ENABLED: 'FALSE',
    ENABLE_MULTI_DOMAIN: 'FALSE',
    TERMINATION_TIMEOUT: 10,
    WIDGET_HEIGHT: 450;
    WIDGET_WIDTH: 400;
    STREAM_TYPING_SPEED: 30,
    FALLBACK_LANGUAGE: 'et',
    other variables...
  };
</script>
<script id="script-bundle" type="text/javascript" src="LOCATION_OF_WIDGET_BUNDLE" crossorigin=""></script>
```

## Multiple widgets on the same page

Every persisted key (chat id, open/closed state, dimensions, language, etc.) is namespaced by an
instance id, and the mount point is configurable, so more than one widget can run on the same page
without the instances overwriting each other's `localStorage`/`sessionStorage` data. Give each
instance's container a unique id and add `data-target` and `data-instance-id` attributes to that
instance's `<script id="script-bundle">` tag:

```
<div id="byk-va-2"></div>
<script>
  window._env_ = { ...same as above... };
</script>
<script
  id="script-bundle"
  type="text/javascript"
  src="LOCATION_OF_WIDGET_BUNDLE"
  data-target="byk-va-2"
  data-instance-id="search-widget"
  crossorigin=""
></script>
```

- `data-target` — id of the container `<div>` this instance should render into. Defaults to `byk-va`.
- `data-instance-id` — any unique string. When present, it's appended to every storage key this
  instance reads/writes, so it never collides with another instance's data, and it's sent as a
  `chatId` query parameter on the instance's API calls so the backend can tell its chat apart from
  another instance's. Omit it only on a genuine single-widget page, to keep the original, unprefixed
  keys and behavior.

**Important:** on a page with more than one widget, every instance needs its own `data-instance-id`
— including what might otherwise look like "the main" one. An instance with no id never sends a
`chatId` query parameter, so it relies on the backend's default-chat fallback (the `chatJwt` cookie's
own `chatId` field) — but that field always points at whichever chat was initialized most recently,
across *all* widgets on the page. Leave one instance unnamed on a multi-widget page and its requests
will silently start resolving against a different widget's chat as soon as that other widget
initializes.

The `chatJwt` cookie itself stays shared and `HttpOnly` across all instances — it tracks every
active chat's id in a `chatIds` array, and each instance's `chatId` query parameter selects which of
those the request concerns (validated against that array server-side; a chatId not in the array is
rejected). One consequence: `auth/jwt/extend` refreshes the cookie's expiry for *all* tracked chats
at once, since there's only one cookie — there's no way for one widget's activity to keep the cookie
alive while another's expires independently.

## Iframe Support

If you want to use the widget inside an Iframe use the following snippet or reference iframe-index.html

```
<body>
    <iframe
      title="YOUR_IFRAME_TITLE"
      id="YOUR_IFRAME_ID"
      width="0"
      height="0"
      src="WIDGET_DOMAIN_URL"
      scrolling="no"
      style="YOUR_STYLE"
    ></iframe>
    <script>
      window.addEventListener(
        "message",
        (e) => {
          const isOpened = e.data.isOpened;
          const isFullScreen = e.data.isFullScreen;
          if (isOpened != undefined) {
            const iframe = window.document.getElementById("byk-widget-iframe");
            const checkWidth =  isOpened ? "430" : "270";
            const checkHeight = isOpened ? "480" : "120";
            iframe.width = isFullScreen ? window.innerWidth : checkWidth;
            iframe.height = isFullScreen ? window.innerHeight : checkHeight;
          }
        },
        false
      );
    </script>
  </body>
```

## Configurable variables

- `RUUTER_API_URL`: Location of newer back end for fetching data
- `NOTIFICATION_NODE_URL`: Location of the notification node server, used by the notifications SDK and termination queue calls
- `NOTIFICATIONS_VAPID_PUBLIC_KEY`: Required base64url-encoded public VAPID key matching the notification server
- `ENVIRONMENT`: `'development'` or `'production'`
- `TIM_AUTHENTICATION_URL`: Link to authenticate user
- `ORGANIZATION_NAME`: Name of the organization using the widget
- `TERMS_AND_CONDITIONS_LINK`: Link opened when the user clicks the terms and conditions button
- `OFFICE_HOURS`: If this variable is added, widget will be hidden when not in defined work hours. If this variable is not added, the widget will always be displayed
  - `ENABLED`: Whether office hours restrictions are enforced
  - `TIMEZONE`: Used for comparing the following variables against a specific timezone.
  - `BEGIN`: Beginning of office hours. If current time is before this hour (24H), the widget will not be displayed
  - `END`: End of office hours. If current time is after this hour (24H), the widget will not be displayed
  - `DAYS`: List of days in numbers, where 1=monday, 2=tuesday, 3=wednesday... If current day is in the list of days, the widget will be displayed according to
    BEGIN and END times.
- `ENABLE_HIDDEN_FEATURES`: set it to `'TRUE'` will show experimental features, `'FALSE'` will hide them
- `FEEDBACK_RATING_COLORS_ENABLED`: set it to `'TRUE'` to show colors on the NPS/feedback rating widget, `'FALSE'` to hide them
- `ENABLE_MULTI_DOMAIN`: set it to `'TRUE'` to append the current page's domain to multi-domain related requests, `'FALSE'` to disable
- `TERMINATION_TIMEOUT`: Timeout (in seconds) sent to the notification node when queuing a chat for termination
- `WIDGET_HEIGHT`: Default height (in pixels) of the chat window
- `WIDGET_WIDTH`: Default width (in pixels) of the chat window
- `STREAM_TYPING_SPEED`: Delay (in milliseconds) between characters when streaming LLM responses - lower is faster
- `IFRAME_TARGET_OIRGIN`: Target origin used when posting messages to the parent window (e.g. widget open/full-screen state)
- `SMAX_INTEGRATION`: { enabled: true; } -- For SMAX integration. Default is false.
- `FALLBACK_LANGUAGE`: Language used when a translation is missing for the current locale. Default is `'et'`.

## Licence

See licence [here](LICENCE.md).
