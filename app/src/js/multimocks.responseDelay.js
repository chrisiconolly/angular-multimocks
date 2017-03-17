/* global angular */

angular
  .module('multimocks.responseDelay', [])

  .factory('delayMockResponse', [
    '$q',
    '$timeout',
    'scenarioMocks',
    function ($q, $timeout, scenarioMocks) {
      return {
        delay: function (response) {
          var delayedResponse = $q.defer();

          $timeout(function () {
            delayedResponse.resolve(response);
          }, scenarioMocks.getDelayForResponse(response));

          return delayedResponse.promise;
        }
      }
    }
  ])

  .factory('delayResponses', ['delayMockResponse', function (responseDelayer) {
    return {
      response: delayMockResponse.delay,
      responseError: delayMockResponse.delay
    };
  }])

  .config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('delayResponses');
    }
  ]);
