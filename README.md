# vue-intercom

A reactive wrapper for [Intercom's](https://www.intercom.com/) [JavaScript API](https://developers.intercom.com/docs/intercom-javascript)

## Installation

```bash
npm install --save vue-intercom
```

```javascript
import Vue from 'vue';
import VueIntercom from 'vue-intercom';

Vue.use(VueIntercom, { appId: 'your-app-id' });
```

## Usage

`vue-intercom` handles the injection of Intercom's script into your html and wraps calls to the Intercom API with methods and exposes them through the `$intercom` object in your components.

```javascript
new Vue({
  el: '#app',
  data() {
    return {
      userId: 1,
      name: 'Foo Bar',
      email: 'foo@bar.com',
    };
  },
  mounted() {
    this.$intercom.boot({
      user_id: this.userId,
      name: this.name,
      email: this.email,
    });
    this.$intercom.show();
  },
  watch: {
    email(email) {
      this.$intercom.update({ email });
    },
  }
});
```

## Example App

```
cd example
yarn
yarn dev
```

## API

### Values

#### `$intercom.ready`

Set to `true` once the Intercom script has been loaded.

#### `$intercom.visible`

Set via the `onShow`/`onHide` events.

#### `$intercom.unreadCount`

Set via the `onUnreadCountChange` event.

### Methods

#### `$intercom.boot(/* optional */options)`

Calls `Intercom('boot')`. Automatically sets the `app_id` unless specified in the options object.

#### `$intercom.shutdown()`

Calls `Intercom('shutdown')`.

#### `$intercom.update(/* optional */options)`

Calls `Intercom('update')`. If the options object is set, calls `Intercom('update', options)`

#### `$intercom.show()`

Calls `Intercom('show')`.

#### `$intercom.hide()`

Calls `Intercom('hide')`.

#### `$intercom.showMessages()`

Calls `Intercom('showMessages')`.

#### `$intercom.showNewMessage(/* optional */content)`

Calls `Intercom('showNewMessage')` with pre-populated content if provided.

#### `$intercom.trackEvent(name, /* optional */metadata)`

Calls `Intercom('trackEvent')` with extra metadata if provided.

#### `$intercom.getVisitorId()`

Calls `Intercom('getVisitorId')`.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Continuon
