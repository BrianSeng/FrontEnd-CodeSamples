//  ================================= MAIN CONTROLLER => 'rcWizardController' ================================= //

//  =====================================  OVERVIEW CHARTS CONTROLLER   ============================================== //
(function ()
{
    "use strict";

    angular.module(APPNAME)
        .controller("rcOverviewController", ReferralController);

    ReferralController.$inject = [
        "$scope"
        , "$baseController"
        , "adminService"
        , "sweetAlert"];

    function ReferralController(
        $scope
        , $baseController
        , adminService
        , sweetAlert)
    {
        var vm = this;

        //======** Assign Dependencies/Services **======
        vm.adminService = adminService;
        vm.sweetAlert = sweetAlert;
        vm.$scope = $scope;
        $baseController.merge(vm, $baseController);

        //this is a wrapper for our small dependency on $scope
        //replaces vm.$scope.$apply()
        vm.notify = vm.adminService.getNotifier($scope);

        //======** ViewModel **======
        vm.dates = [];
        vm.lineData =
        {
            labels: []
            , series: []
        }
        vm.activeYear = null;
        vm.currentStartWeek = null;
        vm.currentEndWeek = null;
        vm.refKeys = ["campaign", "source", "ref"];
        vm.totalUserCount = null;

        //===** F(x) SETUP **===
        vm.pullDates = _getDates;
        vm.buildLineChart = _buildLineChart;


        //==========================================================================
        //******************************** THE FOLD ********************************
        //==========================================================================

        _render();

        function _render()
        {
            _buildPieChart();
        }

        //====** Line Chart f(x)'s **====
        function _getDates(yr)
        {
            //console.log(yr)
            vm.activeYear = yr;
            vm.adminService.getWeeks(yr, _populateMenu, _onError);
        }
        function _buildLineChart(item)
        {
            console.log(item)
            vm.currentStartWeek = item.weekNumber;
            vm.currentEndWeek = item.weekNumber + 6;

            var currentIndex = vm.dates.indexOf(item);
            var endIndex = currentIndex + 6;
            _createXAxisLabels(currentIndex, endIndex);

            vm.lineData.series = [];

            sabio.services.admin.getAllLines(vm.currentStartWeek, vm.currentEndWeek, vm.activeYear, _buildLines, _onError);
        }
        function _populateMenu(data)
        {
            vm.notify(function ()
            {
                vm.dates = data.items;
            })
        }
        function _createXAxisLabels(currentIndex, endIndex)
        {
            vm.lineData.labels = [];
            //console.log(currentIndex, vm.dates[currentIndex]);
            for (var i = currentIndex; i <= endIndex; i++)
            {
                vm.lineData.labels.push(vm.dates[i].fWeekStart + " - " + vm.dates[i].fWeekEnd);
            }
            //console.log(vm.lineData.labels);
        }
        function _buildLines(data)
        {
            console.log(data.item);

            _getYValues(data.item);

            var chart = new Chartist.Line('#lineChart', vm.lineData, _getLineConfig());


            _animateLineChart(chart);
        }

        function _animateLineChart(chart)
        {
            // sequence number aside so we can use it in the event callbacks
            var seq = 0,
              delays = 80,
              durations = 500;

            // Once the chart is fully created we reset the sequence
            chart.on('created', function ()
            {
                seq = 0;
            });

            chart.on('draw', function (data)
            {
                seq++;

                if (data.type === 'line')
                {
                    data.element.animate({
                        opacity: {
                            begin: seq * delays + 1000,
                            dur: durations,
                            from: 0,
                            to: 1
                        }
                    });
                } else if (data.type === 'label' && data.axis === 'x')
                {
                    data.element.animate({
                        y: {
                            begin: seq * delays,
                            dur: durations,
                            from: data.y + 100,
                            to: data.y,
                            easing: 'easeOutQuart'
                        }
                    });
                } else if (data.type === 'label' && data.axis === 'y')
                {
                    data.element.animate({
                        x: {
                            begin: seq * delays,
                            dur: durations,
                            from: data.x - 100,
                            to: data.x,
                            easing: 'easeOutQuart'
                        }
                    });
                } else if (data.type === 'point')
                {
                    data.element.animate({
                        x1: {
                            begin: seq * delays,
                            dur: durations,
                            from: data.x - 10,
                            to: data.x,
                            easing: 'easeOutQuart'
                        },
                        x2: {
                            begin: seq * delays,
                            dur: durations,
                            from: data.x - 10,
                            to: data.x,
                            easing: 'easeOutQuart'
                        },
                        opacity: {
                            begin: seq * delays,
                            dur: durations,
                            from: 0,
                            to: 1,
                            easing: 'easeOutQuart'
                        }
                    });
                } else if (data.type === 'grid')
                {
                    // Using data.axis we get x or y which we can use to construct our animation definition objects
                    var pos1Animation = {
                        begin: seq * delays,
                        dur: durations,
                        from: data[data.axis.units.pos + '1'] - 30,
                        to: data[data.axis.units.pos + '1'],
                        easing: 'easeOutQuart'
                    };

                    var pos2Animation = {
                        begin: seq * delays,
                        dur: durations,
                        from: data[data.axis.units.pos + '2'] - 100,
                        to: data[data.axis.units.pos + '2'],
                        easing: 'easeOutQuart'
                    };

                    var animations = {};
                    animations[data.axis.units.pos + '1'] = pos1Animation;
                    animations[data.axis.units.pos + '2'] = pos2Animation;
                    animations['opacity'] = {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'easeOutQuart'
                    };

                    data.element.animate(animations);
                }
            });

            chart.on('created', function ()
            {
                if (window.__exampleAnimateTimeout)
                {
                    clearTimeout(window.__exampleAnimateTimeout);
                    window.__exampleAnimateTimeout = null;
                }
                window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 30000);
            });
        }
        function _getLineConfig()
        {
            var lineConfig = {};

            lineConfig.showPoint = true;

            lineConfig.axisX = {
                labelOffset: {
                    x: -10
                    , y: 0
                }
                , showGrid: true
                , showLabel: true
            };

            lineConfig.series = {
                'series-1': {
                    lineSmooth: Chartist.Interpolation.step()
                }
                , 'series-2': {
                    lineSmooth: Chartist.Interpolation.simple()
                    , showArea: true
                }
                , 'series-3': {
                    lineSmooth: false
                }
            };

            lineConfig.plugins = [
                Chartist.plugins.tooltip({
                    anchorToPoint: true
                })
            ];

            return lineConfig;
        }
        function _getYValues(lineData)
        {
            for (var prop in lineData)
            {
                //console.log(lineData[prop]);
                lineData[prop].weekTotals = {};

                for (var i = 0; i < lineData[prop].length; i++)
                {
                    lineData[prop].weekTotals[lineData[prop][i].weekNumber] = (lineData[prop].weekTotals[lineData[prop][i].weekNumber] || 0) + lineData[prop][i].hitCount;
                }

                var lineVals = Object.values(lineData[prop].weekTotals);

                var newLine = _buildTooltipTitle(lineVals);

                //console.log(newLine);

                //assigns name to line series for styling purposes
                var seriesObj = _buildSeriesObj(newLine);

                vm.lineData.series.push(seriesObj)
            }

            //console.log(vm.lineData.series);
        }
        function _buildSeriesObj(newLineArr)
        {
            var seriesObj = {};
            var seriesName = "series-"
            if (vm.lineData.series.length < 1)
            {
                seriesObj.name = "series-1";
            }
            else if (vm.lineData.series.length >= 1)
            {
                seriesObj.name = seriesName + (vm.lineData.series.length + 1);
            }

            seriesObj.data = newLineArr;

            //console.log(seriesObj);

            return seriesObj;
        }
        function _buildTooltipTitle(lineVals)
        {
            var newLineArr = lineVals.map(function (elem)
            {
                var obj = {};
                obj.meta = "Week's Hit Count:";
                obj.value = elem;
                return obj;
            });
            return newLineArr;
        }


        //====** Pie Chart f(x)'s **====
        function _buildPieChart()
        {
            vm.adminService.getRcPieChartInfo(_packagePieData, _onError);
        }
        function _packagePieData(userAccountsData)
        {
            if (userAccountsData)
            {
                var pieData =
                {
                    labels: []
                    , series: []
                }

                vm.notify(function ()
                {
                    vm.totalUserCount = userAccountsData.items[0].totalUsers + userAccountsData.items[1].totalUsers;
                })

                var registered = userAccountsData.items[0].registeredUsers;
                var unregistered = userAccountsData.items[1].unregisteredUsers;
                var regPerc = _getUserPercentage(registered);
                var unregPerc = _getUserPercentage(unregistered);

                pieData.labels.push(regPerc + "%", unregPerc + "%");

                pieData.series.push(registered, unregistered);

                var chart = new Chartist.Pie('#usersPieChart', pieData, _getPieConfig());

                _animatePieChart(chart);
            }
        }
        function _getPieConfig()
        {
            var pieConfig = {};
            pieConfig.donut = true;
            pieConfig.showLabel = true;
            pieConfig.donutWidth = 150;
            pieConfig.labelDirection = "explode";

            return pieConfig;
        }
        function _getUserPercentage(userCount)
        {
            return Number(Math.round((((userCount / vm.totalUserCount) * 100) + 'e2')) + 'e-2');
        }
        function _animatePieChart(chart)
        {
            chart.on('draw', function (data)
            {
                if (data.type === 'slice')
                {
                    var pathLength = data.element._node.getTotalLength();

                    data.element.attr({
                        'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                    });

                    var animationDefinition = {
                        'stroke-dashoffset': {
                            id: 'anim' + data.index,
                            dur: 1000,
                            from: -pathLength + 'px',
                            to: '0px',
                            easing: Chartist.Svg.Easing.easeOutQuint,
                            fill: 'freeze'
                        }
                    };

                    if (data.index !== 0)
                    {
                        animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
                    }

                    data.element.attr({
                        'stroke-dashoffset': -pathLength + 'px'
                    });

                    data.element.animate(animationDefinition, false);
                }
            });

            chart.on('created', function ()
            {
                if (window.__anim21278907124)
                {
                    clearTimeout(window.__anim21278907124);
                    window.__anim21278907124 = null;
                }
                window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
            });
        }

        //==** ERROR CALLBACK **==
        function _onError(jqXHR)
        {
            vm.$alertService.error(jqXHR.responseText, "Failed!");
        }
    }
})();