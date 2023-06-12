<template>
  <div class="w-full h-full">
    <div
      id="map"
      class="w-full h-[100vh]"
      v-if="toTrackWithRealAddressLine"
    ></div>
    <l-map
      v-else
      ref="mapRef"
      :options="{ zoomControl: false }"
      class="z-0 w-full"
      :maxZoom="maxZoom"
      :zoom="zoom"
      :minZoom="minZoom"
      :center="[center.lat, center.lng]"
    >
      <l-tile-layer
        :url="mapboxTileLayerUrl"
        :attribution="mapboxAttribution"
      ></l-tile-layer>
      <l-control-zoom position="bottomright"></l-control-zoom>
      <l-control-scale
        position="topright"
        :imperial="true"
        :metric="false"
      ></l-control-scale>
      <l-marker
        v-for="item in informs"
        :key="item.id"
        :lat-lng="[item.lat, item.lng]"
      >
        <l-icon
          v-if="item.icon"
          :icon-size="[20, 24.0]"
          :icon-anchor="[10, 24.0]"
          icon-url="item.icon"
        ></l-icon>
        <l-icon
          v-if="item.staticAnchor"
          :icon-anchor="item.staticAnchor"
          class-name="someExtraClass"
        >
          <slot name="customText" :value="{ text: item.customText }"> </slot>
        </l-icon>

        <l-popup v-if="item?.popup">
          <slot name="popup" :popup="item.popup"> </slot>
        </l-popup>
        <l-tooltip
          v-if="item.tooltip"
          :options="{ permanent: item.isPersistenceTooltip, interactive: true }"
        >
          <slot name="tooltip" :tooltip="item.tooltip" />
        </l-tooltip>
      </l-marker>
      <l-polyline
        v-if="polyline"
        :latLngs="polyline"
        :color="polylineColor"
        class="h-[0.1px]"
      >
        <l-marker
          v-for="(point, index) in polylinePoints"
          :key="index"
          :latLng="[point.lat, point.lng]"
        >
          <l-popup>
            <slot name="popupPolyline" :popup_data="point.popup_info"></slot>
          </l-popup>

          <l-tooltip :options="{ permanent: false, interactive: true }">
            <slot name="tooltipPolyline" :tooltip_data="point.tooltip"></slot>
          </l-tooltip>
        </l-marker>
      </l-polyline>
    </l-map>
  </div>
</template>

<script setup lang="ts">
import {
  LPolyline,
  LMap,
  LTileLayer,
  LCircle,
  LControlZoom,
  LMarker,
  LControlScale,
  LTooltip,
  LPopup,
  LIcon,
  LWmsTileLayer,
  LControl,
  LControlAttribution,
} from "@vue-leaflet/vue-leaflet";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import { MapvLayer } from "@supermap/iclient-leaflet";
//import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const mapRef = ref(null);
//const first_route = ref(L.latLng(11.6, 37));

onMounted(() => {
  const baseLayer = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "OSM",
      //'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  if (props.toTrackWithRealAddressLine) {
    const map = L.map("map", {
      center: [props.center.lat, props.center.lng],
      zoom: 7,
      zoomControl: true,
      layers: [baseLayer],
    });

    const waypoints = computed(() => {
      return props.polylinePoints?.map((element) => {
        return L.latLng(element.lat, element.lng);
      });
    });

    let control = L.Routing.control({
      plan: L.Routing.plan(waypoints.value, {
        createMarker: (i, wp) => {
          console.log(i);
          if (props.polylinePoints[i].icon) {
            return L.marker(wp.latLng, {
              draggable: false,

              icon: L.icon({
                iconUrl: props.polylinePoints[i].icon,
                iconSize: [20, 24],
              }),
            }).bindPopup(props.polylinePoints[i].popup_info.name);
          } else {
            return L.marker(wp.latLng, {
              draggable: false,
            }).bindPopup(props.polylinePoints[i].popup_info.name);
          }
        },
        draggableWaypoints: false,
      }),
      addWaypoints: false,

      show: true,
      collapsible: false,
      showAlternatives: true,
      autoRoute: true,

      alternativeClassName: "alternative",
      fitSelectedRoutes: true,
      router: L.Routing.osrmv1({
        serviceUrl: "http://router.project-osrm.org/route/v1",
        profile: "driving",
      }),
    });
    control.on("routeselected", function (e) {
      e.route.itinerary.createHTML = function () {};
    });
    if (props.toTrackWithRealAddressLine)
      control.addTo(map).on("click", (e) => {
        console.log(e);
      });
  }
});

interface CenterLocation {
  lat: number;
  lng: number;
}

interface Point {
  icon?: string;
  lng: number;
  lat: number;
  popup_info?: any;
  tooltip?: any;
}

interface InformationInterface {
  id?: number | string;
  lat: number;
  lng: number;
  icon?: string;
  tooltip?: any;
  isPersistenceTooltip: boolean;
  popup?: any;
  staticAnchor?: Array<number>;
  customText?: string | any;
  iconSize?: number;
}

interface PropsInterface {
  center: CenterLocation;
  information?: Array<InformationInterface>;
  maxZoom: number;
  minZoom?: number;
  zoom?: number;
  polylinePoints?: Array<Point>;
  polylineColor?: string;
  toTrackWithRealAddressLine?: boolean;
}

const props = withDefaults(defineProps<PropsInterface>(), {
  toTrackWithRealAddressLine: false,
});

watchEffect(() => {
  console.log(props.information, "dsjkhfkjshfsfhsfkshfkjhsdfhfhsdffhsh");
});
const polyline = computed(() => {
  if (props.polylinePoints?.length)
    return props.polylinePoints?.map((point) => {
      return [point.lat, point.lng];
    });

  return [];
});

const informs = computed(() => {
  return props.information;
});

const mapboxTileLayerUrl =
  "https://api.mapbox.com/styles/v1/hodadis/clim1vtrp00k901r1f70tbb1b/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiaG9kYWRpcyIsImEiOiJjbGltMWFxNHcwYTE5M2txcjlhb284cTM2In0.HqW6qDa1cfU4z3AXAIiD-g";

const mapboxAttribution =
  'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors';
</script>
<style scoped>
.leaflet-control-container .leaflet-routing-container-hide {
  display: none;
}
.alternative {
  background-color: blueviolet;
}

.someExtraClass {
  background-color: aqua;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 0 20px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
}
</style>
