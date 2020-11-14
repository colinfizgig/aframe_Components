/**
 * Specifies an envMap on an entity, without replacing any existing material
 * properties.
 */
AFRAME.registerComponent('refract-cube-env', {
  schema: {
	    resolution: { type:'number', default: 128},
	    distance: {type:'number', default: 100000},
		refractionratio: {type:'float', default: 1.1},
	    interval: { type:'number', default: 1000},
	    repeat: { type:'boolean', default: false}
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function(){
	    this.counter = this.data.interval;
	    this.cam = new THREE.CubeCamera( 1.0, this.data.distance, this.data.resolution);
		
		this.cam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.cam.renderTarget.texture.mapping =  THREE.CubeRefractionMapping;
		this.cam.renderTarget.texture.generateMipmaps = true;
	    this.el.object3D.add( this.cam );

	    this.done = false;
		var myCam = this.cam;
		var myRatio = this.data.refractionratio;
		var myEl = this.el;
		var myMesh = this.el.getObject3D('mesh');

		this.el.addEventListener('model-loaded', () => {

			// Grab the mesh / scene.
			const obj = this.el.getObject3D('mesh');
			// Go over the submeshes and modify materials we want.
			
			obj.traverse(node => {
				if (node.type.indexOf('Mesh') !== -1) {
						node.material.envMap = myCam.renderTarget.texture;
						node.material.refractionRatio = myRatio;
						node.material.needsUpdate = true;
				}
			});
		});      
			  
	  },
	  
	  tick: function(t,dt){
		if(!this.done){
			  if( this.counter > 0){
				this.counter-=dt;
			  }else{
				myRedraw(this.cam, this.el, this.el.getObject3D('mesh'));
				if(!this.data.repeat){
					this.done = true;
					this.counter = this.data.interval;
				}
			  }
			}

		
		function myRedraw(myCam, myEl, myMesh){
			myMesh.visible = false;

	        AFRAME.scenes[0].renderer.autoClear = true;
			var camVector = new THREE.Vector3();
			myEl.object3D.getWorldPosition(camVector);
	        myCam.position.copy(myEl.object3D.worldToLocal(camVector));
	        myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );
			if(myMesh){
				myMesh.traverse( function( child ) { 
					if ( child instanceof THREE.Mesh ) {

					}
				});
			}
			myMesh.visible = true;
		}
	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {
		myUpdate(this.cam, this.el, this.el.getObject3D('mesh'));
		function myUpdate(myCam, myEl, myMesh){
			myMesh.visible = false;

	        AFRAME.scenes[0].renderer.autoClear = true;
	        var camVector = new THREE.Vector3();
			myEl.object3D.getWorldPosition(camVector);
	        myCam.position.copy(myEl.object3D.worldToLocal(camVector));
	        myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );
			if(myMesh){
				myMesh.traverse( function( child ) { 
					if ( child instanceof THREE.Mesh ) {

					}
				});
			}
			myMesh.visible = true;
		}
	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {},

	  /**
	   * Called on each scene tick.
	   */
	  // tick: function (t) { },

	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	  pause: function () { },

	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	  play: function () { }
	});