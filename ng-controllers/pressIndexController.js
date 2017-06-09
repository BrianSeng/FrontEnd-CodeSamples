//======================================
//******* ngPressIndexController *******
//======================================

(function ()
{
    "use strict";

    angular.module(APPNAME)
        .controller("pressController", PressController)
        .filter('orderObjectBy', _displayOrder);

    PressController.$inject = [
        "$scope"
        , "$location"
        , '$baseController'
        , "pressService"
        , "sweetAlert"
        , "pagerService"
        , "$anchorScroll"];

    //=====** Custom Filter F(x) **=====
    function _displayOrder()
    {
        return function (input, attribute)
        {
            if (!angular.isObject(input)) return input;

            var array = [];
            for (var objectKey in input)
            {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b)
            {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
        }
    }

    function PressController(
        $scope
        , $location
        , $baseController
        , pressService
        , sweetAlert
        , pagerService
        , $anchorScroll)
    {
        var vm = this;

        //======** Assign Dependencies/Services **======
        vm.pressService = pressService;
        vm.pagerService = pagerService;
        vm.sweetAlert = sweetAlert;
        vm.$scope = $scope;
        //vm.$window = $window;
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        //replaces vm.$scope.$apply()
        vm.notify = vm.pressService.getNotifier($scope);

        //======** ViewModel **======
        vm.items = [];
        vm.pagedItems = [];
        vm.itemIndex = -1;
        vm.pager =
        {
            totalItems: null
            , currentPage: null
            , pageSize: null
            , totalPages: null
            , startPage: null
            , endPage: null
            , startIndex: null
            , endIndex: null
            , pages: null
        };
        vm.activePage = null;
        vm.currentEndIndex = null;
        //===** F(x) SETUP **===
        vm.setPage = _setPage;
        vm.createRedirect = _createRedirect;
        vm.editRedirect = _editRedirect;
        vm.delete = _delete;
        vm.scrollTop = _scrollTop;

        //======** THE FOLD **======

        _render();

        //**STARTUP**
        function _render()
        {
            if (vm.pager.startIndex == null && vm.pager.pageSize == null)
            {
                //fresh load, initializes page to 1
                vm.pager.startIndex = 1;
                vm.pager.pageSize = 30;
                vm.pager.totalPages = 3;
                var offset = vm.pager.startIndex - 1;
                vm.pressService.getByPagination(offset, vm.pager.pageSize, _populateArr, _onError)
            }
            //legacy for get all, before pagination
            //vm.pressService.getAll(_populateArr, _onError);
        }
        function _initPager(vm)
        {
            if (vm.pager.startIndex == 1)
            {
                // initialize to page 1
                vm.setPage(1);
            }
        }

        //**CALLBACKS & CLICK HANDLERS**
        function _setPage(page)
        {
            if (page < 1 || page > vm.pager.totalPages)
            {
                return;
            }

            if (page == 1)
            {
                _getPagerObj(vm.items.length, page);
            }
            else
            {
                if (page >= vm.pager.totalPages)
                {
                    vm.activePage = page;
                    vm.pressService.getByPagination(vm.currentEndIndex, vm.pager.pageSize, _populateArr, _onError);
                }
                else
                {
                    if (vm.items.length > vm.currentEndIndex)
                    {
                        vm.currentEndIndex = vm.items.length;
                    }

                    _getPagerObj(vm.items.length, page);
                }
            }
        }
        function _populateArr(data)
        {
            vm.notify(function ()
            {
                vm.items = vm.items.concat(data.item.pagedItems);
                if (vm.items.length > vm.currentEndIndex)
                {
                    vm.currentEndIndex = vm.items.length;
                    if (vm.pager.startIndex == 1)
                    {
                        _initPager(vm);
                    }
                    else
                    {
                        _getPagerObj(vm.items.length, vm.activePage);
                    }
                }
            })

        }
        function _getPagerObj(pgTotal, currentPg)
        {
            // get pager object from service
            vm.pager = vm.pagerService.GetPager(pgTotal, currentPg);

            // get current page of items
            vm.pagedItems = vm.items.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        }
        function _onError(jqXHR)
        {
            vm.$alertService.error(jqXHR.responseText, "FAAAAIL!");
        }
        function _createRedirect()
        {
            window.location.href = "/press/create";
        }
        function _editRedirect(item)
        {
            window.location.href = "/press/edit/" + item.id;
        }
        function _delete(item)
        {
            if (item && item.id)
            {
                vm.itemIndex = vm.items.indexOf(item);
                var ajaxCall = function ()
                {
                    vm.pressService.delete(item.id, _removeNode, _onError);
                }
                vm.sweetAlert.promptDelete("default", ajaxCall);
            }
        }
        function _removeNode(data)
        {
            //***ONLY SEEMS TO WORK W/ $scope.$apply
            vm.$scope.$apply(function ()
            {
                vm.pagedItems.splice(vm.itemIndex, 1);
                _reset();
                vm.sweetAlert.promptDelete("success");
            })

        }
        function _scrollTop()
        {
            // set the location.hash to the id of
            // the element to scroll to
            $location.hash('cardTop');

            // call $anchorScroll()
            $anchorScroll();
        }
        function _reset()
        {
            vm.itemIndex = -1;
        }
    }
})();