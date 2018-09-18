/**
 * Specifies an envMap on an entity, without replacing any existing material
 * properties.
 */
AFRAME.registerComponent('light-map-geometry', {
  schema: {
    path: {default: ''},
    format: {default: 'RGBFormat'}
  },

  init: function () {
    const data = this.data;
	const el = this.el;
	
	this.texture = new THREE.TextureLoader().load( data.path );

    this.applyLightMap();
    this.el.addEventListener('object3dset', this.applyLightMap.bind(this));
  },

  applyLightMap: function () {
    const mesh = this.el.getObject3D('mesh');
    const lightMap = this.texture;
	const el = this.el

    if (!mesh) return;
	


    mesh.traverse(function (node) {
	  if (node.geometry && node.geometry.type == "BufferGeometry"){
		  //console.log(node);
		  //console.log(node.geometry.attributes);
		  node.geometry.attributes.uv2 = node.geometry.attributes.uv.clone();
	  }
      if (node.material && 'lightMap' in node.material) {
		
        node.material.lightMap = lightMap;
        node.material.needsUpdate = true;
      }
	
    });
  }
});