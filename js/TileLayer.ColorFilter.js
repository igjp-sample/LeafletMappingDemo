/*
  Leaflet.TileLayer.ColorFilter
  (c) 2018, Claudio T. Kawakani
  A simple and lightweight Leaflet plugin to apply CSS filters on map tiles.
  https://github.com/xtk93x/Leaflet.TileLayer.ColorFilter
*/
L.TileLayer.ColorFilter = L.TileLayer.extend({
	intialize: function (url, options) {
		L.TileLayer.prototype.initialize.call(this, url, options);
	},

	colorFilter: function () {
		let VALIDFILTERS = [
			'blur:px',
			'brightness:%', 'bright:brightness:%', 'bri:brightness:%',
			'contrast:%', 'con:contrast:%',
			'grayscale:%', 'gray:grayscale:%',
			'hue-rotate:deg', 'hue:hue-rotate:deg', 'hue-rotation:hue-rotate:deg',
			'invert:%', 'inv:invert:%',
			'opacity:%', 'op:opacity:%',
			'saturate:%', 'saturation:saturate:%', 'sat:saturate:%',
			'sepia:%', 'sep:sepia:%',
		]

		let colorFilterOptions = this.options.filter ? this.options.filter : [];
		let filterSettings = colorFilterOptions.map((opt) => {
			let filter = opt.toLowerCase().split(':');
			if (filter.length === 2) {
				let match = VALIDFILTERS.find(vf => {
					return (vf.split(':')[0] === filter[0]);
				});
				if (match) {
					match = match.split(':');
					filter[1] += /^\d+$/.test(filter[1]) ? match[match.length - 1] : ''
					return (`${match[match.length - 2]}(${filter[1]})`);
				}
			}
			return ('');
		}).join(' ');
		return (filterSettings);
	},
	/* Version 1.3.4 */
	createTile: function (coords, done) {
		let tile = L.TileLayer.prototype.createTile.call(this, coords, done);
		tile.style.filter = this.colorFilter();
		return tile;
	},
	/* Version 0.7.7 */
	_getTile: function () {
		let tile = L.TileLayer.prototype._getTile.call(this);
		tile.style.filter = this.colorFilter();
		return tile;
	},
	updateFilter: function (newFilter) {
		this.options.filter = newFilter;
		for (let [key, value] of Object.entries(this._tiles)) {
			if (L.version === "0.7.7") {
				/* Version 0.7.7 */
				value.style.filter = this.colorFilter();
			} else {
				/* Version 1.3.4 */
				value.el.style.filter = this.colorFilter();
			}
		}
	},
})

L.tileLayer.colorFilter = function (url, options) {
	return new L.TileLayer.ColorFilter(url, options);
}