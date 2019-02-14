/* globals window, Event */
import Vue from 'vue'

const createVm = () => {
  const vm = new Vue({
    template: '<div></div>'
  })
  vm.$mount()
  return vm
}

describe('Intercom plugin', () => {
  describe('State', () => {
    it('has default initial state', () => {
      const vm = createVm()
      assert.strictEqual(vm.$intercom.ready, false)
      assert.strictEqual(vm.$intercom.visible, false)
      assert.strictEqual(vm.$intercom.unreadCount, 0)
    })

    it('sets ready indicator on load', (done) => {
      window.Intercom = sinon.spy()
      const vm = createVm()
      window.dispatchEvent(new Event('load'))
      setTimeout(() => {
        vm.$nextTick().then(() => {
          assert.strictEqual(vm.$intercom.ready, true)
          done()
        }).catch(done)
      }, 50)
    })

    it('exposes state changes through internal vm', () => {
      const vm = createVm()
      vm.$intercom._vm.visible = true
      vm.$intercom._vm.unreadCount = 1
      assert.strictEqual(vm.$intercom.visible, true)
      assert.strictEqual(vm.$intercom.unreadCount, 1)
    })
  })

  describe('Intercom javascript functions', () => {
    describe('boot', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('is called with an app_id attribute', () => {
        const vm = createVm()
        vm.$intercom.boot()
        assert.isTrue(window.Intercom.calledOnce)
        const options = window.Intercom.args[0][1]
        assert.strictEqual(options.app_id, 'foobar')
        assert.isTrue(window.Intercom.calledWith('boot'))
      })

      it('does not override app_id if defined by user', () => {
        const vm = createVm()
        vm.$intercom.boot({ app_id: 'lorem-ipsum' })
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('boot'))
        const options = window.Intercom.args[0][1]
        assert.strictEqual(options.app_id, 'lorem-ipsum')
      })

      it('called with user-defined attributes', () => {
        const vm = createVm()
        vm.$intercom.boot({
          user_id: 123,
          name: 'Foo Bar'
        })
        assert.isTrue(window.Intercom.calledOnce)
        const options = window.Intercom.args[0][1]
        assert.strictEqual(options.user_id, 123)
        assert.strictEqual(options.name, 'Foo Bar')
      })
    })

    describe('shutdown', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('shutdown', () => {
        const vm = createVm()
        vm.$intercom.shutdown()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('shutdown'))
      })
    })

    describe('update', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called with no attributes', () => {
        const vm = createVm()
        vm.$intercom.update()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('update'))
        assert.strictEqual(window.Intercom.args[0].length, 1)
      })

      it('called with user-defined attributes', () => {
        const vm = createVm()
        vm.$intercom.update({
          name: 'Foo Bar',
          email: 'foo@bar.com'
        })
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('update'))
        const options = window.Intercom.args[0][1]
        assert.strictEqual(options.name, 'Foo Bar')
        assert.strictEqual(options.email, 'foo@bar.com')
      })
    })

    describe('show', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called', () => {
        const vm = createVm()
        vm.$intercom.show()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('show'))
      })
    })

    describe('hide', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called', () => {
        const vm = createVm()
        vm.$intercom.hide()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('hide'))
      })
    })

    describe('showMessages', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called', () => {
        const vm = createVm()
        vm.$intercom.showMessages()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('showMessages'))
      })
    })

    describe('showNewMessage', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called without pre-populated content', () => {
        const vm = createVm()
        vm.$intercom.showNewMessage()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('showNewMessage'))
        assert.strictEqual(window.Intercom.args[0].length, 1)
      })

      it('called with pre-populated content', () => {
        const vm = createVm()
        vm.$intercom.showNewMessage('Foobar:')
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('showNewMessage', 'Foobar:'))
      })

      it('called without content if content not a string', () => {
        const vm = createVm()
        vm.$intercom.showNewMessage({})
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('showNewMessage'))
        assert.strictEqual(window.Intercom.args[0].length, 1)
      })
    })

    describe('trackEvent', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called with event name', () => {
        const vm = createVm()
        vm.$intercom.trackEvent('foobar')
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('trackEvent', 'foobar'))
        assert.strictEqual(window.Intercom.args[0].length, 2)
      })

      it('called with event name and meta data', () => {
        const vm = createVm()
        vm.$intercom.trackEvent('foobar', {
          foo: 'foo',
          bar: 'bar'
        })
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('trackEvent', 'foobar'))
        const options = window.Intercom.args[0][2]
        assert.strictEqual(options.foo, 'foo')
        assert.strictEqual(options.bar, 'bar')
      })
    })

    describe('getVisitorId', () => {
      beforeEach(() => (window.Intercom = sinon.spy()))

      it('called', () => {
        const vm = createVm()
        vm.$intercom.getVisitorId()
        assert.isTrue(window.Intercom.calledOnce)
        assert.isTrue(window.Intercom.calledWith('getVisitorId'))
      })
    })
  })
})
