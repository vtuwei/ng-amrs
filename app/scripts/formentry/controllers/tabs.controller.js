/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('tabCtrl', tabCtrl);

    tabCtrl.$inject = ['SearchDataService','$translate', 'dialogs', '$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'OpenmrsRestService', '$timeout', 'FormsMetaData'];

    function tabCtrl(SearchDataService,$translate, dialogs, $location, $rootScope, $stateParams, $state, $scope, FormentryService, OpenmrsRestService, $timeout, FormsMetaData) {
        $scope.vm = {};
        $scope.vm.model = {};
        $scope.vm.patient = $rootScope.broadcastPatient;
        $scope.vm.submitLabel = 'Save'
        var formSchema;
        $scope.vm.formlyFields;
        $scope.vm.tabs=[
          {
        title: 'Tab 1',
        active: true,
        form: {
          options: {},
          model: $scope.vm.model,
          fields: [
            {
              key: 'email',
              type: 'input',
              templateOptions: {
                label: 'Username',
                type: 'email',
                placeholder: 'Email address'
              },
              expressionProperties: {
               'templateOptions.required': 'true'
              },
            },
            {
              key: 'enc',
              type: 'ui-select-extended',
              defaultValue:'',
              data: {encounter:'enc_'},
              templateOptions: {
                type: 'text',
                label: 'encounter test',
                valueProp: 'uuId',
                labelProp:'display',
                deferredFilterFunction: SearchDataService.findLocation,
                getSelectedObjectFunction: SearchDataService.getLocationByUuid,
                required:true,
                options:[]
              }
            },
            {
              key: 'text5',
              type: 'input',
              ngModelAttrs: {
                customExpression: {
                  expression: 'custom-expression'
                }
              },
              templateOptions: {
                label: 'Custom expression',
                customExpression: function(value, options, scope, $event) {
                  alert('Custom expression!');
                  console.log(arguments);
                  console.log(scope.model);
                }
              }
            },
            {
              key: 'marvel1',
              type: 'select',
              data:{concept:'a899e444-1350-11df-a1f1-0026b9348838'},
              ngModelAttrs: {
                customExpression: {
                  expression: 'custom-expression'
                }
              },
              templateOptions: {
                required:true,
                label: 'Normal Select',
                options: [
                  {name: 'Iron Man', value: 'iron_man'},
                  {name: 'Captain America', value: 'captain_america'},
                  {name: 'Black Widow', value: 'black_widow'},
                  {name: 'Hulk', value: 'hulk'},
                  {name: 'Captain Marvel', value: 'captain_marvel'}
                ],
                customExpression: function(value, options, scope, $event) {
                  alert('Custom expression!');
                  console.log(arguments);
                  console.log(scope.model);
                }
              }
            }
          ]
        }
      },
      {
        title: 'Tab 2',
        form: {
          options: {},
          model: $scope.vm.model,
          fields: [
            {
              key: 'email2',
              type: 'input',
              templateOptions: {
                label: 'Username2',
                type: 'text',
                placeholder: 'Email address'
              },
              validators:{
                test:{
                  expression: function(viewValue, modelValue)
                  {
                    var x = viewValue || modelValue;
                    return x === ''
                  },
                  message: '$viewValue + "is not be blank"'
                }
              }
            },
            {
              key: 'num',
              type: 'input',
              templateOptions: {
                label: 'Testing',
                type: 'number',
                min:100,
                max:200,
                placeholder: 'Email address'
              }
            },
            {
              key: 'text51',
              type: 'input',
              ngModelAttrs: {
                customExpression: {
                  expression: 'custom-expression'
                }
              },
              templateOptions: {
                label: 'Custom expression2',
                customExpression: function(value, options, scope, $event) {
                  alert('Custom expression!');
                  console.log(arguments);
                  console.log(scope.model);
                }
              }
            },
            {
        key: 'address',
        type: 'nested',
        templateOptions: {
          label: 'Address'
        },
        data: {
          fields: [
            {
              key: 'town',
              type: 'input',
              templateOptions: {
                required: true,
                type: 'text',
                label: 'Town'
              }
            },
            {
              key: 'country',
              type: 'input',
              templateOptions: {
                required: true,
                type: 'text',
                label: 'Country'
              }
            }
          ]
        }
      }
          ]
        }
      }
        ];
        $timeout(function () {
         FormentryService.getFormSchema('form1', function(schema){
          formSchema = schema;
          console.log('New Form Schema');
          console.log(formSchema);

          FormentryService.createForm(formSchema, function(formlySchema){
            // $scope.vm.formlyFields = formlySchema;
            // $scope.vm.tabs = $scope.vm.formlyFields;
            //
            // angular.forEach($scope.vm.tabs, function(tab){
            //   console.log('Tab Structure');
            //   console.log(tab);
            //   tab.form['model']=$scope.vm.model;
            // });
            ///FormentryService.getEncounter('encData', formlySchema)
            // var params = {uuid:'cf3f041c-9c37-44c5-983a-d02507ffe279'};
            // OpenmrsRestService.getEncounterResService().getEncounterByUuid(params,
            //   function(data){
            //   var encData = data;
            //   console.log('Rest Feeback')
            //   console.log(encData);
            //   if (data)
            //   {
            //     $scope.vm.submitLabel = 'Update'
            //       FormentryService.getEncounter(encData,formlySchema);
            //   }
            //
            //  });
          });
         });

       },1000);

          $scope.vm.originalTabs = angular.copy($scope.vm.form);

          // function definition
          $scope.vm.onSubmit = function() {
            console.log($scope.vm.tabs)
            if($scope.vm.form.$valid)
            {
              console.log('testing submit button');
              var payLoad = FormentryService.generateFormPayLoad($scope.vm.model);

              console.log(JSON.stringify(payLoad));
              var form ={name:'test', encounterType:'8d5b2be0-c2cc-11de-8d13-0010c6dffd0f'};
              var updatedPayLoad = FormentryService.updateFormPayLoad($scope.vm.model,$scope.vm.tabs, $scope.vm.patient,form);
              console.log('Updated payLoad');
              console.log(JSON.stringify(updatedPayLoad));
              // OpenmrsRestService.getEncounterResService().saveEncounter(JSON.stringify(updatedPayLoad), function(data){
              //   if (data)
              //   {
              //     $scope.vm.success = 'Form Submitted successfully'
              //     var dlg=dialogs.notify('Success', $scope.vm.success);
              //     //$location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
              //   }
              // });
              if($scope.vm.submitLabel === 'Update')
              {
                var obsToVoid = _.where(updatedPayLoad.obs,{voided:true});
                console.log('Obs to Void: ', obsToVoid);
                if(obsToVoid !== undefined)
                {
                  _.each(obsToVoid, function(obs){
                    OpenmrsRestService.getObsResService().voidObs(obs, function(data){
                      if (data)
                      {
                        console.log('Voided Obs uuid: ', obs.uuid);
                      }
                    });
                  })
                }
              }
            }
          }


          $scope.vm.cancel = function()
          {
            console.log($state);
            var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
  					dlg.result.then(function(btn){
  						$location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
  					},function(btn){
  						//$scope.vm.confirmed = 'You confirmed "No."';
  					});

          }
    }
})();
