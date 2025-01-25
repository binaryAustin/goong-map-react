export function getTerrainElevation(map, _ref) {
  let {
    longitude,
    latitude
  } = _ref;
  if (map && map.queryTerrainElevation) {
    return map.queryTerrainElevation([longitude, latitude]) || 0;
  }
  return 0;
}
//# sourceMappingURL=terrain.js.map