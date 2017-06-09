//things to pass in to this directive:
//the input to watch
//the property in the model to change
//some type of function on the controller that says whether the string is valid

(function ()
{
    "use strict";

    angular.module(APPNAME)
        .directive("slugConvert", SlugConvert);

    function SlugConvert($parse)
    {
        return {
            restrict: 'EA' // only activate on element attribute
            , require: '?ngModel' // get a hold of NgModelController
            , link: function (scope, elem, attrs, ngModel)
            {
                let editMode;

                if (!ngModel)
                    return; // do nothing if no ng-model

                // watch model property passed in via **watch-model attr**
                scope.$watch(attrs.watchModel, function (val)
                {
                    if (val)
                    {
                        convertToSlug(val);
                    }
                });

                // observe target input and send promise to controller
                scope.$watch(attrs.ngModel, function (val)
                {
                    if (val && val.length > 6)
                    {
                        getSlugPromise(val);
                    }
                });

                //check for model id via **edit-mode-id attr**
                if (parseInt(attrs.editModeId) > 0)
                {
                    editMode = true;
                }


                function convertToSlug(val)
                {
                    let inputVal = val;
                    let slug;

                    if (inputVal && !editMode)
                    {
                        slug = inputVal.toLowerCase().replace(/ /g, '-').replace(/[^\w-\/]+/g, '');
                    }
                    else if (!inputVal)
                    {
                        slug = "";
                    }
                    //console.log(inputVal);

                    if (slug)
                    {
                        setModelValue(slug);
                    }
                };

                function setModelValue(slug)
                {
                    ngModel.$setViewValue(slug);
                    ngModel.$render();
                }

                function getSlugPromise(slug)
                {
                    let ctrlCallback = $parse(attrs.getSlugPromise);

                    //figure out what gets passed to you
                    ctrlCallback(scope, { newSlug: slug })
                        .done(function (data)
                        {
                            //check for ID in here
                            //console.log(data.item);

                            let id = data.item;
                            let isValid;

                            if (id)
                            {
                                isValid = false;
                            }
                            else
                            {
                                isValid = true;
                            }

                            if (!editMode)
                            {
                                scope.$apply(function ()
                                {
                                    ngModel.$setValidity('slugConvert', isValid);
                                });
                            }
                            //ngModel.$render();
                        })
                        .fail(function (jqXHR, status)
                        {
                            console.log(status);
                            console.log(jqXHR.responseText);
                        });
                    //console.log(test);
                }
            }
        }
    }
})();