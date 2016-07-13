var GENEMAP = GENEMAP || {};

GENEMAP.InfoBox = function () {

  var my = {};

  var target = 'body';
  var setManualLabelMode = $.noop;

  // close all open popovers
  var closeAllPopovers = function (event) {
    if ($(event.target).hasClass('btn-infobox-label')) {
      return;
    }

    console.log('closing popovers ...' + event);
    $('.infobox').popover('hide');
  };

  // generates the HTML content for the Gene popover
  var generatePopoverContent = function (id, data) {
    var button = '<span class="btn-infobox-label show-label" ' +
      ' data-feature-id="' + id + '" title ="Show Label"></span>';

    if (data.showLabel === 'show')
    {
      button = '<span class="btn-infobox-label hide-label" data-feature-id="' + id + '" title ="Hide Label"></span>';
    }

    return '<div><a href="' + data.link + '" target="_blank">' + data.label + '</a>' +
             '<br />Chromosome ' + data.chromosome + ' :' +
              data.start + '-' + data.end + button +
              '</div>';
  };

  // generates the HTML content for the QTL popover
  var generateQTLPopoverContent = function (data) {

    var content = '<div>';

    for (var i = 0; i < data.labels.length; i++) {
      content += '<a href="' + data.links[i] + '" target="_blank">' + data.labels[i] + '</a><br />';
    }

    content += 'Chromosome ' + data.chromosome + ' :' + data.start + '-' + data.end + '</div>';
    return content;
  };

  // sets the event handlers on the d3 selection to toggle the popover
  var setupPopoverEventHandlers = function (selection) {

    selection.on('mousedown', function () {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      return false;

    }).on('contextmenu', function () {

      $('.infobox').not($(this).children()).popover('hide');
      $(this).children().popover('toggle');

      d3.event.preventDefault();
      d3.event.stopPropagation();
      return false;
    }).on('dblclick', function () {

      d3.event.preventDefault();
      d3.event.stopPropagation();
      return false;
    });
  };

  // atach the infobox listeners to the target, this is so that click + scroll
  // events will close any popovers
  my.attach = function () {
    $(target).off('mousedown mousewheel DOMMouseScroll').on('mousedown mousewheel DOMMouseScroll', closeAllPopovers);

    $(target).off('click').on('click', '.btn-infobox-label', function (event) {

      setManualLabelMode();
      console.log('infobox label click ' + event);
      var featureId = $(event.target).data().featureId;

      var feature = d3.select('#' + featureId);
      var data = feature.datum();

      if (data.data) {
        data = data.data;
      }

      var visibility;
      if (data.showLabel === 'show') {
        data.showLabel = 'hide';
        visibility = 'hidden';
      } else {
        data.showLabel = 'show';
        visibility = 'visible';
      }

      feature.select('text').style('visibility', visibility);

      // generate the new HTML
      var content = generatePopoverContent(featureId, data);

      // update the html in the popver
      var popover = $('#' + featureId).find('.infobox').data('bs.popover');
      popover.options.content = content;

      // update the html in the currently displayed popover
      $(this).closest('.popover-content').html(content);

      event.preventDefault();
      event.stopPropagation();
      return false;
    });
  };

  // Setup the infobox popovers for the gene annotations, this includes a link and
  // a button to toggle the gene label
  my.setupInfoboxOnSelection = function (selection) {

    selection.selectAll('.infobox').each(function (d) {
      var data = d;

      // check if labella is being used, in which case the data will be moved into the .data property.
      if (data.data) {
        data = data.data;
      }

      var id = $(this).closest('.gene-annotation').attr('id');
      var content = generatePopoverContent(id, data);

      // does this element already have a popover?
      var popover = $(this).data('bs.popover');
      if (popover) {
        // update the popover content
        popover.options.content = content;
      } else {
        // create a new popover
        $(this).popover({
          title: null,
          content: content,
          container: target,
          placement: 'bottom',
          animation: true,
          trigger: 'manual',
          html: true,
        });
      }

    });

    setupPopoverEventHandlers(selection);
  };

  // Setup the QTL infobox popovers, this (possibly) includes multiple
  // links from the combined QTL regions
  my.setupQTLInfoboxOnSelection = function (selection) {

    selection.selectAll('.infobox').each(function (d) {
      var data = d;

      var content = generateQTLPopoverContent(data);

      // does this element already have a popover?
      var popover = $(this).data('bs.popover');
      if (popover) {
        // update the popover content
        popover.options.content = content;
      } else {
        // create a new popover
        $(this).popover({
          title: null,
          content: content,
          container: target,
          placement: 'bottom',
          animation: true,
          trigger: 'manual',
          html: true,
        });
      }

      setupPopoverEventHandlers(selection);
    });
  };

  // specify the 'target' element the popover will exist within
  my.target = function (value) {
    if (!arguments.length) {
      return target;
    }

    target = value;
    return my;
  };

  // Function to set the 'manual' label mode, will be called before
  // each individual label is toggled
  my.setManualLabelMode = function (value) {
    if (!arguments.length) {
      return setManualLabelMode;
    }

    setManualLabelMode = value;
    return my;
  };

  return my;
};
