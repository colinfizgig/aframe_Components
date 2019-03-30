AFRAME.registerComponent('scalenormals', {
	
  schema: {
	    normalScaleX: { type:'number', default: 1},
		normalScaleY: { type:'number', default: 1}
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function(){
			const normalX = this.data.normalScaleX;
			const normalY = this.data.normalScaleY;
			
			  document.querySelector('a-scene').addEventListener('loaded', function (normalX, normalY) {
				  this.mesh = this.el.getObject3D('mesh');
				  if(this.mesh){
					this.mesh.traverse( function( child ) { 
						if ( child instanceof THREE.Mesh ) {
							child.material.normalScale.y *= normalY;
							child.material.normalScale.x *= normalX;
						}
					});
				  }
			  })   
			  
	  },
	  
	  update: function (oldData) {
		  /*
			const normalX = this.data.normalScaleX;
			const normalY = this.data.normalScaleY;
			
	          this.mesh = this.el.getObject3D('mesh');
	          if(this.mesh){
	            this.mesh.traverse( function( child ) { 
	                if ( child instanceof THREE.Mesh ) {
						child.material.normalScale.y *= normalY;
						child.material.normalScale.x *= normalX;
					}
	            });
	          }
			 */
	  }


});