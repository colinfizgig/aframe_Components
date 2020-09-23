/**
 * Specifies an envMap on an entity, without replacing any existing material
 * properties.
 */
 
	  
AFRAME.registerComponent('camera-cube-env', {
  schema: {
	    resolution: { type:'number', default: 128},
	    distance: {type:'number', default: 10000},
	    interval: { type:'number', default: 1000},
		metalness: { type:'float', default: 1.0},
		roughness: { type:'float', default: 0.5},
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
		this.cam.renderTarget.texture.generateMipmaps = true;
	    this.el.object3D.add( this.cam );

	    this.done = false;
		var myCam = this.cam;
		var myEl = this.el;
		var myScene = document.querySelector('a-scene').object3D;
		var myMesh = this.el.getObject3D('mesh');
		
		//this method does target for skinned meshes and unskinned
		this.el.addEventListener('model-loaded', () => {
			// Grab the mesh / scene.
			const obj = this.el.getObject3D('mesh');
			// Go over the submeshes and modify materials we want.
			
			obj.traverse(node => {
				var myCam = this.cam;
				var myEl = this.el;
				var myScene = document.querySelector('a-scene').object3D;
				var myMesh = this.el.getObject3D('mesh');
				myMesh.visible = false;

				AFRAME.scenes[0].renderer.autoClear = true;
				myCam.position.copy(myEl.object3D.worldToLocal(myEl.object3D.getWorldPosition()));
				myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );

				if (node.type.indexOf('Mesh') !== -1) {
					node.material.metalness = this.data.metalness;
					node.material.roughness = this.data.roughness;
					node.material.envMap = myCam.renderTarget.texture;
					node.material.needsUpdate = true;
				}
				myMesh.visible = true;
			});
		});
		
		/* does not target skinned meshes
		myScene.addEventListener('loaded', () => {
			var myCam = this.cam;
			var myEl = this.el;
			var myScene = document.querySelector('a-scene').object3D;
			var myMesh = this.el.getObject3D('mesh');
			myMesh.visible = false;

			AFRAME.scenes[0].renderer.autoClear = true;
			myCam.position.copy(myEl.object3D.worldToLocal(myEl.object3D.getWorldPosition()));
			myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );
			
			if(myMesh){
				myMesh.traverse( function( child ) { 
					if ( child instanceof THREE.Mesh ) {
						child.material.color.set('green');
						child.material.envMap = myCam.renderTarget.texture;
						child.material.needsUpdate = true;
					}
					});
			}
			myMesh.visible = true;
			
		});
		*/
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
	        myCam.position.copy(myEl.object3D.worldToLocal(myEl.object3D.getWorldPosition()));
	        myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );
			if(myMesh){
				myMesh.traverse( function( child ) { 
					if ( child instanceof THREE.Mesh ) {
						child.material.envMap = myCam.renderTarget.texture;
						child.material.needsUpdate = true;
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
	        myCam.position.copy(myEl.object3D.worldToLocal(myEl.object3D.getWorldPosition()));
	        myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );
			if(myMesh){
				myMesh.traverse( function( child ) { 
					if ( child instanceof THREE.Mesh ) {
						child.material.envMap = myCam.renderTarget.texture;
						child.material.needsUpdate = true;
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