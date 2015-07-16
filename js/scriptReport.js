var currentCampID = '';

$(window).on('load', function (event) {

    setHeights(1);

    menuCreator();

    setjQueryUILang();

    setDateFilterMonth();
    $('#datepickerFrom').val(fromDate);
    $('#datepickerTo').val(toDate);

    $('#selectPeriod').on('change', function () {
        $('.loader').show();
        $('.noResults, .results').hide();

        var $value = $(this).val();
        var $changeDate = true;

        switch ($value) {
            case 'thirtydays':
                setDateFilterThirtyDays();
                break;
            case 'month':
                setDateFilterMonth();
                break;
            case 'sevendays':
                setDateFilterSevenDays();
                break;
            case 'period':
                $changeDate = false;
                setDateFilterPeriod();
                break;
        }

        if ($changeDate) {
            $('#datepickerFrom').val(fromDate);
            $('#datepickerTo').val(toDate);
        }

        var campId = currentCampID = $('.campaignSelector select option:selected').attr('data-campId');
        console.log(currentCampID)
        getCampaingReport(campId);
    });

    $('#datepickerFrom').datepicker({
        maxDate: toDate,
        onSelect: function (selected) {
            $("#datepickerTo").datepicker("option", "minDate", selected)
        }
    });

    $('#datepickerTo').datepicker({
        maxDate: toDate,
        onSelect: function (selected) {
            $("#datepickerFrom").datepicker("option", "maxDate", selected);
        }
    });

    loadCampaignSelector();

    var firstCamp = $('.campaignSelector select option:first-child').attr('data-campId');
    setTimeout(getCampaingReport(firstCamp), 1000);

    $('.campaignSelector select').on('change', function () {
        var campId = currentCampID = $(this).find('option:selected').attr('data-campId');

        $('.loader').show();
        $('.noResults, .results').hide();

        getCampaingReport(campId);
    });

    $('.showSelects').addClass('notShow');

    $('.showSelects').on('touchend', function () {
        if ($(this).hasClass('notShow')) {
            $('.selectsContainer').css('max-height', '344px');
            setTimeout(function () {
                $('.showSelects').removeClass('notShow')
            }, 100)
        } else {
            $('.selectsContainer').css('max-height', '0');
            setTimeout(function () {
                $('.showSelects').addClass('notShow')
            }, 100)
        }

        setTimeout(function () {
            calcHeightDinamic();
        }, 700)
    })

    progress(80, $('#progressBar'));

    currentCampID = $('.campaignSelector select option:first-child').val();

    $('.infoBlock.clientes').on('tap', function (e, data) {
        window.location.href = 'contacts.html#' + currentCampID;
    })

    var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    window.addEventListener(orientationEvent, function () {
        calcHeightDinamic();
    }, false);

    calcHeightDinamic();
});
function calcHeightDinamic() {

    var $calc = $(window).height() - $('.selectsContainer').height() - 60;

    $('.results').height($calc).css('overflow', 'auto')
}

$(window).on('resize', function () {
    var firstCamp = $('.campaignSelector select option:first-child').attr('data-campId');
    $('.loader, .noResults').show();
    $('.results').hide();
    $('.noResults').hide();

    setTimeout(
        function () {
            getCampaingReport(firstCamp);
            $('.loader, .noResults').hide();
            $('.results').show();
        }
        , 1000);
});

var toDate;
var fromDate;
var d = new Date();
var a = d.getDate();
var day = a < 10 ? '0' + a : '' + a;
var m = d.getMonth() + 1;
var month = m < 10 ? '0' + m : '' + m;
var year = d.getFullYear();
toDate = day + '/' + month + '/' + year;
function setDateFilterThirtyDays() {
    // seteo las fechas a un mes atras.
    var mAgo = d.getMonth() == 0 ? 12 : d.getMonth();
    var monthAgo = mAgo < 10 ? '0' + mAgo : '' + mAgo;

    fromDate = day + '/' + monthAgo + '/' + year;
}

function setDateFilterMonth() {
    // seteo las fechas a un mes atras.
    var newDate = new Date();
    var mAgo = newDate.getMonth() + 1;
    var monthAgo = mAgo < 10 ? '0' + mAgo : '' + mAgo;

    fromDate = '01/' + monthAgo + '/' + year;
}

function setDateFilterSevenDays() {
    // seteo las fechas a 7 días atras.
    var newDate = new Date();
    newDate.setDate(newDate.getDate() - 7);
    var mAgo = newDate.getMonth() + 1;
    var monthAgo = mAgo < 10 ? '0' + mAgo : '' + mAgo;
    var newDay = newDate.getDate();
    newDay = newDay < 10 ? '0' + newDay : '' + newDay;

    fromDate = newDay + '/' + monthAgo + '/' + year;
}

function setDateFilterPeriod() {
    $('#datepickerFrom, #datepickerTo').val('00/00/0000');
}

function getCampaingReport(campId) {

    var fromDate = $('#datepickerFrom').val();
    var toDate = $('#datepickerTo').val();
    var type = $('#selectPeriod').val();
    var ultima_visita = getUltimaVisita(campId, type);

    try{
        $.ajax({
            url: webServicesUrl + "report.php",
            type: 'POST',
            async: true,
            data: {
                campID: campId,
                from: fromDate,
                to: toDate,
                //ultima_visita: ultima_visita
            },
            success: function (result) {
                var r = $.parseJSON(result);
                if (r.data && r.data.status && r.data.status == 'success' && r.data.Reporte != undefined) {
                    updateReportsLocalStorage(r.data, campId, type);
                }else{
                    alert('Ha ocurrido un error.');
                    showReports(campId, type);
                }
            },
            error: function (error) {
                showReports(campId, type);
                console.log(JSON.stringify(error));
            }
        });
    }catch(err){
        showReports(campId, type);
        console.log(err);
    }
}

function getUltimaVisita(campId, type) {
    //var ultimaVisita;
    //var ultimasVisitas = localStorage.getItem('ultimaVisita');
    //ultimasVisitas = ultimasVisitas != null ? JSON.parse(ultimasVisitas) : [];
    //for (var i = 0; i < ultimasVisitas.length; i++) {
    //    if (ultimasVisitas[i].campID == campId && ultimasVisitas[i].type == type) {
    //        ultimaVisita = ultimasVisitas[i].ultimaVisita;
    //    }
    //}
    //
    //return ultimaVisita;
}

function updateUltimaVisita(campId, ultima_visita, type) {
    //var add = false;
    //var ultimaVisita = {};
    //var ultimasVisitas = localStorage.getItem('ultimaVisita');
    //ultimasVisitas = ultimasVisitas != null ? $.parseJSON(ultimasVisitas) : [];
    //if (ultimasVisitas.length == 0) {
    //    ultimaVisita.campID = campId;
    //    ultimaVisita.type = type;
    //    ultimaVisita.ultimaVisita = ultima_visita;
    //    ultimasVisitas.push(ultimaVisita);
    //    add = true;
    //} else {
    //    for (var i = 0; i < ultimasVisitas.length; i++) {
    //        if (ultimasVisitas[i].campID == campId && ultimasVisitas[i].type == type) {
    //            ultimasVisitas[i].ultimaVisita = ultima_visita;
    //            add = true;
    //        }
    //    }
    //}
    //
    //if (!add) {
    //    ultimaVisita.campID = campId;
    //    ultimaVisita.type = type;
    //    ultimaVisita.ultimaVisita = ultima_visita;
    //    ultimasVisitas.push(ultimaVisita);
    //}
    //
    //localStorage.setItem('ultimaVisita', JSON.stringify(ultimasVisitas));
}

function updateReportsLocalStorage(data, campId, type) {
    //// actualizo ultima visita de la campaña
    //if (data.ultima_visita != undefined) {
    //    updateUltimaVisita(campId, data.ultima_visita, type);
    //}

    // agrego los reportes guardados en localStorage
    var sLocalReports = localStorage.getItem('reports');
    var aLocalReports = sLocalReports != null ? JSON.parse(sLocalReports) : [];
    var add = false;
    for (var i = 0; i < aLocalReports.length; i++) {
        if (aLocalReports[i] != undefined && aLocalReports[i].campID == campId && aLocalReports[i].type == type && data.Reporte != undefined) {
            aLocalReports[i].data = data;
            add = true;
        }
    }

    if (!add) {
        var report = {};
        report.campID = campId;
        report.type = type;
        report.data = data;
        aLocalReports.push(report);
    }

    localStorage.setItem('reports', JSON.stringify(aLocalReports));

    showReports(campId, type);
}

function showReports(campId, type) {

    var sLocalReports = localStorage.getItem('reports');
    var aLocalReports = sLocalReports != null ? JSON.parse(sLocalReports) : [];
    var r = {};
    r.data = null;
    for (var i = 0; i < aLocalReports.length; i++) {
        if (aLocalReports[i] != undefined && aLocalReports[i].campID == campId && aLocalReports[i].type == type) {
            r.data = aLocalReports[i].data;
        }
    }

    if (r.data != null) {
        var arrayReporte = r.data.Reporte;
        var impresiones = Math.ceil(r.data.impresiones);
        var visitas = 0;
        var consultas = 0;
        var arrayVisitas = Array();
        var arrayConsultas = Array();

        // Recorro tortas para traer el total de consultas
        $.each(r.data.torta, function (val) {
            consultas += parseInt(r.data.torta[val]);
        });

        $(jQuery.parseJSON(JSON.stringify(arrayReporte))).each(function (index) {

            visitas += parseInt(this.visitas);

            var fecha = this.date_created;
            var anio = parseInt(fecha.substring(0, 4));
            var mes = parseInt(fecha.substring(5, 7)) - 1;
            var dia = parseInt(fecha.substring(8, 10));
            var fechaCreado = Date.UTC(anio, mes, dia);

            arrayVisitas[index] = [fechaCreado, parseInt(this.visitas)];
            arrayConsultas[index] = [fechaCreado, parseInt(this.consultas)];
        });

        showInfoBlock(impresiones, visitas, consultas);
        $('.results').show();
        loadGraph1(arrayVisitas, arrayConsultas);
        loadGraph2(r.data.total_deuda, r.data.progreso_mes);
        loadGraph3(r.data.torta);
    } else {
        $('.noResults').show();
    }
    $('.loader').hide();
}

function secuentallyFunctions(arrayFunctions){
    var d = $.Deferred().resolve();
    while (arrayFunctions.length > 0) {
        d = d.then(arrayFunctions.shift()); // you don't need the `.done`
    }
}

function showInfoBlock(impresiones, visitas, consultas) {
    var $visitas = $('.infoBlock.anuncios .number');
    var $clicks = $('.infoBlock.landing .number');
    var $consultas = $('.infoBlock.clientes .number');

    $visitas.html(impresiones);
    $clicks.html(visitas);
    $consultas.html(consultas);
}

function loadGraph1(arrayVisitas, arrayConsultas) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph1',
            backgroundColor: '#ffffff',
            type: 'column',
            height: $(window).width() / 2,
            borderWidth: 0
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%d/%m/%y'
            },
            minPadding: 0.05,
            maxPadding: 0.05,
            gridLineColor: 'transparent',
            borderWidth: 0
        },
        yAxis: {
            title: {
                text: null
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            floor: 0,
            gridLineColor: 'transparent',
            borderWidth: 0
        },
        tooltip: {
            formatter: function () {
                return this.y + ' ' + this.series.name + ' al ' + Highcharts.dateFormat('%d/%m/%y', new Date(this.x));
            }

        },
        legend: {
            align: 'right',
            borderWidth: 1,
            floating: true,
            layout: 'vertical',
            verticalAlign: 'top'
        },
        series: [{
            name: 'Visitas',
            data: arrayVisitas,
            color: '#628a27',
            fillColor: '#a5b39a',
            marker: {
                fillColor: '#628a27'
            }
        }],
        credits: {
            enabled: false
        }
    });
}

function loadGraph2(deuda, mes) {

    var $graphContainer = $('#graph2');

    var dataPercent = Math.round(parseInt(mes * 100 / deuda));
    var allPercent = deuda;
    $('.graphInfo').remove();
    var html = '<div class="graphInfo"><p>' + mes + ' visitas en el mes  sobre un total de ' + allPercent;
    $('.completedMonthGraph').prepend(html);

    progress(dataPercent, $('#progressBar'));
}

function loadGraph3(torta) {
    var datostorta = new Array();

    var $totales = 0;
    $.each(torta, function (val) {
        $totales += parseInt(torta[val]);
    });
    var colors = ['#1ac6b4', '#1ac65b', '#b4c61a', 'ff6000']
    var c = 0;
    $.each(torta, function (val) {

        if (c == 4) {
            c = 0;
        }
        //datostorta.push({val, torta[val]});

        var temp = new Array();
        temp.push(val.substring(0, 20));
        temp.push(parseInt(torta[val] * 100 / $totales));
        datostorta.push(temp);
        /*
         datostorta2 = [
         ['Mails',   45.0],
         ['Telefono',       26.8],
         ['Web', 12.8],
         ['Twitter',    8.5]
         ];
         */
    });

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph3',
            type: 'pie',
            backgroundColor: '#f4f6f0',
            height: $(window).width() / 2,
            events: {
                load: function () {
                    $("#addText").empty();
                    var textX = this.plotLeft + (this.plotWidth * 0.5);
                    var textY = this.plotTop + (this.plotHeight * 0.5) + 55;

                    var span = '<span id="pieChartInfoText" style="position:absolute; text-align:center;z-index:9">';
                    span += '<span style="font-size: 25px;color:#000">' + $totales + '</span>';
                    span += '<span style="font-size: 13px;color:#000">VISITAS</span>';
                    span += '</span>';

                    $("#addText").append(span);
                    span = $('#pieChartInfoText');
                    span.css('left', textX + (span.width() * -0.5));
                    span.css('top', textY + (span.height() * -0.5));
                }
            }
        },
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
                innerSize: '85%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true
            }
        },
        tooltip: {
            formatter: function () {
                return this.key + ': ' + this.y + '%';
            }
        },
        legend: {
            align: 'right',
            borderWidth: 0,
            layout: 'vertical',
            verticalAlign: 'middle',
            x: -20
        },
        series: [{
            type: 'pie',
            name: '',
            data: datostorta
        }],
        credits: {
            enabled: false
        }
    });
}


function progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({width: progressBarWidth}, 800).html(percent + "%&nbsp;");
}