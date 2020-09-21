/**
 * @param  {Array<THREE.Material>|THREE.Material} material
 * @return {Array<THREE.Material>}
 */
const ensureMaterialArray = (material) => {
  if (!material) {
    return []
  } else if (Array.isArray(material)) {
    return material
  } else if (material.materials) {
    return material.materials
  } else {
    return [material]
  }
}
/**
 * @param  {THREE.Object3D} mesh
 * @param  {Array<string>} materialNames
 * @param  {THREE.Texture} envMap
 * @param  {number} reflectivity  [description]
 */
const applyEnvMap = (mesh, materialNames, envMap, reflectivity) => {
  if (!mesh) {
    return
  }
  
  materialNames = materialNames || []
  mesh.traverse((node) => {
    if (!node.isMesh) {
      return
    }
    const meshMaterials = ensureMaterialArray(node.material)
    meshMaterials.forEach((material) => {
      if (material && !('envMap' in material)) {
        return
      }
      if (materialNames.length && materialNames.indexOf(material.name) === -1) {
        return
      }
      material.envMap = envMap;
      material.reflectivity = reflectivity;
      material.needsUpdate = true;
    })
  })
}
const toUrl = (urlOrId) => {
  const img = document.querySelector(urlOrId)
  return img ? img.src : urlOrId
}
const cubeEnvMapComponent = {
  multiple: true,
  schema: {
    posx: { default: '#posx' },
    posy: { default: '#posy' },
    posz: { default: '#posz' },
    negx: { default: '#negx' },
    negy: { default: '#negy' },
    negz: { default: '#negz' },
    extension: { default: 'jpg', oneOf: ['jpg', 'png'] },
    format: { default: 'RGBFormat', oneOf: ['RGBFormat', 'RGBAFormat'] },
    enableBackground: { default: false },
    reflectivity: { default: 1, min: 0, max: 1},
    materials: { default: []},
  },
  init: function () {
    const data = this.data;
   
    this.texture = new THREE.CubeTextureLoader().load([
      toUrl(data.posx), toUrl(data.negx),
      toUrl(data.posy), toUrl(data.negy),
      toUrl(data.posz), toUrl(data.negz)
    ])
    
    this.texture.format = THREE[data.format]
    this.object3dsetHandler = () => {
      const mesh = this.el.getObject3D('mesh')
      const data = this.data
      applyEnvMap(mesh, data.materials, this.texture, data.reflectivity)
    }
    this.el.addEventListener('object3dset', this.object3dsetHandler)
  },
  update: function (oldData) {
    const data = this.data
    const mesh = this.el.getObject3D('mesh')
    let addedMaterialNames = []
    let removedMaterialNames = []
    if (data.materials.length) {
      if (oldData.materials) {
        addedMaterialNames = data.materials.filter((name) => !oldData.materials.includes(name))
        removedMaterialNames = oldData.materials.filter((name) => !data.materials.includes(name))
      } else {
        addedMaterialNames = data.materials
      }
    }
    if (addedMaterialNames.length) {
      applyEnvMap(mesh, addedMaterialNames, this.texture, data.reflectivity)
    }
    if (removedMaterialNames.length) {
      applyEnvMap(mesh, removedMaterialNames, null, 1)
    }
    if (oldData.materials && data.reflectivity !== oldData.reflectivity) {
      const maintainedMaterialNames = 
        data.materials.filter((name) => oldData.materials.includes(name))
      if (maintainedMaterialNames.length) {
        applyEnvMap(mesh, maintainedMaterialNames, this.texture, data.reflectivity)
      }
    }
    if (this.data.enableBackground && !oldData.enableBackground) {
      this.setBackground(this.texture)
    } else if (!this.data.enableBackground && oldData.enableBackground) {
      this.setBackground(null)
    }
  },
  remove: function () {
    this.el.removeEventListener('object3dset', this.object3dsetHandler)
    applyEnvMap(this.el.getObject3D('mesh'), this.data.materials, null, 1)
    if (this.data.enableBackground) {
      this.setBackground(null)
    }
  },
  setBackground: function (texture) {
    this.el.sceneEl.object3D.background = texture;
  }
}
export {cubeEnvMapComponent}