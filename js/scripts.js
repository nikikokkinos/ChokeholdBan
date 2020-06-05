mapboxgl.accessToken = 'pk.eyJ1IjoibmlraTEyc3RlcCIsImEiOiJjanZlNGFneWswMm0zNDRxcGYwZXYwcjl2In0.fWV3JfWN5hg9UFqDimwIZw';

// adding mapbox map container
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/niki12step/ck8q9fgpx00d91ipipual7mrl', // my style url
  zoom: 9.5,
  center: [-73.895255,40.725129],
})

// geojson data
var chokeholdUrl = 'https://raw.githubusercontent.com/nikikokkinos/Data/master/NYC_Council_ChokeholdBan.geojson'

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
)

// empty var for hover
var hoveredChokeholdId = null

// popup attributes
var markerHeight = 20, markerRadius = 10, linearOffset = 25;
var popupOffsets = {
  'top': [0, 0],
  'top-left': [0,0],
  'top-right': [0,0],
  'bottom': [0, -markerHeight],
  'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  'left': [markerRadius, (markerHeight - markerRadius) * -1],
  'right': [-markerRadius, (markerHeight - markerRadius) * -1]
}

map.on('load', function() {

  map.addSource('chokeholdSource', {
    'type': 'geojson',
    'data': chokeholdUrl,
    'generateId': true
  })

  map.addLayer({
    'id': 'chokeholdLayer',
    'type': 'fill',
    'source': 'chokeholdSource',
    'paint':  {
        'fill-outline-color': '#000000',
        'fill-opacity': .7,
        'fill-color': {
          'property': 'Support',
          'type': 'categorical',
          'stops': [
            ['Support',  '#edff87'],
            ['Not Signed On',  '#ff5c59'],
          ]
        }
      },
    })
  // })

  // hover effect
  map.on('mousemove', 'chokeholdLayer', function(e) {
    map.getCanvas().style.cursor = 'pointer'
      if (e.features.length > 0) {
        if (hoveredChokeholdId) {
        map.setFeatureState(
          { source: 'chokeholdSource', id: hoveredChokeholdId },
          { hover: false }
        )
        }
      hoveredChokeholdId = e.features[0].id
      map.setFeatureState(
          { source: 'chokeholdSource', id: hoveredChokeholdId },
          { hover: true }
        )
      }
    })

  map.on('mouseleave', 'chokeholdLayer', function() {
    if (hoveredChokeholdId) {
        map.setFeatureState(
          { source: 'chokeholdSource', id: hoveredChokeholdId },
          { hover: false }
        )
      }
      hoveredChokeholdId = null
  })

  // popup effects
  var chokeholdPopup = new mapboxgl.Popup({
    offset: popupOffsets,
    closeButton: false,
    closeOnClick: false
  })

  map.on('click', 'chokeholdLayer', function(e) {

    var councilWebsite = e.features[0].properties.Webpage;

    var chokeholdHTML =
    'Council Member:' + ' ' + e.features[0].properties.CouncilMem + '<br >' +
    'District Number:' + ' ' + e.features[0].properties.CounDist + '<br >' +
    'Chokehold Ban Stance:' + ' ' + e.features[0].properties.Support + '<br >' +
    '<a href="' + councilWebsite + '"  target="_blank" >Visit Webpage to Find Contact Info</a>'

    chokeholdPopup
      .setLngLat(e.lngLat)
      .setHTML( chokeholdHTML )
      .addTo(map)
  })

  $('#mapInfo').click( function () {
        $('#expanded').show()
        $('#titleChange').show()
        $('#clickHere').hide()
      })

  $('#mapInfo').mouseleave( function () {
        $('#expanded').hide()
        $('#clickHere').show()
        $('#titleChange').hide()
      })

})
