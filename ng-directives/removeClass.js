(function ()
{
    "use strict";

    angular.module(APPNAME)
        .directive("removeClass", RemoveClass);

    function RemoveClass($window, $parse)
    {
        return {
            restrict: "A"
            , link: function (scope, element, attrs)
            {
                //callback to return value to check
                let ctrlCallback = $parse(attrs.getValueToCheck);

                let valueToCheck = ctrlCallback(scope)

                if (!valueToCheck)
                {
                    element.removeClass(attrs.removeClass);
                }
            }
        }
    }
})();