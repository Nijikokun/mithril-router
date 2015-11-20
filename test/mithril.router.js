/* globals beforeEach, describe, it */

var assert = require('assert')
var classicRoutesFixture
var documentFixture
var routesFixture
var argsFixture
var m = require('../mithril.router.js')(require('mithril'))

function mockRoute (m, method) {
  var routes = m._route ? m._route.routes : {}
  var modes = m._route ? m._route.modes : {}
  var mode = m._route ? m._route.mode : undefined

  m._route = method
  m._route.routes = routes
  m._route.modes = modes
  m._route.mode = mode
}

beforeEach(function () {
  documentFixture = {
    ATTRIBUTE_NODE: 2
  }

  routesFixture = {
    '/': { controller: 'home', namespace: 'index' },
    '/login': { controller: 'login', namespace: 'login' },
    '/dashboard': { controller: 'dashboard', namespace: 'dashboard' },
    '/users': { controller: 'users', namespace: 'users' },
    '/users/:id': { controller: 'user', namespace: 'user' },
    '/users/search?sort=default': {controller: 'search', namespace: 'user.search'}
  }

  classicRoutesFixture = {
    '/': 'home',
    '/login': 'login',
    '/dashboard': 'dashboard',
    '/users': 'users',
    '/users/:id': 'user',
    '/users/search?sort=default': 'search'
  }

  argsFixture = {
    id: 23
  }
})

describe('Router', function () {
  it('should only patch mithril once', function () {
    var mock = require('../mithril.router.js')({
      _route: true
    })

    assert(mock._route === true)
    assert(typeof mock.reverse === 'undefined')
    assert(typeof mock.redirect === 'undefined')
  })
})

describe('m._route', function () {
  it('should be a function', function () {
    assert(typeof m._route === 'function')
  })

  describe('.routes', function () {
    it('should be an object', function () {
      assert(typeof m._route.routes === 'object')
    })
  })

  describe('.modes', function () {
    it('should be an object', function () {
      assert(typeof m._route.modes === 'object')
    })
  })

  describe('.mode', function () {
    it('should be a string', function () {
      assert(typeof m._route.mode === 'string')
    })
  })
})

describe('m.route', function () {
  describe('(rootElement, rootRoute, routes)', function () {
    it('should return the rootElement', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert.deepEqual(rootElement, documentFixture)
        done()
      })

      // Configure
      m.route(documentFixture, 'index', routesFixture)
    })

    it('should find rootRoute by namespace', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert(rootRoute === '/')
        done()
      })

      // Configure
      m.route(documentFixture, 'index', routesFixture)
    })

    it('should generate correct router hash', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert.deepEqual(routes, classicRoutesFixture)
        done()
      })

      // Configure
      m.route(documentFixture, 'index', routesFixture)
    })

    it('should throw error when namespace is missing', function () {
      assert.throws(function () {
        m.route(documentFixture, 'index', {
          '/': { controller: 'index' }
        })
      }, Error)
    })

    it('should throw error when controller is missing', function () {
      assert.throws(function () {
        m.route(documentFixture, 'index', {
          '/': { namespace: 'index' }
        })
      }, Error)
    })
  })

  describe('(rootElement, routes)', function () {
    it('should return the rootElement', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert.deepEqual(rootElement, documentFixture)
        done()
      })

      // Configure
      m.route(documentFixture, routesFixture)
    })

    it('should find rootRoute by namespace when using root property', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert(rootRoute === '/')
        done()
      })

      // Configure
      routesFixture['/'].root = true
      m.route(documentFixture, routesFixture)
    })

    it('should fallback to first property for rootRoute when no rootRoute is defined', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert(rootRoute === '/')
        done()
      })

      // Configure
      m.route(documentFixture, routesFixture)
    })

    it('should generate correct router hash', function (done) {
      // Overwrite
      mockRoute(m, function (rootElement, rootRoute, routes) {
        assert.deepEqual(routes, classicRoutesFixture)
        done()
      })

      // Configure
      m.route(documentFixture, routesFixture)
    })
  })

  describe('(namespace|route(, args))', function () {
    it('should return the correct path when redirecting by namespace', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args) {
        assert(route === '/')
        done()
      })

      // Configure
      m.route('index')
    })

    it('should return the arguments unchanged', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args) {
        assert.deepEqual(args, argsFixture)
        done()
      })

      // Configure
      m.route('index', argsFixture)
    })

    it('should support replaceHistory flag instead of arguments', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, replaceHistory) {
        assert(route === '/')
        assert(replaceHistory === true)
        done()
      })

      // Configure
      m.route('index', true)
    })

    it('should support both replaceHistory and arguments', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args, replaceHistory) {
        assert(route === '/')
        assert.deepEqual(args, argsFixture)
        assert(replaceHistory === true)
        done()
      })

      // Configure
      m.route('index', argsFixture, true)
    })

    it('should support both replaceHistory and no arguments', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args, replaceHistory) {
        assert(route === '/')
        assert(args === undefined)
        assert(replaceHistory === true)
        done()
      })

      // Configure
      m.route('index', undefined, true)
    })

    it('should return route when namespace is not used', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args) {
        assert(route === '/')
        done()
      })

      // Configure
      m.route('/')
    })

    it('should return arguments unchanged when namespace is not used', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args) {
        assert.deepEqual(args, argsFixture)
        done()
      })

      // Configure
      m.route('/', argsFixture)
    })

    it('should support both replaceHistory and arguments without namespace', function (done) {
      // Overwrite
      mockRoute(m, function () {})

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function (route, args, replaceHistory) {
        assert(route === '/')
        assert(args === undefined)
        assert(replaceHistory === true)
        done()
      })

      // Configure
      m.route('/', undefined, true)
    })
  })

  describe('(element(, boolean))', function () {
    it('should invoke element event attachment when element is passed', function () {
      var element = {
        addEventListener: true,
        attachEvent: true
      }

      // Overwrite
      mockRoute(m, function (el) {
        assert.deepEqual(el, element)
      })

      // Configure
      m.route(element)
    })

    it('should invoke element event when element and boolean is passed', function () {
      var element = {
        addEventListener: true,
        attachEvent: true
      }

      // Overwrite
      mockRoute(m, function (el) {
        assert.deepEqual(el, element)
      })

      // Configure
      m.route(element, true)
    })
  })

  describe('()', function () {
    it('should return the correct currentPath', function () {
      var currentPath

      // Overwrite
      mockRoute(m, function () {
        currentPath = '/'
      })

      // Configure
      m.route(documentFixture, routesFixture)

      // Overwrite
      mockRoute(m, function () {
        return currentPath
      })

      // Configure
      assert(m.route() === '/')
    })
  })

  it('should throw an error on unsupported signature', function () {
    assert.throws(function () {
      m.route({
        'a': 'b'
      })
    }, Error)
  })
})

describe('m.route.mode', function () {
  it('should default to: search', function () {
    assert(m.route.mode === 'search')
  })

  it('should change underlying m._route.mode', function () {
    m.route.mode = 'hash'

    assert(m._route.mode !== 'search')
    assert(m._route.mode === 'hash')
  })
})

describe('m.route.normalize', function () {
  it('should normalize route based on mode', function () {
    m.route.mode = 'search'
    assert(m.route.normalize('?test=3') === 'test=3')
  })

  it('should work with underlying m._route.mode', function () {
    m.route.mode = 'pathname'
    assert(m.route.normalize('/type?test=3') === '/type?test=3')
  })
})

describe('m.route.buildQueryString', function () {
  it('should properly build query strings', function () {
    var queryString = m.route.buildQueryString({
      foo: 'bar',
      hello: ['world', 'mars', 'pluto'],
      world: {test: 3},
      bam: '',
      yup: null,
      removed: undefined
    })

    assert(queryString === 'foo=bar&hello%5B%5D=world&hello%5B%5D=mars&hello%5B%5D=pluto&world%5Btest%5D=3&bam=&yup=null&removed=undefined')
  })
})

describe('m.route.parseQueryString', function () {
  it('should properly parse query strings', function () {
    var parsedQueryString = m.route.parseQueryString('foo=bar&hello%5B%5D=world&hello%5B%5D=mars&hello%5B%5D=pluto&bam=&yup=null&removed=undefined')
    assert.deepEqual(parsedQueryString, {
      'foo': 'bar', 'hello[]': 'pluto', 'bam': '', 'yup': 'null', 'removed': 'undefined'
    })
  })
})

describe('m.route.param', function () {
  it('should throw an error when no routing is defined', function () {
    m.routes = {}

    assert.throws(function () {
      m.route.param('testing')
    }, Error)
  })

  it('should appropriately call underlying method', function (done) {
    m.routes = {
      '/': 'index'
    }

    m._route.param = function () {
      assert(arguments[0] === 'key')
      done()
    }

    m.route.param('key')
  })
})

describe('m.redirect', function () {
  it('should return the correct path when redirecting by namespace', function (done) {
    // Overwrite
    mockRoute(m, function () {})

    // Configure
    m.route(documentFixture, routesFixture)

    // Overwrite
    mockRoute(m, function (route, args) {
      assert(route === '/')
      done()
    })

    // Configure
    m.redirect('index')
  })

  it('should return the arguments unchanged', function (done) {
    // Overwrite
    mockRoute(m, function () {})

    // Configure
    m.route(documentFixture, routesFixture)

    // Overwrite
    mockRoute(m, function (route, args) {
      assert.deepEqual(args, argsFixture)
      done()
    })

    // Configure
    m.redirect('index', argsFixture)
  })
})

describe('m.reverse', function () {
  it('should properly handle no arguments', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    assert(m.reverse('index') === '/')
  })

  it('should handle replacing named arguments', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    assert(m.reverse('user', { params: argsFixture }) === '/users/23')
  })

  it('should handle optional parameters', function () {
    mockRoute(m, function () {})

    m.route(documentFixture, {
      '/:key?': {controller: 'index', namespace: 'test'}
    })

    assert(m.reverse('test') === '/')
  })

  it('should handle escaped characters', function () {
    mockRoute(m, function () {})

    m.route(documentFixture, {
      '/:href\\/:key/(.+)?': {controller: 'index', namespace: 'test'}
    })

    var reversedRoute = m.reverse('test', {
      params: {
        href: 'test',
        key: 'world'
      }
    })

    assert(reversedRoute === '/test\\/world/')
  })

  it('should error on missing arguments', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    assert.throws(function () {
      m.reverse('user', { query: { include: 'profile' } })
    }, Error)
  })

  it('should handle basic query strings', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    assert(m.reverse('user', { params: argsFixture, query: { include: 'profile' } }) === '/users/23?include=profile')
  })

  it('should handle appending query strings', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    assert(m.reverse('user.search', { query: { q: 'nijikokun' } }) === '/users/search?sort=default&q=nijikokun')
  })

  it("should throw error when namespace doesn't exist", function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)

    assert.throws(function () {
      m.reverse('current-user')
    }, Error)
  })

  it('should prepend route mode prefixes when prefix option is a boolean', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    m.route.mode = 'hash'
    assert(m.reverse('user', { params: argsFixture, query: { include: 'profile' }, prefix: true }) === '#/users/23?include=profile')
  })

  it('should fallback to an empty string when prefix mode cannot be found', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    m.route.mode = 'testing'
    assert(m.reverse('user', { params: argsFixture, query: { include: 'profile' }, prefix: true }) === '/users/23?include=profile')
  })

  it('should prepend custom prefix when prefix is a string', function () {
    mockRoute(m, function () {})
    m.route(documentFixture, routesFixture)
    assert(m.reverse('user', { params: argsFixture, query: { include: 'profile' }, prefix: '/api' }) === '/api/users/23?include=profile')
  })
})
