document.onreadystatechange = function () {
  if (document.readyState == "complete") {	
	var osm_attr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
	var ts  = 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=a0b0612456064c01a5aa81dbb0670862'
	var tl  = L.tileLayer(ts, { maxZoom: 19, minZoom: 6, attribution: osm_attr });			
	map = L.map('map', {								 
		center: [53.916667, 27.55],
		zoom: 7, // 12 minsk //6 belarus
		layers: [tl]
	});
	var cities = [];
	var citiesOverlay = L.d3SvgOverlay(function(sel,proj){		
		var minLogPop = Math.log2(d3.min(cities,function(d){return d.qty;}));
		var citiesUpd = sel.selectAll('circle').data(cities);
		  citiesUpd.enter()
			.append('circle')
			.attr('r', function(d){return Math.log2(d.qty) - minLogPop + 2;})
			.attr('cx', function(d){return proj.latLngToLayerPoint(d.latLng).x;})
			.attr('cy', function(d){return proj.latLngToLayerPoint(d.latLng).y;})
			.attr('stroke', 'black')
			.attr('stroke-width', 1)
			.attr('fill', "darkred");
	});
	d3.json("/api/cities", function(data) {
		if (data) {
			cities = data.map(function(d){ return d.latLng = [+d.lat,+d.lon], d; });
			citiesOverlay.addTo(map);
		}
	});
  }
}