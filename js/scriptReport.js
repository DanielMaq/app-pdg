$('#reportPage').live( 'pageinit',function(event){

    setHeights(1);

    menuCreator();

    setjQueryUILang();
    /* Get Today */
    var d = new Date();
    var a = d.getDate();
    var day = a<10? '0'+a:''+a;
    var m = d.getMonth()+1;
    var month = m<10? '0'+m:''+m;
    var year = d.getFullYear();
    var todayDate = day+'/'+month+'/'+year;

    $('#datepickerFrom').datepicker({
        maxDate: todayDate,
        onSelect: function (selected) {
            $("#datepickerTo").datepicker("option","minDate", selected)
        }
    });

    $('#datepickerTo').datepicker({
        maxDate: todayDate,
        onSelect: function(selected) {
            $("#datepickerFrom").datepicker("option", "maxDate", selected);
        }
    });

    loadCampaignSelector();

    var firstCamp = $('.campaignSelector select option:first-child').attr('data-campId');
    getCampaingReport(firstCamp);

    $('.campaignSelector select').on('change', function(){
        var campId = $(this).find('option:selected').attr('data-campId');

        $('.loader').show();
        $('.noResults, .results').hide();

        getCampaingReport(campId);
    });

    $('.dateRangeSelector .filter.go').on('click', function(){
        var campId = $('.campaignSelector select option:selected').attr('data-campId');
        $('.loader').show();
        $('.noResults, .results').hide();
        getCampaingReport(campId);
    });

    $('.dateRangeSelector .filter.reset').on('click', function(){
        $('#datepickerFrom, #datepickerTo').val('00/00/0000');
    });

});

$(window).on('resize', function(){
    loadGraph2();
});


function getCampaingReport(campId){

    var fromDate = $('#datepickerFrom').val();
    var toDate = $('#datepickerTo').val();
    var sendOk = 0;

    if( $.trim(fromDate).length === 0 ){
        $('.loader, .results').hide();
        $('.noResults').show();
        showMessage('Debe completar filtro "desde"');
    }else if( $.trim(toDate).length === 0 ){
        $('.loader, .results').hide();
        $('.noResults').show();
        showMessage('Debe completar filtro "hasta"');
    }else{
        sendOk = 1;
    }

    if (sendOk) {
        if ( fromDate == '00/00/0000' || toDate == '00/00/0000') {
            fromDate = toDate = 0;
        }

        $.ajax({
            url: webServicesUrl+"report.php",
            type:'POST',
            data: {
                campID : campId,
                from: fromDate,
                to: toDate
            },
            success: function(result) {
                var r = $.parseJSON(result);

                if (r.data && r.data.status && r.data.status == 'success') {

                    var arrayReporte = r.data.Reporte;
                    var impresiones = Math.ceil(r.data.impresiones);
                    var visitas = 0;
                    var consultas = 0;
                    var arrayVisitas = Array();
                    var arrayConsultas = Array();

                    // Recorro tortas para traer el total de consultas
                    $.each(r.data.torta, function (val){
                        consultas += parseInt(r.data.torta[val]);
                    });

                    $(jQuery.parseJSON(JSON.stringify(arrayReporte))).each(function(index) {
                        visitas += parseInt(this.visitas);

                        var fecha = this.date_created;
                        var anio = parseInt( fecha.substring(0, 4) );
                        var mes = parseInt( fecha.substring(5, 7) ) - 1;
                        var dia = parseInt( fecha.substring(8, 10) );
                        var fechaCreado = Date.UTC(anio, mes, dia);

                        arrayVisitas[index] = [fechaCreado, parseInt(this.visitas) ];
                        arrayConsultas[index] = [fechaCreado, parseInt(this.consultas) ];
                    });

                    setTimeout(function() {
                        showInfoBlock(impresiones, visitas, consultas);
                        $('.loader, .noResults').hide();
                        $('.results').show();
                        loadGraph1(arrayVisitas, arrayConsultas);
                        loadGraph2(r.data.total_deuda, r.data.progreso_mes);
                        loadGraph3(r.data.torta);
                    }, 1500 );
                } else {
                    $('.loader, .results').hide();
                    $('.noResults').show();
                }
            },
            error:function(error){
                alert(JSON.stringify(error));
            }
        });
    }

}

function showInfoBlock(impresiones, visitas, consultas){
    var $visitas = $('.infoBlock.anuncios .number');
    var $clicks = $('.infoBlock.landing .number');
    var $consultas = $('.infoBlock.clientes .number');

    $visitas.html(impresiones);
    $clicks.html(visitas);
    $consultas.html(consultas);
}

function loadGraph1(arrayVisitas, arrayConsultas){
    var $graphContainer = $('#visitContactGraph');

    $graphContainer.highcharts({
        chart: {
            backgroundColor: '#f5f5f5',
            type: 'area'
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%d/%m/%y'
            }
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
            floor: 0
        },
        tooltip: {
            formatter: function() {
                return  this.y + ' ' + this.series.name + ' al ' + Highcharts.dateFormat('%d/%m/%y',new Date(this.x));
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
            color: '#118fdd',
            fillColor: '#a0d2f1',
            marker: {
                fillColor: '#118fdd'
            },
            pointInterval: 24 * 36000
        }, {
            name: 'Consultas',
            data: arrayConsultas,
            fillColor: 'transparent',
            color: '#58bd7c',
            marker: {
                lineWidth: 2,
                lineColor: '#58bd7c',
                fillColor: '#a0d2f1',
                symbol: 'circle'
            },
            pointInterval: 24 * 36000
        }],
        credits: {
            enabled: false
        }
    });
}

function loadGraph2(deuda, mes){

    var $graphContainer = $('.completedMonthGraph .theGraph');

    var dataPercent = Math.ceil(parseInt(mes * 100 / deuda));
    var allPercent = deuda;

    var gaugeOptions = {

        chart: {
            type: 'solidgauge',
            backgroundColor: '#f5f5f5'
        },
        title: null,
        pane: {
            center: ['50%', '70%'],
            size: '100%',
            startAngle: -60,
            endAngle: 60,
            background: {
                backgroundColor: '#e0e0e0',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        yAxis: {
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            },
            series: {
                marker: {
                    fillColor: '#0F0'
                }
            }
        }
    };

    $graphContainer.highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Completado',
            data: [dataPercent],
            dataLabels: {
                format: '<div class="graphInfo"><p><span>{y} %</span> *El 100% de este mes es de '+ allPercent +' visitas </p></div>'
            },
            tooltip: {
                enabled: false
            }
        }]
    }));
}

function loadGraph3(torta){

    var $graphContainer = $('.consuTypeGraph .theGraph');

    datostorta = new Array();
    datostorta2 = new Array();

    $totales = 0;
    $.each(torta, function (val){
        $totales += parseInt(torta[val]);
    });

    $.each(torta, function (val){
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


    $graphContainer.highcharts({
        chart: {
            backgroundColor: '#f5f5f5',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: null
        },
        tooltip: {
            formatter: function() {
                return  this.key + ': '+ this.y + '%';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                showInLegend: true
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
            type: 'pie',
            name: '',
            data: datostorta
        }],
        credits: {
            enabled: false
        }
    });
}