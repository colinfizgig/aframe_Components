AFRAME.registerComponent('set-linear-encoding', {
  schema: {
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
init: function(){

			this.el.sceneEl.addEventListener('loaded', function (e) {
			  this.sceneEl.object3D.traverse( function (o) {
				if (o.isMesh && o.material.map)  {
				  o.material.map.encoding = THREE.sRGBEncoding;
				  o.material.needsUpdate = true;
				}
			  });
			});
			
			this.el.sceneEl.renderer.gammaOutput = true;

	}
});