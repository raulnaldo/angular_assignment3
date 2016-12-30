(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems', FoundItemsDirective);

//DIRECTIVE
function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      list: '<myList'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'myCtroler',
    bindToController: true
  };
  return ddo;
}

//DIRECTIVE CONTROLLER
function FoundItemsDirectiveController() {
  var myCtroler = this;
  myCtroler.someThingFound= function () {
    if (!myCtroler.list.triedToSearch){
      return false;
    }
    if (myCtroler.list.foundItems==null){
        return true;
    }
    else{
      return (myCtroler.list.foundItems.length == 0);
    }
  };
}

//CONTROLLER
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var NarrowItDown = this;
  NarrowItDown.triedToSearch=false;
  NarrowItDown.buttonSearchText='Narrow It Down For Meeee!'

  //BUSQUEDA DE MENUS
  NarrowItDown.getMatchedMenuItems = function(searchTerm){    
    if ((searchTerm==null) || (searchTerm=='')) {
      searchTerm='';
      NarrowItDown.foundItems=null;
    }
    else{
      NarrowItDown.foundItems= MenuSearchService.getMatchedMenuItems(searchTerm);
    }
    NarrowItDown.triedToSearch=true;
  };

  //ELIMINACION DE MENUS
  NarrowItDown.removeItem = function(itemIndex){
    MenuSearchService.removeItem(itemIndex);
  };
}


//SERVICIO
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http,ApiBasePath) {
  var service = this;
  var foundItems=[];

  //get rest api webservice data
  service.getMatchedMenuItems = function (searchTerm) {
    foundItems=[];
    var response = $http({
      method: "GET",
      url: (ApiBasePath)
    })
    .then(function(response){
      //console.log(response.data.menu_items.length);
      console.log('searchTerm:' + searchTerm);
      if (searchTerm==null){
        foundItems=response.data;
      }
      else{
        for (var i = 0; i < response.data.menu_items.length; i++) {
          if(
              (response.data.menu_items[i].description.indexOf(searchTerm) !== -1)
              &&
              (response.data.menu_items[i].description !='')
            )
            {
              foundItems.push(response.data.menu_items[i]);
          }
        }
    }
  })// fin .then
    .catch(function (error) {
      console.log(error);
    });// fin .catch

    return foundItems;
  };

  //delete record from list
  service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };
}
})();
