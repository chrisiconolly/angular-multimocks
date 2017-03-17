/* global describe, beforeEach, jasmine, module, inject, it, expect */

describe('multimocks.responseDelay', function () {
  var responseDelay,
    httpProvider,
    $q,
    $timeout,
    scenarioMocks,
    mockedPromise;

  beforeEach(function () {
    mockedPromise = {
      promise: 'mypromise',
      resolve: jasmine.createSpy()
    };
    module('multimocks.responseDelay', function ($provide, $httpProvider) {
      httpProvider = $httpProvider;

      $provide.value('httpProvider', {
        interceptors: []
      });
      $provide.value('scenarioMocks', {
        getDelayForResponse: jasmine.createSpy()
      });
      $provide.value('$q', {
        defer: jasmine.createSpy().and.returnValue(mockedPromise)
      });
      $provide.value('$timeout', jasmine.createSpy());
    });

    inject(function (_responseDelay_, _$q_, _$timeout_, _scenarioMocks_) {
      responseDelay = _responseDelay_;
      $q = _$q_;
      $timeout = _$timeout_;
      scenarioMocks = _scenarioMocks_;
    });
  });

  describe('config', function () {
    it('should add delayResponses to the $httpProvider interceptors',
      function () {
        // Assert
        expect(httpProvider.interceptors).toEqual(['delayResponses']);
      });
  });

  describe('delayMockResponse', function () {
    describe('delay', function () {
      it('should return a promise',
        function () {
          // Arrange
          scenarioMocks.getDelayForResponse.and.returnValue();

          // Act
          var result = delayMockResponse.delay();

          // Assert
          expect(result).toBe('mypromise');
        });

      it('should set $timeout with the expected arguments',
        function () {
          // Arrange
          scenarioMocks.getDelayForResponse.and.returnValue(123);

          // Act
          delayMockResponse.delay();

          // Assert
          expect($timeout).toHaveBeenCalledWith(jasmine.any(Function), 123);
        });

      it('should call $timeout with a function that resolves promise',
        function () {
          // Arrange
          scenarioMocks.getDelayForResponse.and.returnValue();

          // Act
          delayMockResponse.delay('foo');
          /*
           * Because we are passing an anonymous function to $timeout we can't
           * assert that mockFn is being passed to $timeout.
           * By calling the most recent function we can assert that
           * the correct function was called.
           */
          $timeout.calls.mostRecent().args[0]();

          // Assert
          expect(mockedPromise.resolve).toHaveBeenCalledWith('foo');
        });
    });
  });
});
