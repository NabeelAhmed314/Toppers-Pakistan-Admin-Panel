<template>
  <div style="padding: 20px">
    <input
      v-if="search"
      id="pac-input"
      style="width: 100%;padding: 10px;border: 1px solid #313f53;margin-bottom: 10px;border-radius: 5px;height: 36px"
      className="controls"
      type="text"
      placeholder="Search Your Location ... "
    />
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    oldMarker: {
      type: Object,
      default: null
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      service: null,
      message: null,
      bounds: null,
      map: null,
      mapMarker: null,
      marker: {
        lat: 24.44,
        lng: 39.62
      }
    }
  },
  created() {
    if (this.oldMarker) {
      this.marker.lat = Number(this.oldMarker.latitude)
      this.marker.lng = Number(this.oldMarker.longitude)
    }
  },
  mounted() {
    const script = window.document.createElement('script')
    const saudiBounds = {
      north: 32.03,
      south: 16.72,
      west: 34.76,
      east: 55.24
    }
    // const city = { lat: 24.44, lng: 39.62 }
    script.onload = () => {
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('map'), {
        center: this.marker,
        restriction: {
          latLngBounds: saudiBounds,
          strictBounds: false
        },
        zoom: 9
      })
      this.map = map
      const saudiaCoordinates = [
        { lat: 28.1573, lng: 34.63 },
        { lat: 29.313309, lng: 35.07 },
        { lat: 29.1215, lng: 36.1686 },
        { lat: 30.55, lng: 38.102 },
        { lat: 31.4549, lng: 37.223 },
        { lat: 32.0901, lng: 39.2448 },
        { lat: 29.1791, lng: 44.606 },
        { lat: 28.98, lng: 47.28 },
        { lat: 28.48, lng: 47.63 },
        { lat: 28.4861, lng: 48.3634 },
        { lat: 27.5745, lng: 48.8029 },
        { lat: 27.2332, lng: 49.2313 },
        { lat: 26.8418, lng: 49.81 },
        { lat: 26.44, lng: 50.17 },
        { lat: 25.88, lng: 50.05 },
        { lat: 25.629, lng: 50.1821 },
        { lat: 25.388, lng: 50.463 },
        { lat: 24.7868, lng: 50.718 },
        { lat: 24.447, lng: 51.08 },
        { lat: 24.5, lng: 51.317 },
        { lat: 24.581, lng: 51.399 },
        { lat: 24.3943, lng: 51.279 },
        { lat: 24.2705, lng: 51.266 },
        { lat: 24.312, lng: 51.423 },
        { lat: 24.248, lng: 51.52 },
        { lat: 24.278, lng: 51.74 },
        { lat: 24.2482, lng: 51.5814 },
        { lat: 24.154, lng: 51.586 },
        { lat: 24.106, lng: 51.592 },
        { lat: 22.934, lng: 52.577 },
        { lat: 22.629, lng: 55.131 },
        { lat: 22.7, lng: 55.204 },
        { lat: 22.002, lng: 55.649 },
        { lat: 22.01, lng: 54.97 },
        { lat: 19.02, lng: 51.97 },
        { lat: 18.82, lng: 50.77 },
        { lat: 18.66, lng: 49.11 },
        { lat: 18.21, lng: 48.172 },
        { lat: 17.48, lng: 47.56 },
        { lat: 17.14, lng: 47.45 },
        { lat: 16.97, lng: 47.17 },
        { lat: 16.97, lng: 47.008 },
        { lat: 17.31, lng: 46.76 },
        { lat: 17.257, lng: 46.36 },
        { lat: 17.352, lng: 45.409 },
        { lat: 17.457, lng: 45.22 },
        { lat: 17.381, lng: 43.684 },
        { lat: 17.5642, lng: 43.3379 },
        { lat: 16.448, lng: 42.79 },
        { lat: 28.1573, lng: 34.63 }
      ]

      // eslint-disable-next-line no-undef
      const saudiaPolygon = new google.maps.Polygon({
        paths: saudiaCoordinates,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1
      })
      saudiaPolygon.setMap(map)

      if (this.click) {
        saudiaPolygon.addListener('click', (event) => {
          this.updateMarker(event.latLng.lat(), event.latLng.lng())
        })
      }
      if (this.search) {
        const input = document.getElementById('pac-input')
        // eslint-disable-next-line no-undef
        const autocomplete = new google.maps.places.Autocomplete(input)
        autocomplete.bindTo('bounds', map)
        autocomplete.setFields([
          'address_components',
          'geometry',
          'icon',
          'name'
        ])
        autocomplete.setComponentRestrictions({ country: ['sau'] })
        // eslint-disable-next-line no-undef
        autocomplete.addListener('place_changed', () => {
          marker.setVisible(false)
          const place = autocomplete.getPlace()
          if (!place.geometry) {
            // console.log('no place')
            return
          }
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport)
          } else {
            map.setCenter(place.geometry.location)
            map.setZoom(17) // Why 17? Because it looks good.
          }
          this.updateMarker(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          )
        })
      }
      // eslint-disable-next-line no-undef
      const marker = new google.maps.Marker({
        position: this.marker,
        map,
        title: 'My Location!'
      })
      this.mapMarker = marker
      this.$emit('input', this.marker)
    }
    script.async = true
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8&libraries=places&v=weekly'
    document.head.appendChild(script)
  },
  methods: {
    updateMarker(lat, lng) {
      this.mapMarker.setMap(null)
      const position = {
        lat,
        lng
      }
      this.marker = position
      window.console.log(this.marker)
      // eslint-disable-next-line no-undef
      this.mapMarker = new google.maps.Marker({
        position,
        map: this.map
      })
      this.$emit('input', this.marker)
    }
  }
}
</script>
<style>
/* Set the size of the div element that contains the map */
#map {
  height: 250px; /* The height is 400 pixels */
  width: 100%; /* The width is the width of the web page */
}
</style>
