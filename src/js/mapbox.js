/* global mapboxgl */

export const displayMap = (locations, token) => {
  mapboxgl.accessToken = token;

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/spaceotti1981/cmnfthtlc000d01sedpw81rcs',
    scrollZoom: false,
    //   center: [-71.06776, 42.35816], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //   zoom: 4, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //1.Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //2.Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<p>
        Day ${loc.day}: ${loc.description}
      </p>`,
      )
      .addTo(map);
    //Extend map bounds to integrate locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};
