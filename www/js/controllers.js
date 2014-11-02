angular.module('starter.controllers', [])

.controller('RegistrationCtrl', function($scope, AuthFactory, SessionFactory, $state) {
  $scope.signupForm = {};
  console.log("hi");
  console.log($scope.signupForm);
  $scope.register = register;



  ///////////

  function register(){
    console.log('submit')
    console.log($scope.signupForm)

    if ($scope.signup_form.$valid){
      AuthFactory.register($scope.signupForm)
        .then(function(res){
          console.log('got response', res);

          if(res.data.error){
            $scope.serverError = res.data.error;

          } else {
            console.log('Yay successfully registered ', res)
            $scope.signupForm.guid = res.data.guid;
            SessionFactory.createSession($scope.signupForm);
            $state.go('tab.account')
          }

        }, function(){

          console.log('Did not work :/')
        })

    } else {
      $scope.signup_form.submitted = true;
      console.log('form invalid');
    }
  }

})


.controller('DashCtrl', function($scope, SessionFactory) {
    $scope.currentUser = SessionFactory.checkSession() ? SessionFactory.getSession() : null;


  })


.controller('PayCtrl', function($scope, ContactsService, TransactionService, $state, SignedIn, SessionFactory) {

    if(!SignedIn){
      $state.go('dash')
    } else {
      console.log('payctrl loads')
      $scope.transaction = {
        contact: {
          displayName: '',
        },
        amount: 0.0,
        transactionNotes: ''
      };

      var currentUser = SessionFactory.getSession();

      $scope.pickContact = pickContact;
      $scope.requestCoin = requestCoin;
      $scope.sendCoin = sendCoin;

      /////

      function pickContact(){
        ContactsService.pickContact().then(
          function(contact) {
            $scope.transaction.contact = contact;
            console.log("Selected contacts=");
            console.log($scope.selectedContact);

          },
          function(failure) {
            console.log("Bummer.  Failed to pick a contact");
          }
        );

      }

      function requestCoin(){
        TransactionService.requestCoin($scope.transaction)
          .then(function(){
            console.log('request transaction got sent to the server!')

          }, function(){
            console.log('ugh cannot reach server for requestCoin!')

          });
      }

      function sendCoin(){

        var to_phone = $scope.transaction.contact.phone;

        var trans = {
          from_phone: currentUser.phone,
          to_phone: to_phone,
          amount: $scope.transaction.amount
        }
        TransactionService.sendCoin(trans)
          .then(function(res){
            console.log('send transaction got sent to the server! ', res.data)

            if(res.data && res.data.error){
              $scope.serverError = res.data.error;
            } else {

              $scope.serverSuccess = "Your transaction went through!";
              console.log('transaction went through! ', res);
            }


          }, function(){
            console.log('ugh cannot reach server for sendCoin!')

          });
      }


    }

})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})



.controller('AccountCtrl', function($scope, SessionFactory, $state) {

    $scope.user = SessionFactory.checkSession() ? SessionFactory.getSession() : null;

    $scope.user.balance = 0.0653;

    $scope.signOut = signOut;

    console.log($scope.user);

    ////////

    function signOut(){
      SessionFactory.deleteSession();
      $state.go('dash');

    }
  })

.controller('HistoryCtrl', function($scope, $state) {
    $scope.goBack = goBack;

    function goBack(){
      $state.go('tab.pay');

    }


});
